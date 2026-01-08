import Link from 'next/link';
import Post from '@/models/Post';
import dbConnect from '@/lib/mongodb';
import { notFound } from 'next/navigation';

async function getPost(slug: string) {
    await dbConnect();
    const post = await Post.findOne({ slug, published: true }).populate('author', 'name');
    if (!post) return null;
    return post;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const userPost = await getPost(slug);

    if (!userPost) {
        notFound();
    }

    const post = JSON.parse(JSON.stringify(userPost));

    return (
        <article className="container mx-auto px-4 py-12 max-w-4xl">
            <Link href="/blog" className="text-blue-600 mb-4 inline-block hover:underline">
                ← Back to Blog
            </Link>

            <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-heading">{post.title}</h1>
                <div className="flex items-center gap-4 text-gray-500 text-sm md:text-base">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>By {post.author?.name || 'Admin'}</span>
                </div>
            </header>

            {post.coverImage && (
                <div className="mb-10 w-full aspect-video relative rounded-xl overflow-hidden shadow-lg">
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                </div>
            )}

            <div
                className="prose prose-lg max-w-none prose-blue"
                dangerouslySetInnerHTML={{ __html: post.content }} // CAUTION: In real app, sanitize this!
            />
        </article>
    );
}
