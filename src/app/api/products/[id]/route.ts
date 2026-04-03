import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Product from "@/lib/db/models/Product";
import Inventory from "@/lib/db/models/Inventory";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET single product
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const product = await Product.findById(params.id).lean();
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const inventory = await Inventory.find({ product: product._id }).lean();
    return NextResponse.json({ ...product, inventory });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update product (Admin)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await dbConnect();

    // Map `name` to `title` as requested in spec vs existing schema
    const updateData = { ...body };
    if (body.name) {
      updateData.title = body.name;
    }

    const product = await Product.findByIdAndUpdate(params.id, updateData, { new: true });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE product (Admin)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    // Cleanup inventory
    await Inventory.deleteMany({ product: params.id });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
