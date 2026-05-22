"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface PostData {
    _id: string;
    title: string;
    slug: string;
    published: boolean;
    createdAt: string;
    author?: {
        name: string;
    };
}

interface BlogsManagerProps {
    initialPosts: PostData[];
}

export default function BlogsManager({ initialPosts }: BlogsManagerProps) {
    const [posts, setPosts] = useState<PostData[]>(initialPosts);
    const [search, setSearch] = useState('');
    const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    // Toggle publish status
    const togglePublish = async (slug: string, currentStatus: boolean) => {
        setLoadingSlug(slug);
        try {
            const res = await fetch(`/api/posts/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ published: !currentStatus }),
            });

            if (!res.ok) throw new Error('Failed to update status');

            setPosts(prev =>
                prev.map(post => (post.slug === slug ? { ...post, published: !currentStatus } : post))
            );
            router.refresh();
        } catch (error) {
            alert('Error updating post status');
        } finally {
            setLoadingSlug(null);
        }
    };

    // Delete post
    const handleDelete = async (slug: string, id: string) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/posts/${slug}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete post');

            setPosts(prev => prev.filter(post => post._id !== id));
            router.refresh();
        } catch (error) {
            alert('Error deleting post');
        } finally {
            setDeletingId(null);
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative w-full md:w-80">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                        <FiSearch className="h-4 w-4" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                    />
                </div>
                <Link
                    href="/admin/create"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                    <FiPlus className="w-4 h-4" /> Add Blog Post
                </Link>
            </div>

            {/* Blogs Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPosts.map((post) => (
                                <tr key={post._id} className="hover:bg-gray-50/30 transition">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900 text-sm max-w-md truncate">{post.title}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">Slug: {post.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => togglePublish(post.slug, post.published)}
                                            disabled={loadingSlug === post.slug}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
                                                post.published
                                                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                                            }`}
                                        >
                                            {post.published ? (
                                                <>
                                                    <FiEye className="w-3.5 h-3.5" /> Published
                                                </>
                                            ) : (
                                                <>
                                                    <FiEyeOff className="w-3.5 h-3.5" /> Draft
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="inline-flex gap-2">
                                            <Link
                                                href={`/admin/edit/${post.slug}`}
                                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 border border-gray-200 rounded-md transition"
                                                title="Edit"
                                            >
                                                <FiEdit2 className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.slug, post._id)}
                                                disabled={deletingId === post._id}
                                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 rounded-md transition cursor-pointer"
                                                title="Delete"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredPosts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-400 text-sm">
                                        No blog posts found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
