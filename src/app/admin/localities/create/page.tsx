import LocalityForm from '@/components/admin/LocalityForm';

export default function CreateLocalityPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add New Locality</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Create the locality first, then assign properties to it from the property form.
                </p>
            </div>
            <LocalityForm />
        </div>
    );
}
