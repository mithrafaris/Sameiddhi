import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import { verifyToken } from '@/lib/jwt';

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  if (!token) return false;
  const decoded = verifyToken(token);
  return decoded && decoded.isadmin;
}

export async function POST(request: Request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productName, price, stock, description, images, category } = await request.json();

    if (!productName || !price || typeof stock !== 'number' || !description || !category) {
      return NextResponse.json({ error: 'Missing required product parameters' }, { status: 400 });
    }

    await dbConnect();
    const product = await Product.create({
      productName,
      price,
      stock,
      description,
      images,
      category,
    });

    const populatedProduct = await Product.findById(product._id).populate('category');

    return NextResponse.json({ success: true, product: populatedProduct });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { _id, productName, price, stock, description, images, category } = await request.json();

    if (!_id) return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });

    await dbConnect();
    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      { productName, price, stock, description, images, category },
      { new: true }
    ).populate('category');

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });

    await dbConnect();
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
