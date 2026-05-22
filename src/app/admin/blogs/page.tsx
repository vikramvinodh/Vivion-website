import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import BlogsManager from '@/components/admin/BlogsManager';

export const dynamic = 'force-dynamic';

export default async function AdminBlogsPage() {
    await dbConnect();
    
    // Fetch all posts sorted by creation date descending
    const posts = await Post.find({}).sort({ createdAt: -1 });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Blogs</h1>
                <p className="text-sm text-gray-500 mt-1">Create, edit, delete, and control publication status of articles.</p>
            </div>

            <BlogsManager initialPosts={JSON.parse(JSON.stringify(posts))} />
        </div>
    );
}
