"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => {
        setCart(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center">Loading cart...</div>;
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((acc: number, item: any) => acc + item.inventory.product.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-12 text-3xl font-light tracking-[0.1em] uppercase border-b border-brand-border pb-6">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-xl font-light text-brand-gray">Your cart is currently empty.</p>
          <Link href="/catalog" className="mt-8">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-12 lg:flex-row">
          <div className="flex-1 space-y-8">
            {items.map((item: any) => (
              <div key={item._id} className="flex gap-6 border-b border-brand-light-gray pb-6">
                <div className="relative h-32 w-24 overflow-hidden bg-brand-light-gray">
                  <Image 
                    src={item.inventory.product.images[0]?.url || ''} 
                    alt={item.inventory.product.title} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-sm font-medium">{item.inventory.product.title}</h3>
                      <p className="mt-1 text-xs text-brand-gray">Color: {item.inventory.color} | Size: {item.inventory.size}</p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.inventory.product.price)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-brand-border">
                      <button className="px-3 py-1 hover:bg-brand-light-gray">-</button>
                      <span className="px-3 py-1 text-sm">{item.quantity}</span>
                      <button className="px-3 py-1 hover:bg-brand-light-gray">+</button>
                    </div>
                    <button className="text-xs uppercase tracking-widest text-brand-gray underline hover:text-brand-black">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:w-96">
            <div className="bg-brand-light-gray p-6">
              <h2 className="mb-6 text-sm font-bold uppercase tracking-widest">Order Summary</h2>
              <div className="space-y-4 border-b border-brand-border pb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-gray">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-gray">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <div className="mt-6 flex justify-between font-bold text-lg tracking-wide">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <Link href="/checkout" className="mt-8 block w-full">
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
