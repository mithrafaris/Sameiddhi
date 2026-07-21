const mongoose = require('mongoose');
const path = require('path');
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/Samriddhi';
const bcrypt = require('bcryptjs');

// Inline simple schemas for seed
const CategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, lowercase: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  isList: { type: Boolean, default: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }]
});

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true, lowercase: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String, required: true },
  images: { type: Array },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  discount: { type: String },
  isList: { type: Boolean, default: true },
  rating: { type: Number, default: 4.5 }
});

const bannerSchema = new mongoose.Schema({
  bannerName: { type: String, required: true, lowercase: true },
  image: { type: String },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  isList: { type: Boolean, default: true }
});

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true },
  password: { type: String },
  isadmin: { type: Boolean, default: false },
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Products = mongoose.models.Products || mongoose.model("Products", productSchema);
const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
const User = mongoose.models.user_details || mongoose.model('user_details', userSchema);

async function seed() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB. Clearing existing collections...');

    await Category.deleteMany({});
    await Products.deleteMany({});
    await Banner.deleteMany({});

    const adminExists = await User.findOne({ email: 'admin@samriddhi.com' });
    if (!adminExists) {
      console.log('Inserting Admin User...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@123', salt);
      await User.create({
        name: 'Super Admin',
        email: 'admin@samriddhi.com',
        password: hashedPassword,
        isadmin: true
      });
      console.log('Admin user created (admin@samriddhi.com / Admin@123).');
    }

    console.log('Inserting Categories...');
    const categoriesData = [
      {
        categoryName: 'electronics',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=600&auto=format&fit=crop',
        description: 'Next-gen gadgets, smartphones, wearables, and computing devices.',
      },
      {
        categoryName: 'apparel',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
        description: 'Premium clothing, shoes, and luxury streetwear.',
      },
      {
        categoryName: 'accessories',
        image: 'https://images.unsplash.com/photo-1542219550-37153d387c27?q=80&w=600&auto=format&fit=crop',
        description: 'Elegant watches, minimalist wallets, and everyday carry essentials.',
      }
    ];

    const insertedCats = await Category.insertMany(categoriesData);
    
    const catElectronics = insertedCats.find(c => c.categoryName === 'electronics');
    const catApparel = insertedCats.find(c => c.categoryName === 'apparel');
    const catAccessories = insertedCats.find(c => c.categoryName === 'accessories');

    console.log('Inserting Products...');
    const productsData = [
      {
        productName: 'AeroBuds Pro',
        price: 8999,
        stock: 45,
        description: 'Ultra active noise-cancelling wireless earbuds with spatial audio tracking.',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop'],
        category: catElectronics._id,
        discount: '10%',
        rating: 4.8
      },
      {
        productName: 'Chronos Smartwatch',
        price: 19999,
        stock: 20,
        description: 'Titanium chassis smartwatch featuring real-time health diagnostics.',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'],
        category: catElectronics._id,
        discount: '15%',
        rating: 4.9
      },
      {
        productName: 'Quantum Laptop X',
        price: 145000,
        stock: 10,
        description: 'High performance ultra-book with m3 chip and OLED display.',
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600&auto=format&fit=crop'],
        category: catElectronics._id,
        discount: '5%',
        rating: 4.7
      },
      {
        productName: 'Gravity Hoody',
        price: 4999,
        stock: 35,
        description: 'Heavyweight organic cotton hoodie in space grey.',
        images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop'],
        category: catApparel._id,
        discount: '5%',
        rating: 4.6
      },
      {
        productName: 'Neon Trainer V2',
        price: 12499,
        stock: 15,
        description: 'Futuristic responsive running sneakers with energy-returning foam.',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop'],
        category: catApparel._id,
        discount: '0%',
        rating: 4.5
      },
      {
        productName: 'Silk Midnight Dress',
        price: 8599,
        stock: 25,
        description: 'Elegant evening wear designed for luxury and comfort.',
        images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop'],
        category: catApparel._id,
        discount: '20%',
        rating: 4.9
      },
      {
        productName: 'Sleek Leather Wallet',
        price: 2499,
        stock: 120,
        description: 'Full-grain veg-tan leather wallet featuring RFID blocking shields.',
        images: ['https://images.unsplash.com/photo-1627124765135-56c33fc36bfa?q=80&w=600&auto=format&fit=crop'],
        category: catAccessories._id,
        discount: '20%',
        rating: 4.3
      },
      {
        productName: 'Aviator Sunglasses',
        price: 3499,
        stock: 50,
        description: 'Classic aviator styling with polarized UV-blocking lenses.',
        images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop'],
        category: catAccessories._id,
        discount: '0%',
        rating: 4.7
      }
    ];

    const insertedProds = await Products.insertMany(productsData);
    
    // Map products back into categories
    catElectronics.products = insertedProds.filter(p => p.category.toString() === catElectronics._id.toString()).map(p => p._id);
    await catElectronics.save();

    catApparel.products = insertedProds.filter(p => p.category.toString() === catApparel._id.toString()).map(p => p._id);
    await catApparel.save();

    catAccessories.products = insertedProds.filter(p => p.category.toString() === catAccessories._id.toString()).map(p => p._id);
    await catAccessories.save();

    console.log('Inserting Banners...');
    const bannersData = [
      {
        bannerName: 'summer luxury launch',
        image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop',
        title: 'Premium Collections & Luxury Wear',
        subtitle: 'Elevate your daily flow with the Samriddhi collection. Exclusive designs for the modern lifestyle.'
      },
      {
        bannerName: 'wearables campaign',
        image: 'https://images.unsplash.com/photo-1491472253230-a044054ca35f?q=80&w=1200&auto=format&fit=crop',
        title: 'Precision Smart Technologies',
        subtitle: 'Next generation wearables and tech essentials. Track metrics, control media, and navigate effortlessly.'
      }
    ];

    await Banner.insertMany(bannersData);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
