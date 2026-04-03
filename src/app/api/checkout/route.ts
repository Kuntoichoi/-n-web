import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Order from "@/lib/db/models/Order";
import Cart from "@/lib/db/models/Cart";
import Inventory from "@/lib/db/models/Inventory";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { shippingAddress, paymentMethod } = body;
    
    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json({ error: "Missing checkout fields" }, { status: 400 });
    }

    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const cart = await Cart.findOne({ user: session.user.id }).populate({
      path: 'items.inventory',
      populate: { path: 'product', select: 'title price' }
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    let subtotal = 0;
    const orderItems = [];

    // Verify stock and prepare order items
    for (const item of cart.items) {
      const inventory = await Inventory.findById(item.inventory._id);
      if (!inventory || inventory.stockQuantity < item.quantity) {
        return NextResponse.json({ error: `Not enough stock for ${item.inventory.product.title}` }, { status: 400 });
      }

      const itemTotal = item.inventory.product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: item.inventory.product._id,
        inventoryInfo: {
          size: item.inventory.size,
          color: item.inventory.color,
          sku: item.inventory.sku,
        },
        quantity: item.quantity,
        priceAtPurchase: item.inventory.product.price,
      });
      
      // Deduct stock (atomic realistically, but simplified here)
      inventory.stockQuantity -= item.quantity;
      await inventory.save();
    }

    const shippingFee = subtotal > 200 ? 0 : 15; // Mock rule: free shipping over $200
    const total = subtotal + shippingFee;

    const order = new Order({
      user: session.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'Gateway' ? 'paid' : 'pending', // Mock immediate payment for Gateway
      status: 'confirmed',
      subtotal,
      shippingFee,
      discount: 0,
      total,
    });

    await order.save();
    
    // Clear cart after checkout
    await Cart.findByIdAndDelete(cart._id);

    return NextResponse.json({ success: true, orderId: order._id });
  } catch (error) {
    console.error("Checkout POST Error:", error);
    return NextResponse.json({ error: "Failed to process checkout" }, { status: 500 });
  }
}
