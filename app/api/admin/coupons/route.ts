import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Coupon from '@/lib/models/Coupon';
import { checkAdmin } from '@/lib/utils/adminCheck';

export async function GET(request: Request) {
  const isAdmin = await checkAdmin(request);
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const coupons = await Coupon.find().sort({ _id: -1 });
    return NextResponse.json(coupons);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAdmin = await checkAdmin(request);
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const data = await request.json();
    
    // Ensure couponName is uppercase for consistency
    data.couponName = data.couponName?.toUpperCase();

    const existing = await Coupon.findOne({ couponName: data.couponName });
    if (existing) {
      return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
    }

    const newCoupon = new Coupon(data);
    await newCoupon.save();
    return NextResponse.json(newCoupon, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const isAdmin = await checkAdmin(request);
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const { _id, ...updateData } = await request.json();

    if (updateData.couponName) {
      updateData.couponName = updateData.couponName.toUpperCase();
      const existing = await Coupon.findOne({ couponName: updateData.couponName, _id: { $ne: _id } });
      if (existing) {
        return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
      }
    }

    const updated = await Coupon.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAdmin = await checkAdmin(request);
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Coupon ID is required' }, { status: 400 });
    }

    const deleted = await Coupon.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Coupon deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
  }
}
