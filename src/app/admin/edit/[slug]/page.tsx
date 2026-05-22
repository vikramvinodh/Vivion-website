import PostForm from "@/components/admin/PostForm";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { notFound } from "next/navigation";

async function getPost(slug: string) {
    await dbConnect();
    const post = await Post.findOne({ slug });
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
}

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Post</h1>
                <p className="text-sm text-gray-500 mt-1">Make changes to the post titled "{post.title}".</p>
            </div>
            <PostForm initialData={post} isEditing={true} />
        </div>
    );
}
