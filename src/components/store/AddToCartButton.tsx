"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface AddToCartButtonProps {
  inventoryItems: any[];
  productId: string;
}

export function AddToCartButton({ inventoryItems, productId }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(inventoryItems[0]?.size || "");
  const [selectedColor, setSelectedColor] = useState<string>(inventoryItems[0]?.color || "");

  const uniqueSizes = Array.from(new Set(inventoryItems.map(i => i.size)));
  const uniqueColors = Array.from(new Set(inventoryItems.map(i => i.color)));

  const handleAddToCart = async () => {
    // Find matching inventory ID
    const variant = inventoryItems.find((i) => i.size === selectedSize && i.color === selectedColor);
    
    if (!variant) {
      alert("This variant is out of stock.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inventoryId: variant._id, quantity: 1 }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to add to cart");
      } else {
        alert("Added to cart successfully!");
        // Typically we would trigger a re-fetch or context update here
      }
    } catch (e) {
      alert("Error adding to cart.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 space-y-6">
      {/* Colors */}
      <div>
        <div className="mb-3 flex justify-between text-xs tracking-widest uppercase">
          <span>Color</span>
          <span className="text-brand-gray">{selectedColor}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {uniqueColors.map((color: any) => (
            <button 
              key={color} 
              onClick={() => setSelectedColor(color)}
              className={`h-8 w-8 rounded-full border-2 border-transparent transition-all hover:scale-110 ${color === selectedColor ? 'ring-2 ring-brand-black ring-offset-2' : 'ring-1 ring-brand-border ring-offset-2'}`}
              style={{ backgroundColor: color.toLowerCase() === 'black' ? '#000' : color.toLowerCase() === 'camel' ? '#c19a6b' : color.toLowerCase() === 'navy' ? '#000080' : color.toLowerCase() === 'cream' ? '#fdfbf7' : color.toLowerCase() === 'charcoal' ? '#36454F' : '#e5e5e5' }}
              aria-label={color}
            />
          ))}
        </div>
      </div>
      
      {/* Sizes */}
      <div>
        <div className="mb-3 flex justify-between text-xs tracking-widest uppercase">
          <span>Size</span>
          <button className="text-brand-gray underline hover:text-brand-black">Size Guide</button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {uniqueSizes.map((size: any) => (
            <button 
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`flex h-12 items-center justify-center border text-sm transition-colors ${size === selectedSize ? 'border-brand-black bg-brand-black text-white' : 'border-brand-border bg-transparent text-brand-black hover:border-brand-black'}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      
      <Button 
        variant="primary" 
        size="lg" 
        className="mb-4 w-full"
        onClick={handleAddToCart}
        isLoading={loading}
      >
        Add to Cart
      </Button>
    </div>
  );
}
