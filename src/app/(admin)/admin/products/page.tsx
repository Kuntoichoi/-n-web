"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: "", name: "", price: "", description: "", category: "", stock: "" });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product?: any) => {
    if (product) {
      setFormData({
        id: product._id,
        name: product.title,
        price: product.price.toString(),
        description: product.description,
        category: product.category,
        stock: "10" // Simplified for this CRUD, actual stock is in inventory variant
      });
    } else {
      setFormData({ id: "", name: "", price: "", description: "", category: "", stock: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = formData.id ? "PUT" : "POST";
    const url = formData.id ? `/api/products/${formData.id}` : "/api/products";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        category: formData.category,
        stock: Number(formData.stock)
      }),
    });

    setIsModalOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8 border-b border-brand-border pb-4">
        <h1 className="text-2xl font-medium tracking-wide">Products Management</h1>
        <Button onClick={() => handleOpenModal()} size="sm" variant="primary">Add New Product</Button>
      </div>

      <div className="overflow-x-auto border border-brand-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-border bg-brand-light-gray text-xs uppercase tracking-widest text-brand-gray">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-brand-gray text-xs uppercase">Loading...</td></tr>
            ) : products.map((p: any) => (
              <tr key={p._id} className="hover:bg-brand-light-gray/50 transition-colors">
                <td className="px-6 py-4 font-medium">{p.title}</td>
                <td className="px-6 py-4">{p.category}</td>
                <td className="px-6 py-4">{formatPrice(p.price)}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => handleOpenModal(p)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? "Edit Product" : "New Product"}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Product Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <Input label="Category" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price" type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            <Input label="Initial Stock" type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Description</label>
            <textarea required className="w-full border border-brand-border p-3 text-sm focus:border-brand-black focus:outline-none" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <Button type="submit" className="w-full">Save Product</Button>
        </form>
      </Modal>
    </div>
  );
}
