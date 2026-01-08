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
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-blue-900 mb-8 max-w-4xl mx-auto">Edit Post: {post.title}</h1>
            <PostForm initialData={post} isEditing={true} />
        </div>
    );
}
