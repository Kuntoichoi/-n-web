import mongoose from 'mongoose';
import dbConnect from '../lib/db/connect';
import Product from '../lib/db/models/Product';
import Inventory from '../lib/db/models/Inventory';

const sampleProducts = [
  {
    title: 'Minimalist Overcoat',
    slug: 'minimalist-overcoat',
    description: 'A structured, high-end wool overcoat tailored for a sleek, modern silhouette.',
    price: 350,
    compareAtPrice: 500,
    category: 'Outerwear',
    status: 'active',
    images: [{ url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop', alt: 'Minimalist Overcoat', isPrimary: true }],
    variants: [
      { size: 'M', color: 'Black', sku: 'MO-BLK-M', stockQuantity: 15 },
      { size: 'L', color: 'Black', sku: 'MO-BLK-L', stockQuantity: 20 },
      { size: 'M', color: 'Camel', sku: 'MO-CAM-M', stockQuantity: 10 },
    ]
  },
  {
    title: 'Essential Cashmere Sweater',
    slug: 'essential-cashmere-sweater',
    description: 'Ultra-soft 100% cashmere knit sweater with a relaxed fit.',
    price: 180,
    category: 'Knitwear',
    status: 'active',
    images: [{ url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop', alt: 'Cashmere Sweater', isPrimary: true }],
    variants: [
      { size: 'S', color: 'Cream', sku: 'CS-CRM-S', stockQuantity: 25 },
      { size: 'M', color: 'Cream', sku: 'CS-CRM-M', stockQuantity: 30 },
      { size: 'L', color: 'Charcoal', sku: 'CS-CHR-L', stockQuantity: 10 },
    ]
  },
  {
    title: 'Tailored Wide-Leg Trousers',
    slug: 'tailored-wide-leg-trousers',
    description: 'High-waisted tailored trousers crafted from premium crepe wool. Perfect drape and elegant flow.',
    price: 150,
    category: 'Bottoms',
    status: 'active',
    images: [{ url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop', alt: 'Wide-Leg Trousers', isPrimary: true }],
    variants: [
      { size: '30', color: 'Navy', sku: 'TWT-NAV-30', stockQuantity: 12 },
      { size: '32', color: 'Navy', sku: 'TWT-NAV-32', stockQuantity: 15 },
      { size: '32', color: 'Black', sku: 'TWT-BLK-32', stockQuantity: 8 },
    ]
  }
];

async function seed() {
  try {
    console.log('Connecting to database...');
    // We mock process.env variables if running locally via ts-node, but here we expect the user to run it with Next.js environment loaded
    await dbConnect();
    console.log('Connected.');

    console.log('Clearing existing products and inventory...');
    await Product.deleteMany({});
    await Inventory.deleteMany({});

    console.log('Seeding products...');
    for (const p of sampleProducts) {
      const { variants, ...productData } = p;
      
      const newProduct = await Product.create(productData);
      
      const inventoryDocs = variants.map(v => ({
        product: newProduct._id,
        size: v.size,
        color: v.color,
        sku: v.sku,
        stockQuantity: v.stockQuantity,
      }));

      await Inventory.insertMany(inventoryDocs);
      console.log(`Created product: ${newProduct.title} with ${variants.length} variants`);
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
