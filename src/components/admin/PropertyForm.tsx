"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiSave, FiX, FiUploadCloud, FiTrash2, FiStar, FiPlus, FiCheck } from 'react-icons/fi';

export interface PropertyData {
    _id?: string;
    slug?: string;
    ownerName: string;
    ownerNumber: string;
    rent: number | string;
    maintenance: number | string;
    deposit: string;
    bhk: string;
    sqft: number | string;
    facing: string;
    propertyType: string;
    locality: string;
    bathrooms: number | string;
    availableFloor: string;
    lift: boolean;
    powerBackup: boolean;
    petsFriendly: boolean;
    furnishing: string;
    religionRestrictions: string;
    eatingHabits: string;
    parking: string;
    availability: string;
    coverImage: string;
    images: string[];
}

const EMPTY: PropertyData = {
    ownerName: '', ownerNumber: '', rent: '', maintenance: '', deposit: '',
    bhk: '', sqft: '', facing: '', propertyType: 'Apartment', locality: '',
    bathrooms: '', availableFloor: '', lift: false, powerBackup: false,
    petsFriendly: false, furnishing: '', religionRestrictions: '',
    eatingHabits: '', parking: '', availability: 'Ready to move',
    coverImage: '', images: [],
};

const inputCls =
    'w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/40';
const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="mb-5">
                <h3 className="text-base font-bold text-gray-900">{title}</h3>
                {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}

