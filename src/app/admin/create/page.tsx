import PostForm from "@/components/admin/PostForm";

export default function CreatePostPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-blue-900 mb-8 max-w-4xl mx-auto">Create New Post</h1>
            <PostForm />
        </div>
    );
}
