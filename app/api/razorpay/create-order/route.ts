import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Razorpay from 'razorpay';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';
import Coupon from '@/lib/models/Coupon';
import { verifyToken } from '@/lib/jwt';

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_secret',
});

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { couponName, isGreenShipping } = await request.json();

    await dbConnect();
    const user = await User.findById(userId).populate({
      path: 'cart.product_id',
      model: Product,
    });

    if (!user || !user.cart || user.cart.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });
    }

    // Verify stock and calculate subtotal
    let subtotal = 0;
    for (const item of user.cart) {
      const prod = item.product_id;
      if (!prod || !prod.isList) {
        return NextResponse.json({ error: 'Some items in your cart are no longer available' }, { status: 400 });
      }
      if (prod.stock < item.quantity) {
        return NextResponse.json({ error: `Not enough stock for ${prod.productName}. Only ${prod.stock} items left.` }, { status: 400 });
      }
      subtotal += prod.price * item.quantity;
    }

    // Process Coupon discount
    let discount = 0;
    if (couponName) {
      const coupon = await Coupon.findOne({ couponName: couponName.toUpperCase(), isList: true });
      if (coupon && subtotal >= coupon.minValue) {
        const disc = (subtotal * coupon.couponValue) / 100;
        discount = Math.min(disc, coupon.maxValue);
      }
    }

    const shippingFee = isGreenShipping ? 50 : 0;
    const finalAmount = Math.max(0, subtotal - discount) + shippingFee;

    // Razorpay amount is in paise (smallest currency unit for INR)
    const options = {
      amount: Math.round(finalAmount * 100),
      currency: 'INR',
      receipt: `receipt_${userId}_${Date.now()}`.substring(0, 40),
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ 
      success: true, 
      orderId: order.id, 
      amount: options.amount,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock' 
    });

  } catch (err: any) {
    console.error('Razorpay Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
