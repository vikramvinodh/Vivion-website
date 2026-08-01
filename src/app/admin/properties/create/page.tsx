import PropertyForm from '@/components/admin/PropertyForm';

export default function CreatePropertyPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add New Property</h1>
                <p className="text-sm text-gray-500 mt-1">Fill in the property details. Owner info and pricing stay private.</p>
            </div>
            <PropertyForm />
        </div>
    );
}