export default function PropertyForm({ initialData, isEditing = false }: { initialData?: PropertyData; isEditing?: boolean }) {
    const router = useRouter();
    const [form, setForm] = useState<PropertyData>({ ...EMPTY, ...initialData });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadingCover, setUploadingCover] = useState(false);
    const [uploadingGallery, setUploadingGallery] = useState(false);

    // Localities are a controlled list — free text here would spawn duplicate,
    // half-empty landing pages ("BTM Layout" vs "btm layout").
    const [localities, setLocalities] = useState<{ name: string; slug: string }[]>([]);
    const [addingLocality, setAddingLocality] = useState(false);
    const [newLocality, setNewLocality] = useState('');
    const [savingLocality, setSavingLocality] = useState(false);

    useEffect(() => {
        // ?all=1 includes unpublished localities — a property has to be
        // assignable before its locality page goes live.
        fetch('/api/localities?all=1')
            .then(res => res.json())
            .then(data => setLocalities(data.localities || []))
            .catch(() => setLocalities([]));
    }, []);

    const createLocality = async () => {
        const name = newLocality.trim();
        if (!name) return;
        setSavingLocality(true); setError('');
        try {
            const res = await fetch('/api/localities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create locality');
            setLocalities(prev => [...prev, { name: data.name, slug: data.slug }].sort((a, b) => a.name.localeCompare(b.name)));
            set('locality', data.name);
            setNewLocality(''); setAddingLocality(false);
        } catch (err: any) { setError(err.message); }
        finally { setSavingLocality(false); }
    };

    const set = (name: keyof PropertyData, value: any) => setForm(prev => ({ ...prev, [name]: value }));
    const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => set(e.target.name as keyof PropertyData, e.target.value);

    const uploadFile = async (file: File): Promise<string> => {
        const body = new FormData();
        body.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        return data.url as string;
    };

    const handleCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingCover(true); setError('');
        try {
            set('coverImage', await uploadFile(file));
        } catch (err: any) { setError(err.message); }
        finally { setUploadingCover(false); e.target.value = ''; }
    };

    const handleGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setUploadingGallery(true); setError('');
        try {
            const urls = await Promise.all(files.map(uploadFile));
            set('images', [...form.images, ...urls]);
        } catch (err: any) { setError(err.message); }
        finally { setUploadingGallery(false); e.target.value = ''; }
    };

    const removeImage = (url: string) => set('images', form.images.filter(i => i !== url));
    const makeCover = (url: string) => set('coverImage', url);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const payload = {
                ...form,
                rent: Number(form.rent) || 0,
                maintenance: Number(form.maintenance) || 0,
                sqft: Number(form.sqft) || 0,
                bathrooms: Number(form.bathrooms) || 0,
            };
            const url = isEditing ? `/api/properties/${initialData?.slug}` : '/api/properties';
            const res = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Something went wrong');
            }
            router.push('/admin/properties');
            router.refresh();
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    const Toggle = ({ name, label }: { name: keyof PropertyData; label: string }) => (
        <button
            type="button"
            onClick={() => set(name, !form[name])}
            className={`flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm font-medium transition ${
                form[name] ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-gray-50/40 border-gray-200 text-gray-500'
            }`}
        >
            {label}
            <span className={`ml-3 inline-flex h-5 w-9 items-center rounded-full transition ${form[name] ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <span className={`h-4 w-4 transform rounded-full bg-white transition ${form[name] ? 'translate-x-4' : 'translate-x-1'}`} />
            </span>
        </button>
    );

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
            {error && <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-lg text-sm">{error}</div>}

            {/* Owner (private) */}
            <Section title="Owner Details" subtitle="Private — never shown on the public website.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Owner Name</label>
                        <input name="ownerName" value={form.ownerName} onChange={handle} className={inputCls} placeholder="Vijaykumar" required />
                    </div>
                    <div>
                        <label className={labelCls}>Owner Number</label>
                        <input name="ownerNumber" value={form.ownerNumber} onChange={handle} className={inputCls} placeholder="8939593011" required />
                    </div>
                </div>
            </Section>

            {/* Property details */}
            <Section title="Property Details">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className={labelCls}>BHK</label>
                        <input name="bhk" value={form.bhk} onChange={handle} className={inputCls} placeholder="2 BHK" required />
                    </div>
                    <div>
                        <label className={labelCls}>Property Type</label>
                        <select name="propertyType" value={form.propertyType} onChange={handle} className={inputCls}>
                            <option>Apartment</option>
                            <option>Independent House</option>
                            <option>Villa</option>
                            <option>Studio</option>
                            <option>Penthouse</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Locality</label>
                        {addingLocality ? (
                            <div className="flex gap-2">
                                <input
                                    value={newLocality}
                                    onChange={(e) => setNewLocality(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); createLocality(); } }}
                                    className={inputCls}
                                    placeholder="New locality name"
                                    autoFocus
                                />
                                <button type="button" onClick={createLocality} disabled={savingLocality}
                                    className="px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition" title="Create">
                                    <FiCheck className="w-4 h-4" />
                                </button>
                                <button type="button" onClick={() => { setAddingLocality(false); setNewLocality(''); }}
                                    className="px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 transition" title="Cancel">
                                    <FiX className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <select name="locality" value={form.locality} onChange={handle} className={inputCls} required>
                                <option value="">Select…</option>
                                {localities.map(l => <option key={l.slug} value={l.name}>{l.name}</option>)}
                                {/* An edit whose locality was since renamed or removed — keep it
                                    selectable so saving doesn't silently reassign the property. */}
                                {form.locality && !localities.some(l => l.name === form.locality) && (
                                    <option value={form.locality}>{form.locality}</option>
                                )}
                            </select>
                        )}
                        {!addingLocality && (
                            <div className="flex items-center gap-3 mt-1.5">
                                <button type="button" onClick={() => setAddingLocality(true)}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline">
                                    <FiPlus className="w-3 h-3" /> Add new
                                </button>
                                <Link href="/admin/localities" target="_blank" className="text-[11px] text-gray-400 hover:text-gray-600">
                                    Manage localities
                                </Link>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className={labelCls}>Built-up Area (sq. ft)</label>
                        <input name="sqft" type="number" value={form.sqft} onChange={handle} className={inputCls} placeholder="1200" required />
                    </div>
                    <div>
                        <label className={labelCls}>Facing</label>
                        <select name="facing" value={form.facing} onChange={handle} className={inputCls}>
                            <option value="">Select…</option>
                            <option>North</option><option>South</option><option>East</option><option>West</option>
                            <option>North-East</option><option>North-West</option><option>South-East</option><option>South-West</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Bathrooms</label>
                        <input name="bathrooms" type="number" value={form.bathrooms} onChange={handle} className={inputCls} placeholder="2" />
                    </div>
                    <div>
                        <label className={labelCls}>Available Floor</label>
                        <input name="availableFloor" value={form.availableFloor} onChange={handle} className={inputCls} placeholder="2nd Floor" />
                    </div>
                    <div>
                        <label className={labelCls}>Availability</label>
                        <select name="availability" value={form.availability} onChange={handle} className={inputCls}>
                            <option>Ready to move</option>
                            <option>Under construction</option>
                            <option>Available from next month</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Furnishing</label>
                        <select name="furnishing" value={form.furnishing} onChange={handle} className={inputCls}>
                            <option value="">Select…</option>
                            <option>Unfurnished</option>
                            <option>Semi Furnished</option>
                            <option>Fully Furnished</option>
                        </select>
                    </div>
                </div>
            </Section>

            {/* Pricing (private) */}
            <Section title="Pricing" subtitle="Private — used internally only, never displayed publicly.">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className={labelCls}>Rent (₹ / month)</label>
                        <input name="rent" type="number" value={form.rent} onChange={handle} className={inputCls} placeholder="45000" />
                    </div>
                    <div>
                        <label className={labelCls}>Maintenance (₹)</label>
                        <input name="maintenance" type="number" value={form.maintenance} onChange={handle} className={inputCls} placeholder="3500" />
                    </div>
                    <div>
                        <label className={labelCls}>Deposit</label>
                        <input name="deposit" value={form.deposit} onChange={handle} className={inputCls} placeholder="8 months" />
                    </div>
                </div>
            </Section>

            {/* Amenities & preferences */}
            <Section title="Amenities & Preferences">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    <Toggle name="lift" label="Lift" />
                    <Toggle name="powerBackup" label="Power Backup" />
                    <Toggle name="petsFriendly" label="Pets Friendly" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className={labelCls}>Parking</label>
                        <input name="parking" value={form.parking} onChange={handle} className={inputCls} placeholder="Yes, inside" />
                    </div>
                    <div>
                        <label className={labelCls}>Religion Preference</label>
                        <input name="religionRestrictions" value={form.religionRestrictions} onChange={handle} className={inputCls} placeholder="Hindu and Christian" />
                    </div>
                    <div>
                        <label className={labelCls}>Eating Habits</label>
                        <select name="eatingHabits" value={form.eatingHabits} onChange={handle} className={inputCls}>
                            <option value="">Select…</option>
                            <option>Vegetarian</option>
                            <option>Non-Vegetarian</option>
                            <option>Both</option>
                        </select>
                    </div>
                </div>
            </Section>

            {/* Images */}
            <Section title="Images" subtitle="Upload a cover image and gallery photos. The cover appears on listing cards.">
                {/* Cover */}
                <div className="mb-6">
                    <label className={labelCls}>Cover Image</label>
                    <div className="flex items-start gap-4">
                        {form.coverImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={form.coverImage} alt="Cover" className="w-40 h-28 object-cover rounded-lg border border-gray-200" />
                        ) : (
                            <div className="w-40 h-28 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                                <FiUploadCloud className="w-7 h-7" />
                            </div>
                        )}
                        <label className="cursor-pointer">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition">
                                <FiUploadCloud className="w-4 h-4" /> {uploadingCover ? 'Uploading…' : 'Upload Cover'}
                            </span>
                            <input type="file" accept="image/*" onChange={handleCover} disabled={uploadingCover} className="hidden" />
                        </label>
                    </div>
                </div>

                {/* Gallery */}
                <div>
                    <label className={labelCls}>Gallery Images</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {form.images.map((url) => (
                            <div key={url} className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-gray-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt="Property" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                    <button type="button" onClick={() => makeCover(url)} title="Set as cover"
                                        className={`p-2 rounded-full ${form.coverImage === url ? 'bg-yellow-400 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'}`}>
                                        <FiStar className="w-4 h-4" />
                                    </button>
                                    <button type="button" onClick={() => removeImage(url)} title="Remove"
                                        className="p-2 rounded-full bg-white/90 text-red-600 hover:bg-white">
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                {form.coverImage === url && (
                                    <span className="absolute top-1.5 left-1.5 text-[10px] font-bold bg-yellow-400 text-white px-1.5 py-0.5 rounded">COVER</span>
                                )}
                            </div>
                        ))}
                        <label className="cursor-pointer aspect-[4/3] rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-500 transition">
                            <FiUploadCloud className="w-6 h-6 mb-1" />
                            <span className="text-xs font-medium">{uploadingGallery ? 'Uploading…' : 'Add photos'}</span>
                            <input type="file" accept="image/*" multiple onChange={handleGallery} disabled={uploadingGallery} className="hidden" />
                        </label>
                    </div>
                </div>
            </Section>

            {/* Actions */}
            <div className="flex justify-end gap-3 sticky bottom-4">
                <div className="flex gap-3 bg-white/80 backdrop-blur rounded-xl border border-gray-200 shadow-sm p-3">
                    <button type="button" onClick={() => router.back()}
                        className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">
                        <FiX className="w-4 h-4" /> Cancel
                    </button>
                    <button type="submit" disabled={loading}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm transition disabled:opacity-50">
                        <FiSave className="w-4 h-4" /> {loading ? 'Saving…' : (isEditing ? 'Update Property' : 'Create Property')}
                    </button>
                </div>
            </div>
        </form>
    );
}
