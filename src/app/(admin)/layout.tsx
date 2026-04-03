import Link from "next/link";
import { Package, LayoutDashboard, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-brand-light-gray">
      {/* Admin Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-brand-border h-screen sticky top-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-brand-border">
          <h2 className="text-sm tracking-widest uppercase font-bold">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 text-sm text-brand-black hover:bg-brand-light-gray transition-colors rounded-lg">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-3 px-4 py-3 text-sm text-brand-black hover:bg-brand-light-gray transition-colors rounded-lg">
            <Package size={18} />
            <span>Products</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen bg-transparent">
        {children}
      </main>
    </div>
  );
}
