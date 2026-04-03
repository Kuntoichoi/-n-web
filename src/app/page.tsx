import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex h-[85vh] w-full flex-col items-center justify-center overflow-hidden bg-brand-light-gray">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
          alt="Minimalist Fashion Hero"
          fill
          priority
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-brand-black/20" />
        <div className="relative z-10 flex flex-col items-center text-center text-white px-4">
          <h1 className="mb-6 max-w-4xl text-5xl font-light leading-tight tracking-[0.15em] sm:text-6xl md:text-7xl uppercase">
            Define Your <br /> Aura
          </h1>
          <p className="mb-10 max-w-xl text-sm font-light tracking-widest uppercase md:text-base">
            High-end minimalist essentials for the modern wardrobe.
          </p>
          <div className="flex gap-4">
            <Link href="/catalog">
              <Button size="lg" className="bg-white text-brand-black hover:bg-white/90">
                Explore Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 flex items-end justify-between border-b border-brand-border pb-6">
          <h2 className="text-3xl font-light tracking-[0.1em] uppercase">Curated Categories</h2>
          <Link href="/catalog" className="text-sm tracking-widest underline uppercase hover:text-brand-gray">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            { name: "Outerwear", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop" },
            { name: "Knitwear", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop" },
            { name: "Essentials", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop" }
          ].map((cat) => (
            <Link key={cat.name} href={`/catalog?category=${cat.name.toLowerCase()}`} className="group relative aspect-[3/4] overflow-hidden bg-brand-light-gray">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-xl font-light tracking-widest text-white uppercase">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-brand-black py-32 text-white">
        <div className="container mx-auto flex flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-8 h-px w-24 bg-white/30" />
          <h2 className="mb-8 max-w-3xl text-3xl font-light leading-snug tracking-wide sm:text-4xl">
            "We believe in fewer, better things. Garments that outlast trends and become an extension of your identity."
          </h2>
          <p className="text-sm tracking-widest uppercase text-white/60">Aura Design Philosophy</p>
        </div>
      </section>
    </div>
  );
}
