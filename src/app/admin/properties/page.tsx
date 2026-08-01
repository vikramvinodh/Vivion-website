import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import PropertiesManager from '@/components/admin/PropertiesManager';

export const dynamic = 'force-dynamic';

export default async function AdminPropertiesPage() {
    await dbConnect();
    const properties = await Property.find({}).sort({ createdAt: -1 });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Property Management</h1>
                <p className="text-sm text-gray-500 mt-1">Create, edit, and manage rental property listings shown on the website.</p>
            </div>

            <PropertiesManager initialProperties={JSON.parse(JSON.stringify(properties))} />
        </div>
    );
}
