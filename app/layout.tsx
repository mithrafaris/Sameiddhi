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
  icons: {
    icon: '/favicon.ico',
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
