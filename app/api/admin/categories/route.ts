import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/lib/models/Category';
import { checkAdmin } from '@/lib/utils/adminCheck';

export async function GET(request: Request) {
  const isAdmin = await checkAdmin(request);
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const categories = await Category.find().sort({ _id: -1 });
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAdmin = await checkAdmin(request);
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const data = await request.json();

    const { categoryName, description, image } = data;

    const existing = await Category.findOne({ categoryName });
    if (existing) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
    }

    const newCategory = new Category({ 
      categoryName, 
      description: description || 'No description provided.',
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
      isList: true 
    });
    await newCategory.save();
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const isAdmin = await checkAdmin(request);
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const { _id, categoryName, description, image, isList } = await request.json();

    if (categoryName) {
      const existing = await Category.findOne({ categoryName, _id: { $ne: _id } });
      if (existing) {
        return NextResponse.json({ error: 'Category name already exists' }, { status: 400 });
      }
    }

    const updated = await Category.findByIdAndUpdate(_id, { 
      categoryName, 
      description,
      image,
      isList 
    }, { new: true });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAdmin = await checkAdmin(request);
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing category ID' }, { status: 400 });

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
