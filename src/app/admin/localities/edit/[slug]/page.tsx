import dbConnect from '@/lib/mongodb';
import Locality from '@/models/Locality';
import Property from '@/models/Property';
import LocalityForm from '@/components/admin/LocalityForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditLocalityPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    await dbConnect();

    const locality = await Locality.findOne({ slug });
    if (!locality) notFound();

    const propertyCount = await Property.countDocuments({ localitySlug: slug });
    const data = JSON.parse(JSON.stringify(locality));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Locality</h1>
                <p className="text-sm text-gray-500 mt-1">
                    {data.name} · {propertyCount} listing{propertyCount === 1 ? '' : 's'}
                </p>
            </div>
            <LocalityForm initialData={data} isEditing propertyCount={propertyCount} />
        </div>
    );
}
