import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { FiChevronRight, FiArrowLeft, FiHome, FiMapPin } from 'react-icons/fi';
import dbConnect from '@/lib/mongodb';
import Locality from '@/models/Locality';
import Property, { PUBLIC_PROPERTY_FIELDS } from '@/models/Property';
import PropertyCard from '@/components/property/PropertyCard';
import JsonLd from '@/components/seo/JsonLd';
import {
    breadcrumbJsonLd,
    clampDescription,
    itemListJsonLd,
    localityPath,
} from '@/lib/seo';

export const revalidate = 3600;

// Only published localities get a page. Anything else 404s rather than
// rendering an empty shell for Google to index.
export async function generateStaticParams() {
    try {
        await dbConnect();
        const localities = await Locality.find({ active: true }).select('slug').lean();
        return localities.map((locality: any) => ({ slug: locality.slug }));
    } catch {
        return [];
    }
}

async function getLocalityPage(slug: string) {
    await dbConnect();

    const locality = await Locality.findOne({ slug, active: true }).lean();
    if (!locality) return null;

    const properties = await Property.find({ localitySlug: slug })
        .select(PUBLIC_PROPERTY_FIELDS)
        .sort({ createdAt: -1 })
        .lean();

    return JSON.parse(JSON.stringify({ locality, properties }));
}

/** "2 & 3 BHK" from the distinct BHK values actually listed here. */
function bhkSummary(properties: { bhk: string }[]): string {
    const sizes = Array.from(
        new Set(properties.map((p) => (p.bhk || '').match(/\d+/)?.[0]).filter(Boolean)),
    ).sort();
    if (!sizes.length) return 'Flats';
    if (sizes.length === 1) return `${sizes[0]} BHK Flats`;
    return `${sizes.slice(0, -1).join(', ')} & ${sizes[sizes.length - 1]} BHK Flats`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const data = await getLocalityPage(slug);
    if (!data) return { title: 'Locality Not Found', robots: { index: false, follow: false } };

    const { locality, properties } = data;

    // Editor-written values win; otherwise generate from live inventory so the
    // title reflects what's actually on the page.
    const title =
        locality.metaTitle?.trim() ||
        `${bhkSummary(properties)} for Rent in ${locality.name}, Bangalore`;

    const description =
        clampDescription(locality.metaDescription?.trim() || '') ||
        clampDescription(
            properties.length
                ? `Browse ${properties.length} verified rental ${properties.length === 1 ? 'home' : 'homes'} in ${locality.name}, Bangalore. Managed by Vivion Constructions — filter by size, furnishing and availability.`
                : `Rental homes in ${locality.name}, Bangalore, managed by Vivion Constructions. Enquire about upcoming availability.`,
        );

    const canonical = localityPath(locality.slug);

    return {
        title: { absolute: title },
        description,
        alternates: { canonical },
        openGraph: {
            type: 'website',
            url: canonical,
            title,
            description,
            images: locality.heroImage ? [{ url: locality.heroImage, alt: `${locality.name}, Bangalore` }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: locality.heroImage ? [locality.heroImage] : [],
        },
    };
}

export default async function LocalityPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getLocalityPage(slug);
    if (!data) notFound();

    const { locality, properties } = data;
    const heading = `${bhkSummary(properties)} for Rent in ${locality.name}`;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* ================= HERO ================= */}
            <section className="relative bg-blue-900 text-white pt-28 pb-20 md:pt-36 md:pb-24 overflow-hidden">
                {locality.heroImage ? (
                    <>
                        <Image
                            src={locality.heroImage}
                            alt={`${locality.name}, Bangalore`}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover opacity-25"
                        />
                        <div className="absolute inset-0 bg-blue-900/60" />
                    </>
                ) : (
                    <>
                        <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_15%_20%,white,transparent_45%)]" />
                        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_85%_90%,#d4af37,transparent_40%)]" />
                    </>
                )}

                <div className="container mx-auto px-5 relative">
                    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-blue-200 mb-6">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <FiChevronRight className="w-3.5 h-3.5 text-blue-300/70" />
                        <Link href="/property-management" className="hover:text-white transition-colors">Property Management</Link>
                        <FiChevronRight className="w-3.5 h-3.5 text-blue-300/70" />
                        <span className="text-white font-medium">{locality.name}</span>
                    </nav>

                    <div className="max-w-3xl">
                        <p className="inline-flex items-center gap-2 text-gold font-semibold tracking-widest uppercase text-xs md:text-sm mb-4">
                            <FiMapPin className="w-4 h-4" /> {locality.name}, Bengaluru
                        </p>
                        {/* The page's single h1 — the locality is the ranking target. */}
                        <h1 className="text-3xl md:text-5xl font-bold leading-[1.15]">{heading}</h1>
                        <p className="text-blue-100 mt-5 text-base md:text-lg">
                            {properties.length > 0
                                ? `${properties.length} verified ${properties.length === 1 ? 'home' : 'homes'} available right now.`
                                : 'No homes available in this locality right now — enquire and we’ll notify you.'}
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-5 py-14 md:py-20">
                {/* ================= LISTINGS =================
                    Server-rendered so every card is a crawlable link. The client
                    filter on /property-management renders nothing to a crawler. */}
                {properties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {properties.map((property: any) => (
                            <PropertyCard key={property.slug} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-5">
                            <FiHome className="w-7 h-7 text-gray-300" />
                        </div>
                        <p className="text-lg font-semibold text-gray-700">Nothing available in {locality.name} yet</p>
                        <p className="text-sm text-gray-400 mt-1.5">New homes are added regularly — check back soon.</p>
                        <Link
                            href="/property-management"
                            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition"
                        >
                            Browse all localities
                        </Link>
                    </div>
                )}

                {/* ================= ABOUT THE LOCALITY =================
                    The editorial copy. Without it this page is a bare list of
                    listings, which is not enough to rank on its own. */}
                {locality.about && (
                    <section className="mt-16 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-10 max-w-4xl">
                        <h2 className="font-heading font-bold text-2xl text-blue-900 mb-5">
                            About {locality.name}
                        </h2>
                        <div
                            className="prose-content max-w-none text-gray-600 leading-relaxed space-y-4"
                            dangerouslySetInnerHTML={{ __html: locality.about }}
                        />
                    </section>
                )}

                <Link
                    href="/property-management"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-900 mt-12"
                >
                    <FiArrowLeft className="w-4 h-4" /> All rental homes
                </Link>
            </div>

            <JsonLd
                data={[
                    itemListJsonLd(
                        heading,
                        properties.map((property: any) => ({
                            name: `${property.bhk} ${property.propertyType} in ${property.locality}`,
                            path: `/property-management/${property.slug}`,
                        })),
                    ),
                    breadcrumbJsonLd([
                        { name: 'Home', path: '/' },
                        { name: 'Property Management', path: '/property-management' },
                        { name: locality.name, path: localityPath(locality.slug) },
                    ]),
                ]}
            />
        </div>
    );
}
