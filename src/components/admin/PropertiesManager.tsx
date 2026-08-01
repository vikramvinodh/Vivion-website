"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiMaximize, FiExternalLink } from 'react-icons/fi';

interface Property {
    _id: string;
    slug: string;
    locality: string;
    bhk: string;
    sqft: number;
    propertyType: string;
    rent?: number;
    availability: string;
    coverImage: string;
}

export default function PropertiesManager({ initialProperties }: { initialProperties: Property[] }) {
    const router = useRouter();
    const [properties, setProperties] = useState(initialProperties);
    const [deleting, setDeleting] = useState<string | null>(null);

    const handleDelete = async (slug: string) => {
        if (!confirm('Delete this property listing? This cannot be undone.')) return;
        setDeleting(slug);
        try {
            const res = await fetch(`/api/properties/${slug}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            setProperties(prev => prev.filter(p => p.slug !== slug));
            router.refresh();
        } catch {
            alert('Failed to delete property.');
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex justify-end">
                <Link href="/admin/properties/create"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition">
                    <FiPlus className="w-4 h-4" /> Add Property
                </Link>
            </div>

            {properties.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-gray-200 p-16 text-center">
                    <FiMapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No properties yet.</p>
                    <p className="text-sm text-gray-400">Click “Add Property” to create your first listing.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {properties.map((p) => (
                        <div key={p._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="relative h-40 bg-gray-100">
                                {p.coverImage ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={p.coverImage} alt={p.locality} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <FiMapPin className="w-8 h-8" />
                                    </div>
                                )}
                                <span className="absolute top-2 right-2 text-[11px] font-semibold bg-white/90 text-gray-700 px-2 py-1 rounded-full shadow-sm">
                                    {p.availability}
                                </span>
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                    <FiMapPin className="w-3.5 h-3.5" /> {p.locality}
                                </div>
                                <h3 className="font-bold text-gray-900">{p.bhk} · {p.propertyType}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                                    <span className="flex items-center gap-1"><FiMaximize className="w-3.5 h-3.5" /> {p.sqft} sq.ft</span>
                                    {typeof p.rent === 'number' && p.rent > 0 && (
                                        <span className="text-gray-400">₹{p.rent.toLocaleString('en-IN')}/mo</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                                    <Link href={`/admin/properties/edit/${p.slug}`}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold transition">
                                        <FiEdit2 className="w-3.5 h-3.5" /> Edit
                                    </Link>
                                    <Link href={`/property-management/${p.slug}`} target="_blank"
                                        className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 transition" title="View on site">
                                        <FiExternalLink className="w-4 h-4" />
                                    </Link>
                                    <button onClick={() => handleDelete(p.slug)} disabled={deleting === p.slug}
                                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition disabled:opacity-50" title="Delete">
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
