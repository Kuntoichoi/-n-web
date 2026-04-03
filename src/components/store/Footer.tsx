import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="container mx-auto grid grid-cols-1 gap-8 md:grid-cols-4">
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest">Aura</h3>
          <p className="text-sm text-brand-gray">
            Redefining minimalism. Explore curated pieces for the modern, intentional wardrobe.
          </p>
        </div>
        
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-gray">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/catalog?category=new" className="hover:underline">New Arrivals</Link></li>
            <li><Link href="/catalog?category=clothing" className="hover:underline">Clothing</Link></li>
            <li><Link href="/catalog?category=accessories" className="hover:underline">Accessories</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-gray">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
            <li><Link href="/shipping" className="hover:underline">Shipping & Returns</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-gray">Newsletter</h4>
          <p className="mb-4 text-xs text-brand-gray">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form className="flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full border-b border-brand-black bg-transparent py-2 text-sm focus:outline-none"
            />
            <button type="submit" className="ml-2 border-b border-brand-black py-2 text-xs font-bold uppercase tracking-widest">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      
      <div className="container mx-auto mt-12 flex flex-col items-center justify-between border-t border-brand-border pt-8 text-xs text-brand-gray md:flex-row">
        <p>&copy; {new Date().getFullYear()} Aura. All rights reserved.</p>
        <div className="mt-4 flex space-x-4 md:mt-0">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
