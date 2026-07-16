import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Base routes
  const routes = ['', '/login', '/register', '/products', '/about', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    await dbConnect();
    
    // Product routes
    const products = await Product.find({ inStock: true }).select('_id updatedAt');
    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/products/${product._id}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    return [...routes, ...productRoutes];
  } catch (err) {
    console.error('Error generating sitemap:', err);
    return routes;
  }
}
