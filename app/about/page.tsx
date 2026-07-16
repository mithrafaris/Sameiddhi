'use client';

import { motion } from 'framer-motion';
import { Target, Users, Zap, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6"
          >
            About <span className="text-gradient">Samriddhi</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto"
          >
            We are redefining the premium e-commerce experience by merging state-of-the-art aesthetics with seamless performance.
          </motion.p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-1 relative overflow-hidden rounded-3xl h-[400px]"
          >
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=800&auto=format&fit=crop"
              alt="Our Mission"
              className="w-full h-full object-cover rounded-[1.4rem]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent rounded-[1.4rem]" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-zinc-400 mb-4 leading-relaxed">
              At Samriddhi, our goal is to curate and deliver the finest products in electronics, apparel, and accessories, wrapped in a shopping experience that feels futuristic and effortless.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              We started as a small passionate team aiming to break away from standard, boring online stores. Today, we're proud to offer an immersive, dynamic platform that puts the user at the center of everything.
            </p>
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-12">Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Target, title: 'Precision', desc: 'Curated catalogs with uncompromising quality.' },
              { icon: Zap, title: 'Speed', desc: 'Lightning-fast delivery and performance.' },
              { icon: ShieldCheck, title: 'Trust', desc: 'Secure payments and guaranteed authentic products.' },
              { icon: Users, title: 'Community', desc: 'Built for and inspired by our dedicated customers.' }
            ].map((val, idx) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-6 rounded-2xl flex flex-col items-center text-center hover:border-violet-500/30 transition-colors"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 mb-6">
                  <val.icon className="h-7 w-7 text-violet-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">{val.title}</h3>
                <p className="text-sm text-zinc-500">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
