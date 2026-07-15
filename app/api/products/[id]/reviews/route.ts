import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import { verifyToken } from '@/lib/jwt';

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tokenData = await getUser();
    if (!tokenData) {
      return NextResponse.json({ error: 'You must be logged in to review a product' }, { status: 401 });
    }

    await dbConnect();
    const user = await import('@/lib/models/User').then(m => m.default).then(User => User.findById(tokenData.userId));
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { rating, comment } = await request.json();
    const resolvedParams = await params;
    const productId = resolvedParams.id;

    if (!rating || !comment) {
      return NextResponse.json({ error: 'Please provide rating and comment' }, { status: 400 });
    }

    await dbConnect();
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if already reviewed
    const alreadyReviewed = product.reviews.find(
      (r: any) => r.user && r.user.toString() === user._id.toString()
    );

    if (alreadyReviewed) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 });
    }

    const review = {
      name: user.name,
      rating: Number(rating),
      comment,
      user: user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    return NextResponse.json({ success: true, message: 'Review added successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
