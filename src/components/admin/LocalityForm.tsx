"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiX, FiUploadCloud, FiAlertCircle } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import type { SkilldeckEditorRef } from 'skilldeck-editor';

// Same as PostForm — the editor touches document/window, so no SSR.
const SkilldeckEditor = dynamic(
    () => import('skilldeck-editor').then((mod) => mod.SkilldeckEditor),
    { ssr: false },
);

export interface LocalityData {
    _id?: string;
    name: string;
    slug?: string;
    about: string;
    metaTitle: string;
    metaDescription: string;
    heroImage: string;
    active: boolean;
}

const EMPTY: LocalityData = {
    name: '',
    about: '',
    metaTitle: '',
    metaDescription: '',
    heroImage: '',
    active: false,
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

export default function LocalityForm({
    initialData,
    isEditing = false,
    propertyCount = 0,
}: {
    initialData?: LocalityData;
    isEditing?: boolean;
    propertyCount?: number;
}) {
    const router = useRouter();
    const editorRef = useRef<SkilldeckEditorRef | null>(null);
    const [form, setForm] = useState<LocalityData>({ ...EMPTY, ...initialData });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    const set = (name: keyof LocalityData, value: any) => setForm((prev) => ({ ...prev, [name]: value }));
    const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        set(e.target.name as keyof LocalityData, e.target.value);

    const handleEditorReady = (methods: SkilldeckEditorRef) => {
        editorRef.current = methods;
        if (initialData?.about) methods.injectHTML(initialData.about);
    };

    const handleHero = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError('');
        try {
            const body = new FormData();
            body.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upload failed');
            set('heroImage', data.url);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const about = editorRef.current ? editorRef.current.getHTML() : form.about;
            const cleanAbout = !about || about.trim() === '' || about === '<p><br></p>' ? '' : about;

            // A published page with no copy is exactly the thin content this
            // whole feature exists to avoid, so block it at the source.
            if (form.active && !cleanAbout) {
                throw new Error(
                    'Write the “About this locality” copy before publishing — an empty locality page will not rank.',
                );
            }

            const url = isEditing ? `/api/localities/${initialData?.slug}` : '/api/localities';
            const res = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, about: cleanAbout }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Something went wrong');
            }
            router.push('/admin/localities');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 p-4 rounded-lg text-sm">
                    <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <Section title="Locality" subtitle="The name becomes the page URL and the label in the property form.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Name</label>
                        <input name="name" value={form.name} onChange={handle} className={inputCls} placeholder="BTM Layout" required />
                    </div>
                    <div>
                        <label className={labelCls}>Page URL</label>
                        <div className="px-3.5 py-2.5 rounded-lg bg-gray-100 text-sm text-gray-500 font-mono truncate">
                            /property-management/locality/
                            <span className="text-gray-800">
                                {(form.name || 'locality')
                                    .toLowerCase()
                                    .trim()
                                    .replace(/[^a-z0-9\s-]/g, '')
                                    .replace(/\s+/g, '-')}
                            </span>
                        </div>
                        {isEditing && (
                            <p className="text-[11px] text-amber-600 mt-1.5">
                                Renaming changes this URL. The {propertyCount} listing{propertyCount === 1 ? '' : 's'} here move with it,
                                but the old URL will 404.
                            </p>
                        )}
                    </div>
                </div>
            </Section>

            <Section
                title="About this Locality"
                subtitle="Connectivity, landmarks, typical rents, who lives here. This is what makes the page rank rather than read as a bare list of listings."
            >
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <SkilldeckEditor onReady={handleEditorReady} />
                </div>
            </Section>

            <Section title="Search Appearance" subtitle="Leave blank to auto-generate from the locality name and live inventory.">
                <div className="space-y-4">
                    <div>
                        <label className={labelCls}>Meta Title</label>
                        <input
                            name="metaTitle"
                            value={form.metaTitle}
                            onChange={handle}
                            className={inputCls}
                            placeholder="Flats for Rent in BTM Layout, Bangalore"
                            maxLength={70}
                        />
                        <p className="text-[11px] text-gray-400 mt-1">{form.metaTitle.length}/70 — Google truncates past ~60.</p>
                    </div>
                    <div>
                        <label className={labelCls}>Meta Description</label>
                        <textarea
                            name="metaDescription"
                            value={form.metaDescription}
                            onChange={handle}
                            rows={3}
                            className={inputCls}
                            placeholder="Browse verified 2 and 3 BHK flats for rent in BTM Layout…"
                            maxLength={170}
                        />
                        <p className="text-[11px] text-gray-400 mt-1">{form.metaDescription.length}/170 — Google truncates past ~160.</p>
                    </div>
                </div>
            </Section>

            <Section title="Hero Image" subtitle="Optional. Shown at the top of the locality page and as the social share image.">
                <div className="flex items-start gap-4">
                    {form.heroImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={form.heroImage} alt="Hero" className="w-48 h-28 object-cover rounded-lg border border-gray-200" />
                    ) : (
                        <div className="w-48 h-28 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                            <FiUploadCloud className="w-7 h-7" />
                        </div>
                    )}
                    <div className="flex flex-col gap-2">
                        <label className="cursor-pointer">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition">
                                <FiUploadCloud className="w-4 h-4" /> {uploading ? 'Uploading…' : 'Upload Image'}
                            </span>
                            <input type="file" accept="image/*" onChange={handleHero} disabled={uploading} className="hidden" />
                        </label>
                        {form.heroImage && (
                            <button type="button" onClick={() => set('heroImage', '')} className="text-xs text-red-600 hover:underline text-left px-1">
                                Remove
                            </button>
                        )}
                    </div>
                </div>
            </Section>

            <Section title="Publish" subtitle="Unpublished localities are hidden from the website and left out of the sitemap.">
                <button
                    type="button"
                    onClick={() => set('active', !form.active)}
                    className={`flex items-center justify-between w-full md:w-80 px-4 py-3 rounded-lg border text-sm font-medium transition ${
                        form.active ? 'bg-green-50 border-green-300 text-green-700' : 'bg-gray-50/40 border-gray-200 text-gray-500'
                    }`}
                >
                    {form.active ? 'Published — live on the website' : 'Draft — hidden from the website'}
                    <span className={`ml-3 inline-flex h-5 w-9 items-center rounded-full transition ${form.active ? 'bg-green-600' : 'bg-gray-300'}`}>
                        <span className={`h-4 w-4 transform rounded-full bg-white transition ${form.active ? 'translate-x-4' : 'translate-x-1'}`} />
                    </span>
                </button>
                {isEditing && propertyCount === 0 && (
                    <p className="text-[11px] text-amber-600 mt-3">
                        No listings in this locality yet. A published page with nothing on it is thin content — keep it a draft until you have inventory.
                    </p>
                )}
            </Section>

            <div className="flex justify-end gap-3 sticky bottom-4">
                <div className="flex gap-3 bg-white/80 backdrop-blur rounded-xl border border-gray-200 shadow-sm p-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
                    >
                        <FiX className="w-4 h-4" /> Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm transition disabled:opacity-50"
                    >
                        <FiSave className="w-4 h-4" /> {loading ? 'Saving…' : isEditing ? 'Update Locality' : 'Create Locality'}
                    </button>
                </div>
            </div>
        </form>
    );
}
