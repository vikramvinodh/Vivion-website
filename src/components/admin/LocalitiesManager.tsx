"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiExternalLink, FiHome, FiAlertTriangle } from 'react-icons/fi';

interface Locality {
    _id: string;
    name: string;
    slug: string;
    about: string;
    heroImage: string;
    active: boolean;
    propertyCount: number;
}

export default function LocalitiesManager({ initialLocalities }: { initialLocalities: Locality[] }) {
    const router = useRouter();
    const [localities, setLocalities] = useState(initialLocalities);
    const [deleting, setDeleting] = useState<string | null>(null);

    const handleDelete = async (slug: string) => {
        if (!confirm('Delete this locality? Its landing page will stop existing.')) return;
        setDeleting(slug);
        try {
            const res = await fetch(`/api/localities/${slug}`, { method: 'DELETE' });
            const data = await res.json();
            // The API refuses to delete a locality that still has listings.
            if (!res.ok) throw new Error(data.error || 'Failed to delete');
            setLocalities((prev) => prev.filter((l) => l.slug !== slug));
            router.refresh();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex justify-end">
                <Link
                    href="/admin/localities/create"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition"
                >
                    <FiPlus className="w-4 h-4" /> Add Locality
                </Link>
            </div>

            {localities.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-gray-200 p-16 text-center">
                    <FiMapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No localities yet.</p>
                    <p className="text-sm text-gray-400">Add one before creating properties — the property form picks from this list.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50/70 text-xs uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="text-left font-semibold px-5 py-3">Locality</th>
                                <th className="text-left font-semibold px-5 py-3">Listings</th>
                                <th className="text-left font-semibold px-5 py-3">Status</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {localities.map((l) => {
                                const hasCopy = Boolean(l.about && l.about.trim());
                                return (
                                    <tr key={l._id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-gray-900">{l.name}</div>
                                            <div className="text-xs text-gray-400 font-mono mt-0.5">/{l.slug}</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-1.5 text-gray-600">
                                                <FiHome className="w-3.5 h-3.5 text-gray-400" />
                                                {l.propertyCount}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col gap-1.5 items-start">
                                                <span
                                                    className={`inline-flex text-[11px] font-semibold px-2 py-1 rounded-full ${
                                                        l.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                                                    }`}
                                                >
                                                    {l.active ? 'Published' : 'Draft'}
                                                </span>
                                                {!hasCopy && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-600">
                                                        <FiAlertTriangle className="w-3 h-3" /> No copy written
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/localities/edit/${l.slug}`}
                                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold transition"
                                                >
                                                    <FiEdit2 className="w-3.5 h-3.5" /> Edit
                                                </Link>
                                                {l.active && (
                                                    <Link
                                                        href={`/property-management/locality/${l.slug}`}
                                                        target="_blank"
                                                        className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 transition"
                                                        title="View on site"
                                                    >
                                                        <FiExternalLink className="w-4 h-4" />
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(l.slug)}
                                                    disabled={deleting === l.slug}
                                                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
