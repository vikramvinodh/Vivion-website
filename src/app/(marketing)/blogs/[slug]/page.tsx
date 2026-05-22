import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { FiCalendar, FiUser, FiClock, FiChevronRight, FiShare2, FiBookOpen } from 'react-icons/fi';
import ShareButton from '@/components/blogs/ShareButton';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
    await dbConnect();
    const post = await Post.findOne({ slug, published: true }).populate('author', 'name');
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    await dbConnect();
    const post = await Post.findOne({ slug, published: true });

    if (!post) {
        return {
            title: 'Article Not Found | Vivion Infra',
            description: 'The requested article could not be found.',
        };
    }

    return {
        title: `${post.title} | Vivion Infra`,
        description: post.excerpt || `${post.title} - Read our latest insights on construction, premium architectural design, and modern engineering.`,
        keywords: ['construction', 'architecture', 'interior design', 'civil engineering', 'luxury homes', post.title.toLowerCase()],
        openGraph: {
            title: post.title,
            description: post.excerpt || `${post.title} - Insights by Vivion Infra.`,
            images: post.coverImage ? [{ url: post.coverImage }] : [],
            type: 'article',
            publishedTime: post.createdAt,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: post.coverImage ? [post.coverImage] : [],
        }
    };
}

export default async function BlogPostDetailPage({ params }: Props) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    // Estimate reading time: ~200 words per minute
    const wordCount = post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.round(wordCount / 200));

    return (
        <article className="pt-24 min-h-screen bg-slate-50 text-slate-800 pb-20">
            {/* Breadcrumb Navigation */}
            <div className="bg-slate-100/80 border-b border-slate-200/50 py-3 mb-10">
                <div className="container mx-auto px-6 max-w-4xl flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Link href="/" className="hover:text-blue-900 transition-colors">
                        Home
                    </Link>
                    <FiChevronRight className="w-3 h-3 text-slate-400" />
                    <Link href="/blogs" className="hover:text-blue-900 transition-colors">
                        Blog
                    </Link>
                    <FiChevronRight className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-800 truncate max-w-[240px] md:max-w-xs">{post.title}</span>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-4xl">
                {/* Back Link */}
                <Link
                    href="/blogs"
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 mb-8 transition duration-200 group"
                >
                    <span className="transition-transform group-hover:-translate-x-1">←</span> Back to all articles
                </Link>

                {/* Article Header */}
                <header className="mb-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-4 border border-blue-100/50">
                        <FiBookOpen className="w-3.5 h-3.5" /> Construction Insights
                    </span>
                    
                    <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight mb-6">
                        {post.title}
                    </h1>

                    {/* Metadata bar */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 border-y border-slate-200/60 py-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                                {(post.author?.name || 'A')[0].toUpperCase()}
                            </div>
                            <span className="font-semibold text-slate-700">{post.author?.name || 'Vivion Admin'}</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                                <FiCalendar className="w-4 h-4 text-slate-400" />
                                {new Date(post.createdAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                })}
                            </span>
                            
                            <span className="flex items-center gap-1.5">
                                <FiClock className="w-4 h-4 text-slate-400" />
                                {readingTime} min read
                            </span>
                        </div>
                    </div>
                </header>

                {post.coverImage && (post.coverImage.startsWith('/') || post.coverImage.startsWith('http')) && (
                    <div className="mb-12 w-full aspect-[21/9] relative rounded-2xl overflow-hidden shadow-md border border-slate-200/50">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Excerpt if present */}
                {post.excerpt && (
                    <div className="bg-white border-l-4 border-amber-500 rounded-r-xl p-5 mb-10 shadow-xs">
                        <p className="text-slate-650 italic text-base leading-relaxed font-medium">
                            "{post.excerpt}"
                        </p>
                    </div>
                )}

                {/* Content Area */}
                <div
                    className="prose-content max-w-none text-slate-700 leading-relaxed text-base md:text-lg space-y-6"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Footer / Share Box */}
                <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">Vivion Infra Facility Pvt. Ltd.</h4>
                        <p className="text-xs text-slate-500">Premium design, execution, and facility management services.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-450 uppercase tracking-wider">Share:</span>
                        <ShareButton title={post.title} />
                    </div>
                </div>
            </div>
        </article>
    );
}
