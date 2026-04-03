import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db/connect';
import Product from '@/lib/db/models/Product';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.aurafashion.com';
  
  await dbConnect();
  const products = await Product.find({ status: 'active' }).select('slug updatedAt').lean();
  
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productUrls,
  ];
}
