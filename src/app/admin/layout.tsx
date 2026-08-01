import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
    title: 'Admin',
    // Belt and braces alongside robots.txt and the X-Robots-Tag set in proxy.ts.
    robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    // Secure the entire admin panel. Only authenticated admin users can enter.
    if (!session || !session.user || (session.user as any).role !== 'admin') {
        redirect('/login');
    }

    const user = session.user as any;

    return (
        <div className="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
            {/* Sidebar Navigation */}
            <AdminSidebar session={session} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
                    <div className="flex items-center">
                        <span className="text-sm text-gray-500 font-medium">
                            Role: <span className="text-blue-600 capitalize font-semibold">{user.role}</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-700">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                    </div>
                </header>

                {/* Dashboard Scrollable Workspace */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
