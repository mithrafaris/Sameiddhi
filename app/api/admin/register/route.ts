import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, email, password, secretKey } = await request.json();

    if (!name || !email || !password || !secretKey) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const expectedSecretKey = process.env.ADMIN_SECRET_KEY || 'SamriddhiAdmin123';
    if (secretKey !== expectedSecretKey) {
      return NextResponse.json({ error: 'Invalid Admin Secret Key' }, { status: 401 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      isadmin: true,
      wallet: 0,
      isBlock: false
    });

    await newAdmin.save();

    return NextResponse.json({ message: 'Admin account created successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Admin Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
