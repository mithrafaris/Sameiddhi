import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import { verifyToken } from '@/lib/jwt';
import User from '@/lib/models/User';

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  if (!token) return false;
  
  const decoded = verifyToken(token);
  if (!decoded) return false;

  await dbConnect();
  const user = await User.findById(decoded.userId);
  return user?.isadmin === true;
}

// PUT /api/admin/reviews - Update a review
export async function PUT(request: Request) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, reviewId, rating, comment } = await request.json();
    
    if (!productId || !reviewId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();
    const product = await Product.findById(productId);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    review.rating = Number(rating);
    review.comment = comment;

    // Recalculate average rating
    product.rating = product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / product.reviews.length;
    
    await product.save();

    return NextResponse.json({ success: true, message: 'Review updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/reviews - Delete a review
export async function DELETE(request: Request) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const productId = url.searchParams.get('productId');
    const reviewId = url.searchParams.get('reviewId');

    if (!productId || !reviewId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();
    const product = await Product.findById(productId);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    product.reviews.pull({ _id: reviewId });
    product.numReviews = product.reviews.length;
    
    if (product.numReviews > 0) {
      product.rating = product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();

    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
