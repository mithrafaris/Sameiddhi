import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AiAssistant from '@/components/AiAssistant';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'Preethika | Premium E-Commerce Experience',
  description: 'Shop luxury and state-of-the-art products on Preethika.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Preethika | Premium E-Commerce',
    description: 'Shop luxury and state-of-the-art products on Preethika.',
    url: '/',
    siteName: 'Preethika',
    images: [
      {
        url: '/favicon.ico',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Preethika | Premium E-Commerce',
    description: 'Shop luxury and state-of-the-art products on Preethika.',
    images: ['/favicon.ico'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col font-sans bg-zinc-950 text-zinc-100 selection:bg-violet-500/30 selection:text-violet-200">
        <Navbar />
        <main className="flex-1 w-full flex flex-col pt-16">
          {children}
        </main>
        <AiAssistant />
        <Footer />
      </body>
    </html>
  );
}
