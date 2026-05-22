import PostForm from "@/components/admin/PostForm";

export default function CreatePostPage() {
    return (
        <div className="space-y-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create New Post</h1>
                <p className="text-sm text-gray-500 mt-1">Compose and publish a new article to the website.</p>
            </div>
            <PostForm />
        </div>
    );
}
