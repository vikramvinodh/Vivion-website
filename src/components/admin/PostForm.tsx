"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        content: initialData?.content || '',
        excerpt: initialData?.excerpt || '',
        coverImage: initialData?.coverImage || '',
        published: initialData?.published || false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = isEditing
                ? `/api/posts/${initialData?.slug}`
                : '/api/posts';

            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Something went wrong');
            }

            router.push('/admin');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Excerpt</label>
                <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    rows={3}
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Cover Image URL</label>
                <input
                    type="text"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    placeholder="https://example.com/image.jpg"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Content (HTML supported)</label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    className="w-full border p-2 rounded font-mono text-sm"
                    rows={15}
                    required
                />
            </div>

            <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="published"
                        checked={formData.published}
                        onChange={handleCheckboxChange}
                        className="w-5 h-5"
                    />
                    <span className="text-gray-700 font-bold">Publish immediately</span>
                </label>
            </div>

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
                </button>
            </div>
        </form>
    );
}
