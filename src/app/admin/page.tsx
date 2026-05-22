import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { FiBookOpen, FiEdit3, FiUsers, FiPlus } from 'react-icons/fi';

async function getDashboardData() {
    await dbConnect();

    const [totalPosts, publishedPosts, totalUsers, recentPosts, recentUsers] = await Promise.all([
        Post.countDocuments({}),
        Post.countDocuments({ published: true }),
        User.countDocuments({}),
        Post.find({}).sort({ createdAt: -1 }).limit(5).populate('author', 'name'),
        User.find({}).sort({ createdAt: -1 }).limit(5)
    ]);

    return {
        totalPosts,
        publishedPosts,
        draftPosts: totalPosts - publishedPosts,
        totalUsers,
        recentPosts: JSON.parse(JSON.stringify(recentPosts)),
        recentUsers: JSON.parse(JSON.stringify(recentUsers))
    };
}

export default async function AdminDashboardPage() {
    const data = await getDashboardData();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-sm text-gray-500 mt-1">Real-time statistics and recent activity for Vivion Infra.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/create" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-sm cursor-pointer">
                        <FiPlus className="w-4 h-4" /> Create Blog
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Stats 1 */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Blogs</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{data.totalPosts}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        <FiBookOpen className="w-6 h-6" />
                    </div>
                </div>

                {/* Stats 2 */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Published Blogs</p>
                        <h3 className="text-3xl font-bold text-green-600 mt-1">{data.publishedPosts}</h3>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-green-600">
                        <FiBookOpen className="w-6 h-6" />
                    </div>
                </div>

                {/* Stats 3 */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Draft Blogs</p>
                        <h3 className="text-3xl font-bold text-yellow-600 mt-1">{data.draftPosts}</h3>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600">
                        <FiEdit3 className="w-6 h-6" />
                    </div>
                </div>

                {/* Stats 4 */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Users</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{data.totalUsers}</h3>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                        <FiUsers className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Content Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Blogs */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="font-bold text-gray-800 text-base">Recent Blogs</h2>
                        <Link href="/admin/blogs" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition">
                            Manage All
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {data.recentPosts.map((post: any) => (
                            <div key={post._id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition">
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-gray-900 text-sm">{post.title}</h4>
                                    <p className="text-xs text-gray-400">
                                        Published: {post.published ? 'Yes' : 'Draft'} • {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <Link
                                    href={`/admin/edit/${post.slug}`}
                                    className="text-xs font-medium text-gray-500 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 px-3 py-1.5 rounded-md border border-gray-200 hover:border-blue-200 transition"
                                >
                                    Edit
                                </Link>
                            </div>
                        ))}
                        {data.recentPosts.length === 0 && (
                            <div className="p-6 text-center text-gray-400 text-sm">No blogs written yet.</div>
                        )}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="font-bold text-gray-800 text-base">Recent Users</h2>
                        <Link href="/admin/users" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition">
                            Manage All
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {data.recentUsers.map((user: any) => (
                            <div key={user._id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-xs">{user.name}</h4>
                                        <p className="text-[10px] text-gray-400">{user.email}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                                    user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-800'
                                }`}>
                                    {user.role}
                                </span>
                            </div>
                        ))}
                        {data.recentUsers.length === 0 && (
                            <div className="p-6 text-center text-gray-400 text-sm">No users registered yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
