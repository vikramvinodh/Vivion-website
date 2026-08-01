import dbConnect from '@/lib/mongodb';
import Locality from '@/models/Locality';
import Property from '@/models/Property';
import LocalitiesManager from '@/components/admin/LocalitiesManager';

export const dynamic = 'force-dynamic';

export default async function AdminLocalitiesPage() {
    await dbConnect();

    const localities = await Locality.find({}).sort({ name: 1 }).lean();
    const counts = await Property.aggregate<{ _id: string; count: number }>([
        { $group: { _id: '$localitySlug', count: { $sum: 1 } } },
    ]);
    const countBySlug = new Map(counts.map((c) => [c._id, c.count]));

    const withCounts = localities.map((locality: any) => ({
        ...locality,
        propertyCount: countBySlug.get(locality.slug) || 0,
    }));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Localities</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Each published locality gets its own landing page targeting searches like “flats for rent in BTM Layout”.
                    Properties pick their locality from this list.
                </p>
            </div>

            <LocalitiesManager initialLocalities={JSON.parse(JSON.stringify(withCounts))} />
        </div>
    );
}
