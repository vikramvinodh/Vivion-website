import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Property, { PUBLIC_PROPERTY_FIELDS } from '@/models/Property';
import Locality from '@/models/Locality';
import PropertyGallery from '@/components/property/PropertyGallery';
import PropertyPhotoGrid from '@/components/property/PropertyPhotoGrid';
import EnquiryTrigger from '@/components/property/EnquiryTrigger';
import {
    FiMapPin, FiMaximize, FiCompass, FiLayers, FiClock, FiZap, FiArrowLeft,
    FiMessageCircle, FiExternalLink,
} from 'react-icons/fi';
import {
    LuBuilding2, LuBedDouble, LuBath, LuSofa, LuUtensils, LuPawPrint,
    LuLandmark, LuArrowUpDown, LuSquareParking,
} from 'react-icons/lu';
import type { IconType } from 'react-icons';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, clampDescription, localityPath, realEstateListingJsonLd } from '@/lib/seo';

export const revalidate = 3600;

// Prerender existing listings; newly added ones render on demand.
export async function generateStaticParams() {
    try {
        await dbConnect();
        const properties = await Property.find({}).select('slug').lean();
        return properties.map((property: any) => ({ slug: property.slug }));
    } catch {
        // Don't fail the build if the DB is unreachable — fall back to on-demand.
        return [];
    }
}

async function getProperty(slug: string) {
    await dbConnect();
    // Public fields only — owner details are intentionally kept private.
    const property = await Property.findOne({ slug }).select(PUBLIC_PROPERTY_FIELDS);
    return property ? JSON.parse(JSON.stringify(property)) : null;
}

/**
 * The locality landing page this listing belongs under, if it's published.
 * Returns null for drafts so the breadcrumb never links to a 404.
 */
async function getPublishedLocality(localitySlug?: string) {
    if (!localitySlug) return null;
    await dbConnect();
    const locality = await Locality.findOne({ slug: localitySlug, active: true })
        .select('name slug')
        .lean();
    return locality ? JSON.parse(JSON.stringify(locality)) : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const property = await getProperty(slug);
    if (!property) return { title: 'Property Not Found', robots: { index: false, follow: false } };

    // Mirrors how people actually search: "2 BHK Apartment for Rent in BTM Layout".
    const title = `${property.bhk} ${property.propertyType} for Rent in ${property.locality}, Bangalore`;

    // Only include optional attributes that are actually set, so descriptions
    // never read "..., , Ready to move". Values are trimmed because free-text
    // admin fields often carry trailing whitespace.
    const attributes = [
        `${property.sqft} sq.ft`,
        `${property.bathrooms} bath`,
        property.furnishing,
        property.facing && `${property.facing} facing`,
        property.availableFloor,
    ]
        .filter(Boolean)
        .map((attribute: string) => attribute.trim());

    // Kept short enough to survive Google's ~160 char cut without a CTA tail
    // that would be the first thing truncated.
    const description = clampDescription(
        `${property.bhk} ${property.propertyType} for rent in ${property.locality}, Bangalore. ${attributes.join(', ')}. ${property.availability}.`,
    );

    const canonical = `/property-management/${property.slug}`;

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            type: 'website',
            url: canonical,
            title,
            description,
            images: property.coverImage ? [{ url: property.coverImage, alt: title }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: property.coverImage ? [property.coverImage] : [],
        },
    };
}

/* ---------- small presentational helpers (server components) ---------- */

