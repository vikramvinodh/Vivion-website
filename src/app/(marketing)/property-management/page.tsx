import type { Metadata } from 'next';
import Link from 'next/link';
import { FiChevronRight, FiCheckCircle, FiMapPin, FiKey } from 'react-icons/fi';
import PropertyListing from '@/components/property/PropertyListing';
import LocalityLinks from '@/components/property/LocalityLinks';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd } from '@/lib/seo';

// LocalityLinks reads from the DB, so this page is now ISR rather than static.
export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Rental Homes & Apartments for Rent in Bangalore',
    description:
        'Browse verified 1, 2 and 3 BHK apartments and houses for rent in Bangalore, managed by Vivion Constructions. Filter by locality, size, furnishing and amenities.',
    alternates: { canonical: '/property-management' },
    openGraph: {
        type: 'website',
        url: '/property-management',
        title: 'Rental Homes & Apartments for Rent in Bangalore | Vivion',
        description:
            'Verified rental homes across Bangalore — filter by locality, size, furnishing and amenities.',
    },
};

const TRUST_POINTS = [
    { icon: FiCheckCircle, label: 'Verified Listings' },
    { icon: FiMapPin, label: 'Prime Localities' },
    { icon: FiKey, label: 'Ready to Move' },
];

export default function PropertyManagementPage() {
    return (
        <>
            {/* ================= HERO ================= */}
            <section className="relative bg-blue-900 text-white pt-28 pb-24 md:pt-36 md:pb-32 overflow-hidden">
                {/* layered ambience */}
                <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_15%_20%,white,transparent_45%)]" />
                <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_85%_90%,#d4af37,transparent_40%)]" />
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />

                <div className="container mx-auto px-5 relative">
                    {/* breadcrumb */}
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-blue-200 mb-6">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <FiChevronRight className="w-3.5 h-3.5 text-blue-300/70" />
                        <span className="text-white font-medium">Property Management</span>
                    </nav>

                    <div className="max-w-3xl">
                        <p className="inline-flex items-center gap-2 text-gold font-semibold tracking-widest uppercase text-xs md:text-sm mb-4">
                            <span className="w-8 h-px bg-gold" /> Property Management
                        </p>
                        <h1 className="text-4xl md:text-6xl font-bold leading-[1.1]">
                            Find your next <span className="text-gold">home</span> with Vivion
                        </h1>
                        <p className="text-blue-100 mt-5 max-w-2xl text-base md:text-lg leading-relaxed">
                            Handpicked, verified rental properties across the city — browse by locality,
                            size, and amenities. Enquire directly and we&apos;ll take care of the rest.
                        </p>

                        {/* trust points */}
                        <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8">
                            {TRUST_POINTS.map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-2 text-sm text-blue-100">
                                    <Icon className="w-4 h-4 text-gold" />
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* smooth transition into the listings */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-gray-50" />
            </section>

            {/* ================= LISTINGS ================= */}
            <section className="py-14 md:py-20 bg-gray-50 -mt-px">
                <div className="container mx-auto px-5">
                    <PropertyListing />
                    <LocalityLinks />
                </div>
            </section>

            <JsonLd
                data={breadcrumbJsonLd([
                    { name: 'Home', path: '/' },
                    { name: 'Property Management', path: '/property-management' },
                ])}
            />
        </>
    );
}
