import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Cart from "@/lib/db/models/Cart";
import Inventory from "@/lib/db/models/Inventory";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("guest_session_id")?.value;

    let query: any = {};
    if (session?.user?.id) {
      query = { user: session.user.id };
    } else if (sessionId) {
      query = { sessionId };
    } else {
      return NextResponse.json({ items: [] });
    }

    const cart = await Cart.findOne(query)
      .populate({
        path: 'items.inventory',
        populate: { path: 'product', select: 'title price compareAtPrice images slug' }
      })
      .lean();

    return NextResponse.json(cart || { items: [] });
  } catch (error) {
    console.error("Cart GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { inventoryId, quantity } = body;
    
    if (!inventoryId || !quantity) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await dbConnect();
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("guest_session_id")?.value;

    let query: any = {};
    const isGuest = !session?.user?.id;

    if (!isGuest) {
      query = { user: session.user.id };
    } else {
      if (!sessionId) {
        sessionId = uuidv4();
        // Since we cannot easily set cookies from POST without response wrapping in Next >13,
        // we'll defer to client side or use NextResponse headers. Let's return it to the client.
      }
      query = { sessionId };
    }

    // Validate inventory
    const inventory = await Inventory.findById(inventoryId);
    if (!inventory || inventory.stockQuantity < quantity) {
      return NextResponse.json({ error: "Out of stock / Not enough quantity" }, { status: 400 });
    }

    let cart = await Cart.findOne(query);
    
    if (!cart) {
      cart = new Cart({ 
        user: session?.user?.id || undefined, 
        sessionId: isGuest ? sessionId : undefined,
        items: [{ inventory: inventoryId, quantity }] 
      });
    } else {
      const itemIndex = cart.items.findIndex((p: any) => p.inventory.toString() === inventoryId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ inventory: inventoryId, quantity });
      }
    }
    
    await cart.save();
    
    const response = NextResponse.json(cart);
    if (isGuest && sessionId) {
      response.cookies.set("guest_session_id", sessionId, { maxAge: 60 * 60 * 24 * 30 }); // 30 days
    }
    
    return response;
  } catch (error) {
    console.error("Cart POST Error:", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}
