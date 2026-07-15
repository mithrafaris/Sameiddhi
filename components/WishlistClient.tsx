'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, Star, Heart, Trash2 } from 'lucide-react';

interface ProductType {
  _id: string;
  productName: string;
  price: number;
  stock: number;
  description: string;
  images: string[];
  discount?: string;
  category?: {
    _id: string;
    categoryName: string;
  };
  rating?: number;
}

export default function WishlistClient({ products: initialProducts }: { products: ProductType[] }) {
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (res.ok) {
        setAddedToCart((prev) => ({ ...prev, [productId]: true }));
        setTimeout(() => {
          setAddedToCart((prev) => ({ ...prev, [productId]: false }));
        }, 2000);
        window.dispatchEvent(new Event('popstate'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFromWishlist = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col">
      <div className="mb-10">
        <h2 className="text-xs font-bold tracking-wider text-violet-500 uppercase">Your Favorites</h2>
        <h3 className="text-3xl font-extrabold text-white mt-1">My Wishlist</h3>
      </div>

      <AnimatePresence mode="wait">
        {products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="glass-card group relative rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-900/10 flex flex-col h-full"
              >
                <Link href={`/products/${product._id}`} className="block flex-1">
                  <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden">
                    {product.discount && product.discount !== '0%' && (
                      <span className="absolute top-3.5 left-3.5 z-10 rounded-full bg-violet-600 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                        {product.discount} OFF
                      </span>
                    )}
                    <button
                      onClick={(e) => handleRemoveFromWishlist(product._id, e)}
                      className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-zinc-900/80 hover:bg-red-900/80 text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'}
                      alt={product.productName}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5 flex flex-col space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                      <span>{product.category?.categoryName || 'General'}</span>
                      <div className="flex items-center text-violet-400 gap-0.5">
                        <Star className="h-3 w-3 fill-violet-400" />
                        <span>{product.rating ? product.rating.toFixed(1) : '0.0'}</span>
                      </div>
                    </div>
                    <h4 className="text-base font-bold text-white truncate uppercase tracking-wide group-hover:text-violet-400 transition-colors">
                      {product.productName}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 min-h-[2rem]">
                      {product.description}
                    </p>
                  </div>
                </Link>

                <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-zinc-800/60 mt-auto">
                  <span className="text-lg font-black text-white">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleAddToCart(product._id, e)}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all shadow-md cursor-pointer ${
                      addedToCart[product._id]
                        ? 'bg-emerald-600 text-white'
                        : 'bg-violet-600 text-white hover:bg-violet-500'
                    }`}
                  >
                    {addedToCart[product._id] ? (
                      <Check className="h-4.5 w-4.5" />
                    ) : (
                      <ShoppingCart className="h-4.5 w-4.5" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-4"
          >
            <div className="p-4 rounded-full bg-zinc-900/50">
              <Heart className="h-8 w-8 text-zinc-600" />
            </div>
            <div className="text-zinc-500 text-lg">Your wishlist is empty.</div>
            <Link
              href="/products"
              className="rounded-full bg-violet-600 hover:bg-violet-500 px-6 py-2 text-sm font-semibold text-white transition-colors"
            >
              Explore Products
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
