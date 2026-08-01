import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import PropertyForm from '@/components/admin/PropertyForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditPropertyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    await dbConnect();
    const property = await Property.findOne({ slug });

    if (!property) notFound();

    // Admin edits the full document (including private fields).
    const data = JSON.parse(JSON.stringify(property));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Property</h1>
                <p className="text-sm text-gray-500 mt-1">{data.locality} · {data.bhk}</p>
            </div>
            <PropertyForm initialData={data} isEditing />
        </div>
    );
}
