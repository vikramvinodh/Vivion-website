import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import dbConnect from '@/lib/mongodb';
import Property, { PUBLIC_PROPERTY_FIELDS } from '@/models/Property';
import PropertyCard, { PublicProperty } from '@/components/property/PropertyCard';

export default async function FeaturedProperties() {
    await dbConnect();
    const docs = await Property.find({})
        .select(PUBLIC_PROPERTY_FIELDS)
        .sort({ createdAt: -1 })
        .limit(3);

    const properties: PublicProperty[] = JSON.parse(JSON.stringify(docs));

    // Don't render an empty section if there are no listings yet.
    if (properties.length === 0) return null;

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-5">
                <div className="text-center mb-16">
                    <h2 className="font-heading font-bold text-4xl text-blue-900 mb-4">
                        Homes Available Now
                    </h2>
                    <div className="w-20 h-1 bg-gold mx-auto mb-5"></div>
                    <p className="text-text-light text-lg">
                        Handpicked, verified lease properties managed by Vivion.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {properties.map((p) => (
                        <PropertyCard key={p.slug} property={p} />
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/property-management"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-blue-900 font-bold rounded-full uppercase tracking-wider hover:bg-gold-light hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                    >
                        View All Properties <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
