"use server";

import dbConnect from "@/lib/db/connect";
import Order from "@/lib/db/models/Order";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    // Simplistic RBAC check
    if (!session || session.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    order.status = newStatus;
    await order.save();
    
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
