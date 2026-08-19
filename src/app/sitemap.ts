import { MetadataRoute } from 'next';

const locales = ['en', 'bn'];

const publicPaths = [
  '',
  '/how-it-works',
  '/projects/chihno',
  '/progress/chihno',
  '/security',
  '/cares',
  '/apply',
  '/contact',
  '/testimonials',
  '/why-different',
  '/verify',
  '/login',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  return locales.flatMap((locale) =>
    publicPaths.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
    }))
  );
}
