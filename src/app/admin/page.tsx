import Link from 'next/link';
import Post from '@/models/Post';
import dbConnect from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

async function getPosts() {
    await dbConnect();
    const posts = await Post.find({}).sort({ createdAt: -1 }); // Get all posts, published or not
    return posts;
}

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    const posts = await getPosts();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-blue-900">Admin Dashboard</h1>
                <Link href="/admin/create" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    + Create New Post
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {posts.map((userPost) => {
                            const post = JSON.parse(JSON.stringify(userPost));
                            return (
                                <tr key={post._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {post.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link href={`/admin/edit/${post.slug}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                        <Link href={`/blog/${post.slug}`} target="_blank" className="text-gray-400 hover:text-gray-600">View</Link>
                                    </td>
                                </tr>
                            );
                        })}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No posts yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
