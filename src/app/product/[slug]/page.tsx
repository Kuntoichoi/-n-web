import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/db/connect";
import Product from "@/lib/db/models/Product";
import Inventory from "@/lib/db/models/Inventory";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { AddToCartButton } from "@/components/store/AddToCartButton";

async function getProductAndInventory(slug: string) {
  try {
    await dbConnect();
    
    const product = await Product.findOne({ slug, status: 'active' }).lean();
    
    if (!product) {
      return null;
    }
    
    const inventory = await Inventory.find({ product: product._id }).lean();
    
    return { product, inventory };
  } catch (error) {
    return null; /* catch Mongoose connection resets */
  }
}

export const revalidate = 60; // ISR cache every 60s

export async function generateMetadata({ params }: { params: { slug: string } }) {
  await dbConnect();
  const product = await Product.findOne({ slug: params.slug }).lean();
  if (!product) return { title: 'Product Not Found - Aura' };
  
  return {
    title: `${product.title} | Aura`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getProductAndInventory(params.slug);
  
  if (!data) {
    notFound();
  }
  
  const { product, inventory } = data;
  
  // Basic derived variants logic for UI
  const uniqueSizes = Array.from(new Set(inventory.map((inv: any) => inv.size)));
  const uniqueColors = Array.from(new Set(inventory.map((inv: any) => inv.color)));

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-12 lg:flex-row">
        
        {/* Gallery */}
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {product.images.map((img: any, idx: number) => (
              <div key={idx} className={`relative aspect-[3/4] overflow-hidden bg-brand-light-gray ${idx === 0 ? 'md:col-span-2' : ''}`}>
                <Image
                  src={img.url}
                  alt={img.alt || product.title}
                  fill
                  className="object-cover"
                  priority={idx === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="flex-1 lg:max-w-md">
          <div className="sticky top-24">
            <nav className="mb-4 text-xs tracking-widest text-brand-gray uppercase">
              <Link href="/" className="hover:text-brand-black">Home</Link>
              <span className="mx-2">/</span>
              <Link href={`/catalog?category=${product.category.toLowerCase()}`} className="hover:text-brand-black">{product.category}</Link>
            </nav>
            
            <h1 className="mb-2 text-3xl font-light tracking-wide">{product.title}</h1>
            
            <div className="mb-8 flex items-end gap-3 tracking-wide">
              <span className="text-xl font-medium">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-sm tracking-wide text-brand-gray line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>
            
            <p className="mb-8 text-sm font-light leading-relaxed text-brand-gray">
              {product.description}
            </p>
            
            <AddToCartButton 
              inventoryItems={JSON.parse(JSON.stringify(inventory))} 
              productId={product._id.toString()} 
            />
            
            <Button variant="outline" size="lg" className="w-full">
              Add to Wishlist
            </Button>
            
            <div className="mt-12 space-y-4 border-t border-brand-border pt-8 text-sm text-brand-gray">
              <div className="flex justify-between">
                <span>Free shipping on all orders</span>
              </div>
              <div className="flex justify-between">
                <span>14 days right of return</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
