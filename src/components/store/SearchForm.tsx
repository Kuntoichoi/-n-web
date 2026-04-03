"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  if (!isOpen) {
    return (
      <button 
        aria-label="Search" 
        onClick={() => setIsOpen(true)}
        className="text-brand-black transition-transform hover:scale-110"
      >
        <Search size={20} />
      </button>
    );
  }

  return (
    <div className="absolute inset-x-0 top-0 z-50 flex h-16 items-center bg-brand-white px-4 sm:px-6 lg:px-8 border-b border-brand-border">
      <div className="container mx-auto flex items-center">
        <form onSubmit={handleSubmit} className="flex flex-1 items-center">
          <Search size={20} className="text-brand-gray mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Search products..."
            className="w-full bg-transparent py-2 text-sm uppercase tracking-widest focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
        <button 
          aria-label="Close search" 
          onClick={() => setIsOpen(false)}
          className="ml-4 text-brand-black"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