function Card({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-7 ${className}`}>
            {title && <h3 className="font-heading font-bold text-xl text-blue-900 mb-5">{title}</h3>}
            {children}
        </div>
    );
}

function Spec({ icon: Icon, label, value }: { icon: IconType; label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="w-5 h-5 text-gold mt-0.5 shrink-0" />
            <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">{value}</p>
            </div>
        </div>
    );
}

function Highlight({ icon: Icon, main, sub }: { icon: IconType; main: string; sub?: string }) {
    return (
        <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-gold" />
            </div>
            <div>
                <p className="font-semibold text-gray-800 text-sm leading-tight">{main}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const property = await getProperty(slug);
    if (!property) notFound();

    const locality = await getPublishedLocality(property.localitySlug);

    const title = `${property.bhk} ${property.propertyType}`;
    const galleryImages: string[] = Array.from(new Set([property.coverImage, ...(property.images || [])].filter(Boolean)));
    const description = `Beautiful ${property.bhk} ${property.propertyType} available for rent in the prime location of ${property.locality}. Well-designed and spacious with modern amenities, perfect for comfortable living.`;

    const mapQuery = encodeURIComponent(`${property.locality}, Bengaluru, Karnataka`);
    const enquireBtn = { propertySlug: property.slug, propertyTitle: `${title} in ${property.locality}` };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="pt-24 md:pt-28" />

            <div className="container mx-auto px-5 pb-16">
                {/* Breadcrumb doubles as the internal link up to the locality
                    page, so listings aren't orphaned at the edge of the site. */}
                <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-4">
                    <Link href="/property-management" className="inline-flex items-center gap-2 font-medium hover:text-blue-900 transition-colors">
                        <FiArrowLeft className="w-4 h-4" /> All listings
                    </Link>
                    {locality && (
                        <>
                            <span className="text-gray-300">/</span>
                            <Link href={localityPath(locality.slug)} className="font-medium hover:text-blue-900 transition-colors">
                                Homes in {locality.name}
                            </Link>
                        </>
                    )}
                </nav>

                {/* The page's single h1 — carries the locality + BHK keywords. */}
                <h1 className="font-heading font-bold text-2xl md:text-3xl text-blue-900 leading-tight">
                    {title} for Rent in {property.locality}
                </h1>
                <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-2 mb-6">
                    <FiMapPin className="w-4 h-4 text-gold" />
                    {property.locality}, Bengaluru, Karnataka
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ================= LEFT COLUMN ================= */}
                    <div className="lg:col-span-2 space-y-6">
                        <PropertyGallery images={galleryImages} alt={`${title} in ${property.locality}`} badge={property.availability} />

                        {/* About */}
                        <Card title="About this Property">
                            <p className="text-gray-600 leading-relaxed">{description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 mt-6 pt-6 border-t border-gray-100">
                                <Spec icon={LuBuilding2} label="Property Type" value={property.propertyType} />
                                <Spec icon={LuBedDouble} label="BHK" value={property.bhk} />
                                <Spec icon={FiMaximize} label="Super Built-up Area" value={`${property.sqft} sqft`} />
                                <Spec icon={LuBath} label="Bathrooms" value={property.bathrooms} />
                                <Spec icon={LuArrowUpDown} label="Available Floor" value={property.availableFloor || '—'} />
                                <Spec icon={FiCompass} label="Facing" value={property.facing || '—'} />
                                <Spec icon={LuSofa} label="Furnishing" value={property.furnishing || '—'} />
                                <Spec icon={FiClock} label="Availability" value={property.availability} />
                                <Spec icon={FiMapPin} label="Locality" value={property.locality} />
                            </div>
                        </Card>

                        {/* Amenities */}
                        <Card title="Amenities & Features">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6">
                                <Spec icon={LuArrowUpDown} label="Lift" value={property.lift ? 'Yes' : 'No'} />
                                <Spec icon={FiZap} label="Power Backup" value={property.powerBackup ? 'Yes' : 'No'} />
                                <Spec icon={LuSquareParking} label="Parking" value={property.parking || '—'} />
                                <Spec icon={LuPawPrint} label="Pet Friendly" value={property.petsFriendly ? 'Yes' : 'No'} />
                                <Spec icon={LuSofa} label="Furnishing" value={property.furnishing || '—'} />
                                <Spec icon={LuLandmark} label="Religion Restrictions" value={property.religionRestrictions || '—'} />
                                <Spec icon={LuUtensils} label="Eating Habits" value={property.eatingHabits || '—'} />
                            </div>
                        </Card>

                        {/* Property Photos */}
                        {galleryImages.length > 0 && (
                            <Card title="Property Photos">
                                <PropertyPhotoGrid images={galleryImages} alt={`${title} in ${property.locality}`} />
                            </Card>
                        )}
                    </div>

                    {/* ================= RIGHT COLUMN ================= */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Enquire */}
                        <Card title="Enquire About This Property">
                            <p className="text-sm text-gray-500 -mt-2 mb-5">Interested in this property? Get in touch to know more.</p>
                            <EnquiryTrigger {...enquireBtn}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition">
                                <FiMessageCircle className="w-4 h-4" /> Add Enquiry
                            </EnquiryTrigger>
                        </Card>

                        {/* Property Highlights */}
                        <Card title="Property Highlights">
                            <div className="space-y-4">
                                <Highlight icon={LuBuilding2} main={property.bhk} sub={property.propertyType} />
                                <Highlight icon={FiMaximize} main={`${property.sqft} sqft`} sub="Super Built-up Area" />
                                <Highlight icon={LuBath} main={`${property.bathrooms} Bathrooms`} />
                                {property.availableFloor && <Highlight icon={FiLayers} main={property.availableFloor} sub="Available Floor" />}
                                {property.facing && <Highlight icon={FiCompass} main={`${property.facing} Facing`} />}
                                <Highlight icon={FiClock} main={property.availability} />
                                {property.furnishing && <Highlight icon={LuSofa} main={property.furnishing} />}
                            </div>
                        </Card>

                        {/* Location */}
                        <Card title="Location">
                            <div className="rounded-xl overflow-hidden border border-gray-100 mb-4">
                                <iframe
                                    title="Property location map"
                                    src={`https://www.google.com/maps?q=${mapQuery}&z=14&output=embed`}
                                    className="w-full h-52 border-0"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                            <p className="font-semibold text-gray-800">{property.locality}, Bengaluru, Karnataka</p>
                            <p className="text-sm text-gray-500 mt-1.5">Well connected to major areas, close to markets, schools, hospitals &amp; public transport.</p>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
                            >
                                View on Map <FiExternalLink className="w-4 h-4" />
                            </a>
                        </Card>

                        {/* Other Details */}
                        <Card title="Other Details">
                            <dl className="divide-y divide-gray-100 text-sm">
                                {[
                                    ['Property Type', property.propertyType],
                                    ['Availability', property.availability],
                                    ['Parking', property.parking || '—'],
                                    ['Lift', property.lift ? 'Yes' : 'No'],
                                    ['Power Backup', property.powerBackup ? 'Yes' : 'No'],
                                    ['Pet Friendly', property.petsFriendly ? 'Yes' : 'No'],
                                    ['Eating Habits', property.eatingHabits || '—'],
                                ].map(([label, value]) => (
                                    <div key={label} className="flex items-center justify-between py-3">
                                        <dt className="text-gray-500">{label}</dt>
                                        <dd className="font-semibold text-gray-800">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Bottom CTA bar */}
            <div className="bg-white border-t border-gray-200">
                <div className="container mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0">
                            <LuBuilding2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-blue-900">Interested in this property?</p>
                            <p className="text-sm text-gray-500">Click “Add Enquiry” and our team will get in touch with you shortly.</p>
                        </div>
                    </div>
                    <EnquiryTrigger {...enquireBtn}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition whitespace-nowrap">
                        <FiMessageCircle className="w-4 h-4" /> Add Enquiry
                    </EnquiryTrigger>
                </div>
            </div>

            <JsonLd
                data={[
                    realEstateListingJsonLd(property),
                    breadcrumbJsonLd([
                        { name: 'Home', path: '/' },
                        { name: 'Property Management', path: '/property-management' },
                        // Only published localities have a page to point at.
                        ...(locality ? [{ name: locality.name, path: localityPath(locality.slug) }] : []),
                        {
                            name: `${title} in ${property.locality}`,
                            path: `/property-management/${property.slug}`,
                        },
                    ]),
                ]}
            />
        </div>
    );
}
