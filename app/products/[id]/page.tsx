import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import ProductDetailsClient from '@/components/ProductDetailsClient';

export const revalidate = 0;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) return {};

  await dbConnect();
  const rawProduct = await Product.findById(id).lean();

  if (!rawProduct || !rawProduct.isList) return {};

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const imageUrl = rawProduct.images && rawProduct.images.length > 0 
    ? (rawProduct.images[0].startsWith('http') ? rawProduct.images[0] : `${baseUrl}${rawProduct.images[0]}`)
    : `${baseUrl}/favicon.ico`;

  return {
    title: `${rawProduct.productName} | Samriddhi`,
    description: rawProduct.description?.substring(0, 160),
    openGraph: {
      title: `${rawProduct.productName} | Samriddhi`,
      description: rawProduct.description?.substring(0, 160),
      images: [{ url: imageUrl }],
      type: 'website',
      url: `${baseUrl}/products/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${rawProduct.productName} | Samriddhi`,
      description: rawProduct.description?.substring(0, 160),
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  await dbConnect();
  
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return notFound();
  }

  const rawProduct = await Product.findById(id).populate('category').lean();

  if (!rawProduct || !rawProduct.isList) {
    return notFound();
  }

  const product = {
    _id: rawProduct._id.toString(),
    productName: rawProduct.productName,
    price: rawProduct.price,
    stock: rawProduct.stock,
    description: rawProduct.description,
    images: rawProduct.images || [],
    discount: rawProduct.discount || '',
    category: rawProduct.category
      ? {
          categoryName: rawProduct.category.categoryName,
        }
      : undefined,
    rating: rawProduct.rating || 0,
    numReviews: rawProduct.numReviews || 0,
    reviews: (rawProduct.reviews || []).map((r: any) => ({
      _id: r._id.toString(),
      name: r.name,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
    })),
  };

  return <ProductDetailsClient product={product} />;
}
