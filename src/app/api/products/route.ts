import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Product from "@/lib/db/models/Product";
import Inventory from "@/lib/db/models/Inventory";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET all products
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q");

    await dbConnect();

    let query: any = {};
    if (category) query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    if (q) query.$text = { $search: q };

    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create product (Admin only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, price, description, images, category, variants } = body;
    // variants expected as [{ size, color, stockQuantity, sku }]

    if (!name || !price || !description) {
      return NextResponse.json({ error: "Missing required fields: name, price, description" }, { status: 400 });
    }

    await dbConnect();

    // Generate simple slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

    const product = new Product({
      title: name,
      slug,
      description,
      price: Number(price),
      category: category || "Uncategorized",
      images: images || [],
      status: 'active'
    });

    await product.save();

    // Create inventory items
    if (variants && Array.isArray(variants)) {
      const inventoryDocs = variants.map(v => ({
        product: product._id,
        size: v.size || 'OS',
        color: v.color || 'Default',
        sku: v.sku || `${slug}-${v.size}-${v.color}`,
        stockQuantity: Number(v.stock) || Number(v.stockQuantity) || 0
      }));
      await Inventory.insertMany(inventoryDocs);
    } else {
      // Default variant
      await Inventory.create({
        product: product._id,
        size: 'OS',
        color: 'Default',
        sku: `${slug}-os`,
        stockQuantity: body.stock || 10
      });
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Product POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
