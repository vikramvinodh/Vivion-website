import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import UsersManager from '@/components/admin/UsersManager';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect('/login');
    }

    await dbConnect();
    
    // Fetch all users sorted by registration date descending
    const users = await User.find({}).sort({ createdAt: -1 });

    const currentUserId = (session.user as any).id || '';

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Users</h1>
                <p className="text-sm text-gray-500 mt-1">Register new administrators, change system roles, or remove accounts.</p>
            </div>

            <UsersManager 
                initialUsers={JSON.parse(JSON.stringify(users))} 
                currentUserId={currentUserId} 
            />
        </div>
    );
}
