import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import BlogsList from '@/components/blogs/BlogsList';

export const dynamic = 'force-dynamic';

async function getPosts() {
    await dbConnect();
    // Fetch only published posts, populate author's name
    const posts = await Post.find({ published: true })
        .sort({ createdAt: -1 })
        .populate('author', 'name');
    return JSON.parse(JSON.stringify(posts));
}

export default async function PublicBlogsPage() {
    const posts = await getPosts();

    return (
        <div className="pt-24 min-h-screen bg-slate-50 text-slate-800 pb-16">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-blue-600 font-semibold tracking-widest text-xs uppercase block mb-3">
                        Latest Insights
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
                        Our News & Articles
                    </h1>
                    <div className="w-16 h-1 bg-amber-500 mx-auto my-5 rounded-full" />
                    <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                        Read construction advice, interior layout trends, architectural design ideas, and industry updates compiled by the experts at Vivion.
                    </p>
                </div>

                <BlogsList posts={posts} />
            </div>
        </div>
    );
}
