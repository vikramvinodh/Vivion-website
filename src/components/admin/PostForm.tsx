"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiX, FiCheckCircle } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import type { SkilldeckEditorRef } from 'skilldeck-editor';

// Dynamically import the editor with SSR disabled because it relies on document and window objects
const SkilldeckEditor = dynamic(
    () => import('skilldeck-editor').then((mod) => mod.SkilldeckEditor),
    { ssr: false }
);

interface PostFormProps {
    initialData?: {
        title: string;
        content: string;
        excerpt: string;
        coverImage: string;
        published: boolean;
        slug?: string;
    };
    isEditing?: boolean;
}

export default function PostForm({ initialData, isEditing = false }: PostFormProps) {
    const router = useRouter();
    const editorRef = useRef<SkilldeckEditorRef | null>(null);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        content: initialData?.content || '',
        excerpt: initialData?.excerpt || '',
        coverImage: initialData?.coverImage || '',
        published: initialData?.published || false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

            setFormData(prev => ({ ...prev, coverImage: data.url }));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
            e.target.value = ''; // allow re-selecting the same file
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleEditorReady = (methods: SkilldeckEditorRef) => {
        editorRef.current = methods;
        if (initialData?.content) {
            methods.injectHTML(initialData.content);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Get content from skilldeck-editor
            const htmlContent = editorRef.current ? editorRef.current.getHTML() : formData.content;
            if (!htmlContent || htmlContent.trim() === '' || htmlContent === '<p><br></p>') {
                throw new Error('Please write some content in the editor');
            }

            const url = isEditing
                ? `/api/posts/${initialData?.slug}`
                : '/api/posts';

            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, content: htmlContent }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Something went wrong');
            }

            router.push('/admin/blogs');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Post Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/30"
                    placeholder="Enter a descriptive post title..."
                    required
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Excerpt</label>
                <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/30"
                    placeholder="Summarize the article in 1-2 sentences..."
                    rows={3}
                    maxLength={200}
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cover Image</label>
                <div className="flex items-start gap-4">
                    {formData.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={formData.coverImage}
                            alt="Cover preview"
                            className="w-32 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                        />
                    )}
                    <div className="flex-1 space-y-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer disabled:opacity-50"
                        />
                        {uploading && <p className="text-xs text-blue-600">Uploading…</p>}
                        <input
                            type="text"
                            name="coverImage"
                            value={formData.coverImage}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/30"
                            placeholder="…or paste an image URL"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Content</label>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white min-h-[420px] shadow-sm">
                    <SkilldeckEditor
                        onReady={handleEditorReady}
                    />
                </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        name="published"
                        checked={formData.published}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-gray-700">Publish immediately to website</span>
                </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition cursor-pointer"
                >
                    <FiX className="w-4 h-4" /> Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer animate-all"
                >
                    <FiSave className="w-4 h-4" /> {loading ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
                </button>
            </div>
        </form>
    );
}
