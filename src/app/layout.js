// app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';
import PlausibleProvider from 'next-plausible';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'fberrez.co - Your MVP Builder',
  description:
    'Transform your idea into a market-ready MVP in weeks. Fast, affordable, and hassle-free.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'fberrez.co - Your MVP Builder',
    description:
      'Transform your idea into a market-ready MVP in weeks. Fast, affordable, and hassle-free.',
    url: 'https://fberrez.co',
    siteName: 'fberrez.co',
    images: [
      {
        url: 'https://www.fberrez.co/og-image.png',
        width: 2400,
        height: 1260,
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
    images: ['https://www.fberrez.co/og-image.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <PlausibleProvider domain="fberrez.co" />
      <body className={inter.className}>
        {children}
        <footer className="bg-secondary py-6 mt-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>
              © {new Date().getFullYear()} fberrez.co. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
