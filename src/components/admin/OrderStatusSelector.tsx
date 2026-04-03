"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/lib/actions/admin";

export function OrderStatusSelector({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);

  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.error) {
        alert(res.error);
        setStatus(currentStatus); // Revert on failure
      }
    });
  };

  return (
    <select 
      value={status} 
      onChange={handleChange}
      disabled={isPending}
      className={`border px-2 py-1 text-xs rounded-full font-semibold focus:outline-none focus:ring-1 ${
        status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' : 
        status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
        status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
        'bg-blue-100 text-blue-800 border-blue-200'
      }`}
    >
      {statuses.map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
