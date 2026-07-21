'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform, Variants } from 'framer-motion';
import { ArrowRight, ShoppingCart, Check, Heart, Star, Sparkles, Zap } from 'lucide-react';

interface CategoryType {
  _id: string;
  categoryName: string;
  image: string;
  description: string;
}

interface ProductType {
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
}

interface BannerType {
  _id: string;
  bannerName: string;
  image: string;
  title: string;
  subtitle: string;
}

interface HomeClientProps {
  initialBanners: BannerType[];
  initialCategories: CategoryType[];
  initialProducts: ProductType[];
}

export default function HomeClient({
  initialBanners,
  initialCategories,
  initialProducts,
}: HomeClientProps) {
  const [banners] = useState<BannerType[]>(initialBanners);
  const [categories] = useState<CategoryType[]>(initialCategories);
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  // Fetch wishlist on mount
  useEffect(() => {
    fetch('/api/wishlist')
      .then((res) => {
        if (res.ok) return res.json();
        return { wishlist: [] };
      })
      .then((data) => {
        if (data.wishlist) {
          const ids = data.wishlist.map((item: any) => typeof item === 'string' ? item : item._id);
          setWishlist(new Set(ids));
        }
      })
      .catch(console.error);
  }, []);

  const handleToggleWishlist = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setWishlist((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(productId)) {
            newSet.delete(productId);
          } else {
            newSet.add(productId);
          }
          return newSet;
        });
      } else if (res.status === 401) {
        window.location.href = '/login';
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Autoplay banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Stop navigation to details page
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
        // Refresh Navbar layout state
        window.dispatchEvent(new Event('popstate'));
      } else {
        // Redirect to login if unauthorized
        if (res.status === 401) {
          window.location.href = '/login';
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  };

  return (
    <div className="w-full pb-20 overflow-x-hidden">
      {/* Hero Banner Slider */}
      <div className="relative h-[80vh] w-full bg-slate-950 overflow-hidden flex items-center justify-center">
        {banners.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Background image with glass overlay */}
              <div className="absolute inset-0 bg-slate-950/70 z-10" />
              <motion.img
                style={{ y }}
                src={banners[currentBanner].image}
                alt={banners[currentBanner].title}
                className="absolute inset-0 object-cover w-full h-full opacity-50 scale-105"
              />

              {/* Banner content */}
              <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                  className="max-w-4xl space-y-8 flex flex-col items-center"
                >
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-500/30 bg-rose-950/30 backdrop-blur-md text-xs font-bold text-rose-300 tracking-widest uppercase shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                  >
                    <Zap className="h-3.5 w-3.5 text-rose-400" />
                    <span>Exclusive Collection</span>
                  </motion.div>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight uppercase drop-shadow-2xl">
                    <span className="text-gradient-gold">{banners[currentBanner].title}</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-slate-300 font-medium max-w-2xl drop-shadow-md">
                    {banners[currentBanner].subtitle}
                  </p>
                  <div className="flex gap-4 pt-4">
                    <Link
                      href="/products"
                      className="group relative inline-flex items-center gap-3 rounded-full bg-purple-500 hover:bg-purple-400 px-8 py-4 text-sm font-bold text-slate-950 transition-all shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:shadow-[0_0_30px_rgba(20,184,166,0.6)] hover:-translate-y-1 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                      <span className="relative">Explore Collection</span>
                      <ArrowRight className="relative h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-500">
            No active banners found. Run seed script.
          </div>
        )}

        {/* Carousel indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  currentBanner === index ? 'w-10 bg-purple-400 shadow-[0_0_10px_rgba(45,212,191,0.8)]' : 'w-4 bg-slate-600/50 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 relative">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
          >
            <h2 className="text-xs font-bold tracking-[0.2em] text-purple-400 uppercase drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">Curated Essentials</h2>
            <h3 className="text-4xl font-extrabold text-white mt-2 tracking-tight">Shop by Category</h3>
          </motion.div>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat._id}
              variants={fadeInUp}
            >
              <Link
                href={`/products?category=${cat.categoryName}`}
                className="group relative block aspect-[4/5] rounded-[2rem] overflow-hidden glass border border-slate-800 shadow-xl hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] transition-all duration-500 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10 transition-opacity group-hover:opacity-80" />
                <img
                  src={cat.image}
                  alt={cat.categoryName}
                  className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-70"
                />
                <div className="absolute inset-x-8 bottom-8 z-20 flex flex-col justify-end">
                  <h4 className="text-2xl font-bold text-white uppercase tracking-wider group-hover:text-purple-300 transition-colors duration-300">
                    {cat.categoryName}
                  </h4>
                  <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 group-hover:mt-3 transition-all duration-300 overflow-hidden">
                    <p className="text-sm text-slate-300 font-medium line-clamp-2">
                      {cat.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-purple-400 text-xs font-bold uppercase tracking-widest mt-4">
                      Explore <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
          >
            <h2 className="text-xs font-bold tracking-[0.2em] text-rose-400 uppercase drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">Trending Now</h2>
            <h3 className="text-4xl font-extrabold text-white mt-2 tracking-tight">Featured Products</h3>
          </motion.div>
          <motion.div
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
          >
            <Link
              href="/products"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-slate-700 text-sm font-bold text-slate-200 hover:border-purple-500/50 hover:text-purple-300 transition-all shadow-md hover:shadow-[0_0_15px_rgba(20,184,166,0.2)]"
            >
              <span>View Collection</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <motion.div
              key={product._id}
              variants={fadeInUp}
              className="glass-card group relative rounded-[1.5rem] overflow-hidden border border-slate-800/80 bg-slate-900/40 flex flex-col h-full hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.6),0_0_20px_-5px_rgba(20,184,166,0.2)]"
            >
              <Link href={`/products/${product._id}`} className="block flex-1">
                {/* Image Section */}
                <div className="relative aspect-[4/5] w-full bg-slate-950 overflow-hidden">
                  {product.discount && product.discount !== '0%' && (
                    <span className="absolute top-4 left-4 z-10 rounded-full bg-rose-500/90 backdrop-blur-md px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-rose-500/20">
                      {product.discount} OFF
                    </span>
                  )}
                  <button
                    onClick={(e) => handleToggleWishlist(product._id, e)}
                    className={`absolute top-4 right-4 z-20 p-2.5 rounded-full transition-all duration-300 backdrop-blur-md ${
                      wishlist.has(product._id)
                        ? 'bg-rose-500/90 text-white shadow-lg shadow-rose-500/40 scale-110'
                        : 'bg-slate-900/60 text-slate-300 hover:text-rose-400 hover:bg-slate-800/80 hover:scale-110'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${wishlist.has(product._id) ? 'fill-current' : ''}`} />
                  </button>
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'}
                    alt={product.productName}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                </div>

                {/* Info Section */}
                <div className="p-6 flex flex-col space-y-3 relative z-10 -mt-6 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent">
                  <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700">{product.category?.categoryName || 'General'}</span>
                    <div className="flex items-center text-rose-400 gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
                      <Star className="h-3 w-3 fill-rose-400" />
                      <span>{product.rating ? product.rating.toFixed(1) : '0.0'}</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-extrabold text-white truncate tracking-wide group-hover:text-purple-400 transition-colors duration-300">
                    {product.productName}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 min-h-[2rem] leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </Link>

              {/* Pricing & Add to Cart */}
              <div className="px-6 pb-6 pt-2 flex items-center justify-between mt-auto">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleAddToCart(product._id, e)}
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all shadow-lg cursor-pointer ${
                    addedToCart[product._id]
                      ? 'bg-rose-500 text-white shadow-rose-500/30'
                      : 'bg-purple-500 text-slate-950 hover:bg-purple-400 shadow-purple-500/20 hover:shadow-purple-400/40'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {addedToCart[product._id] ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="cart"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
