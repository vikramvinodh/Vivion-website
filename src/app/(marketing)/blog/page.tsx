import Link from 'next/link';
import Post from '@/models/Post';
import dbConnect from '@/lib/mongodb';

async function getPosts() {
    await dbConnect();
    // Fetch only published posts
    const posts = await Post.find({ published: true }).sort({ createdAt: -1 }).populate('author', 'name');
    return posts;
}

export default async function BlogPage() {
    const posts = await getPosts();

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8 text-center font-heading text-blue-900">Our Blog</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((userPost) => {
                    // Serialize Mongoose document to plain object for React
                    const post = JSON.parse(JSON.stringify(userPost));

                    return (
                        <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                            {post.coverImage && (
                                <div className="h-48 w-full bg-gray-200 relative">
                                    {/* Simplified image for now, replace with Next/Image if valid URL */}
                                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="p-6">
                                <h2 className="text-2xl font-bold mb-2 text-gray-800 line-clamp-2">
                                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                                        {post.title}
                                    </Link>
                                </h2>
                                <div className="text-sm text-gray-500 mb-4 flex gap-2">
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{post.author?.name || 'Admin'}</span>
                                </div>
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {post.excerpt || post.content.substring(0, 150) + '...'}
                                </p>
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="inline-block text-blue-600 font-medium hover:underline"
                                >
                                    Read more →
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {posts.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                    <p>No posts found. Check back soon!</p>
                </div>
            )}
        </div>
    );
}
