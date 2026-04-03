"use client";

import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { SearchForm } from "./SearchForm";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-border bg-brand-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Links (Desktop) */}
        <nav className="hidden space-x-8 md:flex">
          <Link href="/catalog?category=new" className="text-sm font-medium uppercase tracking-widest text-brand-gray transition-colors hover:text-brand-black">
            New Arrivals
          </Link>
          <Link href="/catalog?category=clothing" className="text-sm font-medium uppercase tracking-widest text-brand-gray transition-colors hover:text-brand-black">
            Clothing
          </Link>
          <Link href="/catalog?category=accessories" className="text-sm font-medium uppercase tracking-widest text-brand-gray transition-colors hover:text-brand-black">
            Accessories
          </Link>
          <Link href="/about" className="text-sm font-medium uppercase tracking-widest text-brand-gray transition-colors hover:text-brand-black">
            Our Story
          </Link>
        </nav>

        {/* Brand Logo */}
        <div className="flex flex-1 justify-center md:flex-none">
          <Link href="/" className="text-2xl font-bold tracking-[0.2em] uppercase">
            Aura
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-6">
          <SearchForm />
          
          <Link href={session ? "/profile" : "/login"} aria-label="Account" className="text-brand-black transition-transform hover:scale-110">
            <User size={20} />
          </Link>
          
          <button aria-label="Cart" className="relative text-brand-black transition-transform hover:scale-110">
            <ShoppingBag size={20} />
            <span className="absolute -bottom-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-black text-[10px] text-white">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
