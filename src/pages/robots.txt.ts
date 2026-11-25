import { siteConfig } from '../config/active.config';

export async function GET(): Promise<Response> {
  const sitemapUrl = new URL('/sitemap-index.xml', siteConfig.site.canonicalUrl).toString();
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /terima-kasih',
    `Sitemap: ${sitemapUrl}`,
    '',
  ].join('\n');

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
