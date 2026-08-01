"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';

interface PostData {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    createdAt: string;
    author?: {
        name: string;
    };
}

interface BlogsListProps {
    posts: PostData[];
}

export default function BlogsList({ posts }: BlogsListProps) {
    const [search, setSearch] = useState('');

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
        post.content?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Search Filter */}
            <div className="max-w-md mx-auto relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450 pointer-events-none">
                    <FiSearch className="h-5 w-5" />
                </span>
                <input
                    type="text"
                    placeholder="Search articles by title or keyword..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-700 shadow-xs"
                />
            </div>

            {/* Blogs Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                    <article
                        key={post._id}
                        className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group"
                    >
                        {/* Cover Image */}
                        <div className="h-56 w-full bg-slate-100 relative overflow-hidden shrink-0">
                            {post.coverImage && (post.coverImage.startsWith('/') || post.coverImage.startsWith('http')) ? (
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-103"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-blue-900 flex items-center justify-center p-6 text-center">
                                    <h4 className="text-white/40 font-heading text-lg font-bold">VIVION CONSTRUCTION</h4>
                                </div>
                            )}
                            <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                                Construction
                            </div>
                        </div>

                        {/* Card Info */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3.5">
                                    <span className="flex items-center gap-1">
                                        <FiCalendar className="w-3.5 h-3.5" />
                                        {new Date(post.createdAt).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiUser className="w-3.5 h-3.5" />
                                        {post.author?.name || 'Admin'}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold text-slate-800 mb-3.5 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                                    <Link href={`/blogs/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </h2>

                                <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-3">
                                    {post.excerpt || (post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...')}
                                </p>
                            </div>

                            <Link
                                href={`/blogs/${post.slug}`}
                                className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition"
                            >
                                Read article <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </article>
                ))}
            </div>

            {filteredPosts.length === 0 && (
                <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-xs">
                    <p className="text-slate-400 text-sm font-medium">No articles found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}
