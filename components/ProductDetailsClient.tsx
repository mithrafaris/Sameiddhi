'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface ProductDetailsClientProps {
  product: {
    _id: string;
    productName: string;
    price: number;
    stock: number;
    description: string;
    images: string[];
    discount?: string;
    category?: {
      categoryName: string;
    };
    rating?: number;
    numReviews?: number;
    reviews?: {
      _id: string;
      name: string;
      rating: number;
      comment: string;
      createdAt: string;
    }[];
  };
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const handleAddToCart = async () => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id, quantity }),
      });
      if (res.ok) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        // Dispatch event to sync navbar
        window.dispatchEvent(new Event('popstate'));
      } else if (res.status === 401) {
        window.location.href = '/login';
      }
    } catch (err) {
      console.error(err);
    }
  };

  const images = product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'
  ];

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      const res = await fetch(`/api/products/${product._id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });

      const data = await res.json();
      if (!res.ok) {
        setReviewError(data.error || 'Failed to submit review');
      } else {
        setReviewSuccess('Review submitted successfully! Refreshing...');
        setReviewComment('');
        setReviewRating(5);
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (err: any) {
      setReviewError(err.message || 'Something went wrong');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 flex flex-col justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Gallery Column */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden glass border border-zinc-800 bg-zinc-900/10">
            {product.discount && product.discount !== '0%' && (
              <span className="absolute top-4 left-4 z-10 rounded-full bg-violet-600 px-3 py-1.5 text-xs font-bold text-white uppercase tracking-wider shadow-lg">
                {product.discount} OFF
              </span>
            )}
            <img
              src={images[activeImage]}
              alt={product.productName}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square w-20 rounded-xl overflow-hidden glass border transition-all ${
                    activeImage === idx ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-widest text-violet-500 uppercase">
              {product.category?.categoryName || 'General'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-wide">
              {product.productName}
            </h1>
            <div className="flex items-center gap-4 text-sm mt-2">
              <div className="flex items-center text-violet-400 gap-1 font-bold">
                <Star className="h-4 w-4 fill-violet-400" />
                <span>{product.rating ? product.rating.toFixed(1) : '0.0'}</span>
                <span className="text-zinc-500 font-normal">({product.numReviews || 0} customer reviews)</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                product.stock > 0 ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60' : 'bg-red-950/40 text-red-400 border border-red-900/60'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          <p className="text-base text-zinc-300 leading-relaxed">
            {product.description}
          </p>

          <div className="border-t border-zinc-900 pt-6">
            <span className="text-3xl font-black text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Quantity Selector & Action Button */}
          {product.stock > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center border-t border-zinc-900 pt-6">
              <div className="flex items-center border border-zinc-800 rounded-xl bg-zinc-950 px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-zinc-500 hover:text-white font-bold"
                >
                  -
                </button>
                <span className="px-4 text-sm font-semibold text-zinc-200 w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-zinc-500 hover:text-white font-bold"
                >
                  +
                </button>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all shadow-lg cursor-pointer ${
                  added
                    ? 'bg-emerald-600 shadow-emerald-500/20'
                    : 'bg-violet-600 hover:bg-violet-500 shadow-violet-500/20'
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </motion.button>
            </div>
          )}

          {/* Product Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-900 pt-6">
            <div className="flex items-center gap-2.5 text-zinc-400">
              <Truck className="h-5 w-5 text-violet-400 shrink-0" />
              <span className="text-xs font-semibold">Free Express Shipping</span>
            </div>
            <div className="flex items-center gap-2.5 text-zinc-400">
              <ShieldCheck className="h-5 w-5 text-violet-400 shrink-0" />
              <span className="text-xs font-semibold">1 Year Genuine Warranty</span>
            </div>
            <div className="flex items-center gap-2.5 text-zinc-400">
              <RefreshCw className="h-5 w-5 text-violet-400 shrink-0" />
              <span className="text-xs font-semibold">7 Days Easy Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20 border-t border-zinc-900 pt-12 max-w-4xl">
        <h2 className="text-2xl font-extrabold text-white uppercase tracking-wider mb-8">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Review List */}
          <div className="space-y-6">
            {(!product.reviews || product.reviews.length === 0) ? (
              <p className="text-zinc-500 text-sm">No reviews yet. Be the first to review this product!</p>
            ) : (
              product.reviews.map((review) => (
                <div key={review._id} className="bg-zinc-900/30 p-5 rounded-2xl border border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white">{review.name}</span>
                    <span className="text-xs text-zinc-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`h-3 w-3 ${star <= review.rating ? 'fill-violet-400 text-violet-400' : 'text-zinc-700'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Write a Review Form */}
          <div className="glass-card p-6 rounded-3xl border border-zinc-800/80 h-fit">
            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star className={`h-6 w-6 ${star <= reviewRating ? 'fill-violet-500 text-violet-500' : 'text-zinc-700'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Your Review</label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="What did you like or dislike?"
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 text-sm text-zinc-200 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
              
              {reviewError && <p className="text-xs font-bold text-red-400">{reviewError}</p>}
              {reviewSuccess && <p className="text-xs font-bold text-emerald-400">{reviewSuccess}</p>}

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-bold text-white transition-colors disabled:opacity-50"
              >
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
