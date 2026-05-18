import { Newsreader, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500'],
  variable: '--font-serif',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

const SITE_URL = 'https://www.fberrez.co';
const TITLE = 'Florent Berrez — ships small things';
const DESCRIPTION =
  'Florent Berrez is a software engineer in Paris building small, focused products — mambo (keyboard-driven database client), blurt.sh, quietdash, minihabits, and 4-days-workweek. Desktop tools, developer ergonomics, quiet web things.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s — fberrez.co',
  },
  description: DESCRIPTION,
  applicationName: 'fberrez.co',
  authors: [{ name: 'Florent Berrez', url: SITE_URL }],
  creator: 'Florent Berrez',
  publisher: 'Florent Berrez',
  keywords: [
    'Florent Berrez',
    'fberrez',
    'software engineer',
    'Paris',
    'France',
    'mambo',
    'mambo-corp',
    'database client',
    'keyboard-driven',
    'blurt.sh',
    'quietdash',
    'minihabits',
    '4-days-workweek',
    'indie developer',
    'TypeScript',
    'NestJS',
    'Tauri',
    'Next.js',
  ],
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'fberrez.co',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    creator: '@fberrez',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport = {
  themeColor: '#ede5d6',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Florent Berrez',
  alternateName: ['Flo Berrez', 'fberrez'],
  url: SITE_URL,
  jobTitle: 'Software Engineer',
  description: DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Paris',
    addressCountry: 'FR',
  },
  email: 'mailto:hi@fberrez.co',
  sameAs: [
    'https://github.com/fberrez',
    'https://github.com/mambo-corp',
  ],
  knowsAbout: [
    'Software engineering',
    'Database tooling',
    'Developer ergonomics',
    'Keyboard-driven interfaces',
    'TypeScript',
    'NestJS',
    'Tauri',
    'Next.js',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'mambo-corp',
    url: 'https://github.com/mambo-corp',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'fberrez.co',
  url: SITE_URL,
  inLanguage: 'en',
  author: {
    '@type': 'Person',
    name: 'Florent Berrez',
    url: SITE_URL,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
