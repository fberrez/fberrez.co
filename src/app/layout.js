// app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'fberrez.co - Your MVP Builder',
  description:
    'Transform your idea into a market-ready MVP in weeks. Fast, affordable, and hassle-free.',
  openGraph: {
    title: 'fberrez.co - Your MVP Builder',
    description:
      'Transform your idea into a market-ready MVP in weeks. Fast, affordable, and hassle-free.',
    url: 'https://fberrez.co',
    siteName: 'fberrez.co',
    images: [
      {
        url: 'https://fberrez.co/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'fberrez.co - Your MVP Builder',
    description:
      'Transform your idea into a market-ready MVP in weeks. Fast, affordable, and hassle-free.',
    images: ['https://fberrez.co/og-image.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
