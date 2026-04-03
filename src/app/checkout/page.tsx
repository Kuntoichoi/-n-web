"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: "123 Minimalism St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA"
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: formData,
          paymentMethod
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Success
        alert("Order placed successfully! Order ID: " + data.orderId);
        router.push("/catalog");
      } else {
        alert(data.error || "Failed to checkout");
      }
    } catch (err) {
      alert("Error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-2xl">
      <h1 className="mb-8 text-2xl font-light tracking-[0.1em] uppercase border-b border-brand-border pb-4">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Shipping form */}
        <div>
          <h2 className="mb-4 text-sm font-medium tracking-widest uppercase">Shipping Details</h2>
          <div className="space-y-4">
            <Input 
              label="Street Address" 
              value={formData.street} 
              onChange={e => setFormData({...formData, street: e.target.value})} 
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="City" 
                value={formData.city} 
                onChange={e => setFormData({...formData, city: e.target.value})} 
                required
              />
              <Input 
                label="State" 
                value={formData.state} 
                onChange={e => setFormData({...formData, state: e.target.value})} 
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Zip Code" 
                value={formData.zipCode} 
                onChange={e => setFormData({...formData, zipCode: e.target.value})} 
                required
              />
              <Input 
                label="Country" 
                value={formData.country} 
                onChange={e => setFormData({...formData, country: e.target.value})} 
                required
              />
            </div>
          </div>
        </div>
        
        {/* Payment Mock */}
        <div>
          <h2 className="mb-4 text-sm font-medium tracking-widest uppercase">Payment Method</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-3 border border-brand-border p-4 cursor-pointer hover:bg-brand-light-gray transition-colors">
              <input 
                type="radio" 
                name="payment" 
                value="Gateway" 
                checked={paymentMethod === "Gateway"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 text-brand-black focus:ring-brand-black" 
              />
              <span className="text-sm font-medium">Credit Card (Mock)</span>
            </label>
            <label className="flex items-center space-x-3 border border-brand-border p-4 cursor-pointer hover:bg-brand-light-gray transition-colors">
              <input 
                type="radio" 
                name="payment" 
                value="COD" 
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 text-brand-black focus:ring-brand-black" 
              />
              <span className="text-sm font-medium">Cash on Delivery</span>
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
          Place Order
        </Button>
      </form>
    </div>
  );
}
