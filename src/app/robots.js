export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
    ],
    sitemap: 'https://www.fberrez.co/sitemap.xml',
    host: 'https://www.fberrez.co',
  };
}
