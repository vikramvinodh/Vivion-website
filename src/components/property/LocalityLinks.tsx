import Link from 'next/link';
import { FiMapPin, FiArrowRight } from 'react-icons/fi';
import dbConnect from '@/lib/mongodb';
import Locality from '@/models/Locality';
import Property from '@/models/Property';
import { localityPath } from '@/lib/seo';

/**
 * Server-rendered links to every published locality page.
 *
 * This is the crawlable path into the listings. PropertyListing is a client
 * component that fetches after hydration and paginates with buttons, so the
 * HTML a crawler receives contains no link to any property. These anchors are
 * what connect /property-management to the rest of the property tree.
 */
export default async function LocalityLinks() {
    let localities: { name: string; slug: string; count: number }[] = [];

    try {
        await dbConnect();
        const [published, counts] = await Promise.all([
            Locality.find({ active: true }).select('name slug').sort({ name: 1 }).lean(),
            Property.aggregate<{ _id: string; count: number }>([
                { $group: { _id: '$localitySlug', count: { $sum: 1 } } },
            ]),
        ]);

        const countBySlug = new Map(counts.map((c) => [c._id, c.count]));
        localities = published.map((locality: any) => ({
            name: locality.name,
            slug: locality.slug,
            count: countBySlug.get(locality.slug) || 0,
        }));
    } catch {
        // A DB blip shouldn't take down the listings page above it.
        return null;
    }

    if (!localities.length) return null;

    return (
        <section className="mt-16 pt-12 border-t border-gray-200">
            <div className="flex items-baseline justify-between flex-wrap gap-2 mb-6">
                <h2 className="font-heading font-bold text-xl md:text-2xl text-blue-900">
                    Browse rental homes by locality
                </h2>
                <p className="text-sm text-gray-500">
                    {localities.length} {localities.length === 1 ? 'locality' : 'localities'} across Bengaluru
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {localities.map((locality) => (
                    <Link
                        key={locality.slug}
                        href={localityPath(locality.slug)}
                        className="group flex items-center justify-between gap-3 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3.5 hover:border-blue-900/30 hover:shadow-md transition"
                    >
                        <span className="flex items-center gap-2.5 min-w-0">
                            <FiMapPin className="w-4 h-4 text-gold shrink-0" />
                            <span className="min-w-0">
                                <span className="block font-semibold text-gray-800 text-sm truncate group-hover:text-blue-900 transition-colors">
                                    Homes for rent in {locality.name}
                                </span>
                                <span className="block text-xs text-gray-400 mt-0.5">
                                    {locality.count} {locality.count === 1 ? 'listing' : 'listings'}
                                </span>
                            </span>
                        </span>
                        <FiArrowRight className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-blue-900 group-hover:translate-x-0.5 transition" />
                    </Link>
                ))}
            </div>
        </section>
    );
}
