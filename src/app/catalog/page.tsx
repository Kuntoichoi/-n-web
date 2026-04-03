import Link from "next/link";
import Image from "next/image";
import dbConnect from "@/lib/db/connect";
import Product from "@/lib/db/models/Product";
import { formatPrice } from "@/lib/utils";

// Server Component fetching products
async function getProducts(category?: string, queryStr?: string) {
  await dbConnect();
  
  let query: any = { status: 'active' };
  
  if (category) {
    query.category = { $regex: new RegExp(`^${category}$`, 'i') };
  }
  
  if (queryStr) {
    query.$text = { $search: queryStr };
  }
  
  // Sort by text score if searching, otherwise newest
  const sortOpt: any = queryStr ? { score: { $meta: "textScore" } } : { createdAt: -1 };
  
  const products = await Product.find(query)
    .sort(sortOpt)
    .lean();
  
  return products;
}

export const revalidate = 60; // ISR cache every 60s

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const awaitedParams = await searchParams;
  const category = awaitedParams.category as string | undefined;
  const q = awaitedParams.q as string | undefined;
  
  const products = await getProducts(category, q);

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 flex items-baseline justify-between border-b border-brand-border pb-6">
        <h1 className="text-4xl font-light tracking-[0.1em] uppercase">
          {q ? `Search: ${q}` : category ? category : "All Collection"}
        </h1>
        <div className="flex items-center space-x-4 text-sm font-medium uppercase tracking-widest text-brand-gray">
          <span>Sort By:</span>
          <select className="bg-transparent tracking-widest text-brand-black focus:outline-none">
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* Sidebar Filters */}
        <aside className="mb-8 w-full md:mb-0 md:w-64 md:shrink-0">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="mb-4 text-sm font-medium tracking-widest uppercase">Categories</h3>
              <ul className="space-y-3 text-sm text-brand-gray">
                <li><Link href="/catalog" className={`hover:text-brand-black ${!category ? 'font-bold text-brand-black' : ''}`}>All</Link></li>
                <li><Link href="/catalog?category=outerwear" className={`hover:text-brand-black ${category === 'outerwear' ? 'font-bold text-brand-black' : ''}`}>Outerwear</Link></li>
                <li><Link href="/catalog?category=knitwear" className={`hover:text-brand-black ${category === 'knitwear' ? 'font-bold text-brand-black' : ''}`}>Knitwear</Link></li>
                <li><Link href="/catalog?category=bottoms" className={`hover:text-brand-black ${category === 'bottoms' ? 'font-bold text-brand-black' : ''}`}>Bottoms</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 text-sm font-medium tracking-widest uppercase">Colors</h3>
              <div className="flex flex-wrap gap-2">
                <button aria-label="Black" className="h-6 w-6 rounded-full bg-black ring-1 ring-black ring-offset-2" />
                <button aria-label="White" className="h-6 w-6 rounded-full bg-white ring-1 ring-gray-300 ring-offset-2" />
                <button aria-label="Camel" className="h-6 w-6 rounded-full bg-[#c19a6b] ring-1 ring-transparent hover:ring-gray-300 ring-offset-2" />
                <button aria-label="Navy" className="h-6 w-6 rounded-full bg-[#000080] ring-1 ring-transparent hover:ring-gray-300 ring-offset-2" />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-xl font-light text-brand-gray">No products found for this collection.</p>
              <Link href="/catalog" className="mt-4 uppercase tracking-widest text-brand-black underline">
                Clear Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Link key={product._id.toString()} href={`/product/${product.slug}`} className="group relative flex flex-col">
                  <div className="relative aspect-[3/4] overflow-hidden bg-brand-light-gray mb-4">
                    <Image
                      src={product.images.find((img: any) => img.isPrimary)?.url || product.images[0]?.url || ''}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-brand-black">{product.title}</h3>
                      <p className="mt-1 text-xs text-brand-gray">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-brand-black">{formatPrice(product.price)}</p>
                      {product.compareAtPrice && (
                        <p className="text-xs text-brand-gray line-through">{formatPrice(product.compareAtPrice)}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
