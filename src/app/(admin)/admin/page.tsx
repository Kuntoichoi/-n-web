import dbConnect from "@/lib/db/connect";
import Order from "@/lib/db/models/Order";
import Product from "@/lib/db/models/Product";
import User from "@/lib/db/models/User";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelector } from "@/components/admin/OrderStatusSelector";

export const revalidate = 0; // Ensures fresh data for Admin dashboard

export default async function AdminDashboard() {
  await dbConnect();

  const [totalOrders, totalRevenueData, totalProducts, totalUsers] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Product.countDocuments(),
    User.countDocuments()
  ]);

  const totalRevenue = totalRevenueData[0]?.total || 0;

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email')
    .lean();

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-medium tracking-wide">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <div className="border border-brand-border bg-white p-6 shadow-sm">
          <p className="text-sm text-brand-gray uppercase tracking-widest mb-2">Total Revenue</p>
          <p className="text-3xl font-light">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="border border-brand-border bg-white p-6 shadow-sm">
          <p className="text-sm text-brand-gray uppercase tracking-widest mb-2">Orders</p>
          <p className="text-3xl font-light">{totalOrders}</p>
        </div>
        <div className="border border-brand-border bg-white p-6 shadow-sm">
          <p className="text-sm text-brand-gray uppercase tracking-widest mb-2">Products</p>
          <p className="text-3xl font-light">{totalProducts}</p>
        </div>
        <div className="border border-brand-border bg-white p-6 shadow-sm">
          <p className="text-sm text-brand-gray uppercase tracking-widest mb-2">Users</p>
          <p className="text-3xl font-light">{totalUsers}</p>
        </div>
      </div>

      <h2 className="mb-6 text-xl font-medium tracking-wide">Recent Orders</h2>
      <div className="overflow-x-auto border border-brand-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-border bg-brand-light-gray text-xs uppercase tracking-widest text-brand-gray">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {recentOrders.map((order: any) => (
              <tr key={order._id.toString()} className="hover:bg-brand-light-gray/50 transition-colors">
                <td className="px-6 py-4 font-medium">{order._id.toString().substring(0, 8)}...</td>
                <td className="px-6 py-4">{order.user?.name || 'Guest'}</td>
                <td className="px-6 py-4">
                  <OrderStatusSelector orderId={order._id.toString()} currentStatus={order.status} />
                </td>
                <td className="px-6 py-4 text-right">{formatPrice(order.total)}</td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-brand-gray">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
