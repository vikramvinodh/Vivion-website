import type { MetadataRoute } from 'next';
import { absoluteUrl, SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                // /admin is served on the admin subdomain via proxy.ts, but the
                // paths still resolve here — keep crawlers out of both.
                disallow: ['/admin', '/admin/', '/api/', '/login'],
            },
        ],
        sitemap: absoluteUrl('/sitemap.xml'),
        host: SITE_URL,
    };
}
