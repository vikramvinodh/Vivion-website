import type { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import Property from '@/models/Property';
import Locality from '@/models/Locality';
import { absoluteUrl, localityPath } from '@/lib/seo';

// Regenerate hourly rather than on every crawler hit.
export const revalidate = 3600;

const STATIC_ROUTES: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
}[] = [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: '/property-management', changeFrequency: 'daily', priority: 0.9 },
    { path: '/estimations', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/projects', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/about', changeFrequency: 'yearly', priority: 0.6 },
    { path: '/contact', changeFrequency: 'yearly', priority: 0.6 },
    { path: '/blogs', changeFrequency: 'weekly', priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
        url: absoluteUrl(route.path),
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));

    try {
        await dbConnect();

        const [posts, properties, localities] = await Promise.all([
            Post.find({ published: true }).select('slug createdAt').lean(),
            Property.find({}).select('slug createdAt').lean(),
            // Unpublished localities have no page — listing them would feed
            // Google a sitemap full of 404s.
            Locality.find({ active: true }).select('slug createdAt').lean(),
        ]);

        const postEntries: MetadataRoute.Sitemap = posts.map((post: any) => ({
            url: absoluteUrl(`/blogs/${post.slug}`),
            lastModified: post.createdAt ? new Date(post.createdAt) : new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        }));

        const propertyEntries: MetadataRoute.Sitemap = properties.map((property: any) => ({
            url: absoluteUrl(`/property-management/${property.slug}`),
            lastModified: property.createdAt ? new Date(property.createdAt) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        // Ranked just under /property-management — these are the pages the
        // locality searches ("2 bhk for rent in btm layout") should land on.
        const localityEntries: MetadataRoute.Sitemap = localities.map((locality: any) => ({
            url: absoluteUrl(localityPath(locality.slug)),
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.85,
        }));

        return [...staticEntries, ...localityEntries, ...propertyEntries, ...postEntries];
    } catch {
        // A DB outage should degrade the sitemap to static routes, not 500 it —
        // a 500 here makes Google drop the whole sitemap.
        return staticEntries;
    }
}
