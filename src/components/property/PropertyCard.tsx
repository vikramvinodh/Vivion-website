import Link from 'next/link';
import Image from 'next/image';
import { FiMapPin, FiMaximize, FiCompass } from 'react-icons/fi';
import { LuBath } from 'react-icons/lu';

export interface PublicProperty {
    slug: string;
    bhk: string;
    sqft: number;
    facing: string;
    propertyType: string;
    locality: string;
    bathrooms: number;
    furnishing: string;
    availability: string;
    coverImage: string;
    images: string[];
}

export default function PropertyCard({ property }: { property: PublicProperty }) {
    const cover = property.coverImage || property.images?.[0] || '';

    return (
        <Link
            href={`/property-management/${property.slug}`}
            className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gold/50 h-full"
        >
            {/* Image */}
            <div className="relative h-64 w-full overflow-hidden">
                {cover ? (
                    <Image
                        src={cover}
                        alt={`${property.bhk} ${property.propertyType} for rent in ${property.locality}, Bangalore`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                        <FiMapPin className="w-10 h-10" />
                    </div>
                )}
                <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors duration-300" />

                {/* Availability badge */}
                <span className="absolute top-4 left-4 text-[11px] font-semibold uppercase tracking-wide bg-white/95 text-blue-900 px-3 py-1 rounded-full shadow-sm">
                    {property.availability}
                </span>
                {property.furnishing && (
                    <span className="absolute top-4 right-4 text-[11px] font-semibold bg-blue-900/90 text-white px-3 py-1 rounded-full">
                        {property.furnishing}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-6 text-center border-b-4 border-transparent group-hover:border-gold transition-all duration-300">
                <h3 className="font-heading font-bold text-xl text-blue-900 mb-2 group-hover:text-gold transition-colors">
                    {property.bhk} {property.propertyType}
                </h3>
                <div className="flex items-center justify-center gap-1.5 text-text-light text-sm mb-5">
                    <FiMapPin className="w-4 h-4 text-gold" /> {property.locality}
                </div>

                {/* Specs */}
                <div className="flex items-center justify-center divide-x divide-gray-200 text-text-light text-sm">
                    <span className="flex items-center gap-1.5 px-4">
                        <FiMaximize className="w-4 h-4 text-gray-400" /> {property.sqft} sq.ft
                    </span>
                    <span className="flex items-center gap-1.5 px-4">
                        <LuBath className="w-4 h-4 text-gray-400" /> {property.bathrooms} Bath
                    </span>
                    {property.facing && (
                        <span className="flex items-center gap-1.5 px-4">
                            <FiCompass className="w-4 h-4 text-gray-400" /> {property.facing}
                        </span>
                    )}
                </div>

                <span className="inline-block mt-6 text-sm font-semibold text-blue-900 group-hover:text-gold transition-colors uppercase tracking-wider">
                    View Details →
                </span>
            </div>
        </Link>
    );
}
