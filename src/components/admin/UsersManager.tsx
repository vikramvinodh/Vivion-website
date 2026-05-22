"use client";

import { useState } from 'react';
import { FiPlus, FiSearch, FiTrash2, FiUserCheck, FiShield, FiX, FiCheck } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface UserData {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

interface UsersManagerProps {
    initialUsers: UserData[];
    currentUserId: string;
}

export default function UsersManager({ initialUsers, currentUserId }: UsersManagerProps) {
    const [users, setUsers] = useState<UserData[]>(initialUsers);
    const [search, setSearch] = useState('');
    
    // Create user form modal state
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });
    
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Toggle Role (User <-> Admin)
    const toggleRole = async (user: UserData) => {
        if (user._id === currentUserId) {
            alert("You cannot demote or change your own role!");
            return;
        }

        const newRole = user.role === 'admin' ? 'user' : 'admin';
        if (!confirm(`Are you sure you want to change ${user.name}'s role to ${newRole}?`)) return;

        setUpdatingId(user._id);
        try {
            const res = await fetch(`/api/users/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to update role');
            }

            setUsers(prev =>
                prev.map(u => (u._id === user._id ? { ...u, role: newRole } : u))
            );
            router.refresh();
        } catch (error: any) {
            alert(error.message || 'Error updating user role');
        } finally {
            setUpdatingId(null);
        }
    };

    // Delete User
    const handleDelete = async (user: UserData) => {
        if (user._id === currentUserId) {
            alert("You cannot delete your own account!");
            return;
        }

        if (!confirm(`Are you sure you want to permanently delete the user ${user.name} (${user.email})?`)) return;

        setDeletingId(user._id);
        try {
            const res = await fetch(`/api/users/${user._id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to delete user');
            }

            setUsers(prev => prev.filter(u => u._id !== user._id));
            router.refresh();
        } catch (error: any) {
            alert(error.message || 'Error deleting user');
        } finally {
            setDeletingId(null);
        }
    };

    // Create User
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to create user');
            }

            const newUser = await res.json();
            setUsers(prev => [newUser, ...prev]);
            
            // Reset form and modal
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'user'
            });
            setShowModal(false);
            router.refresh();
        } catch (error: any) {
            setFormError(error.message);
        } finally {
            setFormLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative w-full md:w-80">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                        <FiSearch className="h-4 w-4" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                    />
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                    <FiPlus className="w-4 h-4" /> Add User
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User Details</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Joined</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50/30 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shadow-sm border border-gray-200">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 text-sm">
                                                    {user.name} {user._id === currentUserId && <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 rounded px-1.5 py-0.5 ml-1.5 font-medium">You</span>}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-0.5">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleRole(user)}
                                            disabled={updatingId === user._id || user._id === currentUserId}
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                                                user._id === currentUserId ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                                            } ${
                                                user.role === 'admin'
                                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100/80'
                                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100/80'
                                            }`}
                                            title={user._id === currentUserId ? "Cannot toggle your own role" : "Click to toggle role"}
                                        >
                                            {user.role === 'admin' ? (
                                                <>
                                                    <FiShield className="w-3 h-3" /> Admin
                                                </>
                                            ) : (
                                                <>
                                                    <FiUserCheck className="w-3 h-3" /> User
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {user._id !== currentUserId && (
                                            <button
                                                onClick={() => handleDelete(user)}
                                                disabled={deletingId === user._id}
                                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 rounded-md transition cursor-pointer"
                                                title="Delete User"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-400 text-sm">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for adding user */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-gray-200 overflow-hidden transform transition-all">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900 text-lg">Add New User</h3>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setFormError('');
                                }}
                                className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {formError && (
                                <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-100">
                                    {formError}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/30"
                                    required
                                    placeholder="e.g. Vikram Vinodh"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/30"
                                    required
                                    placeholder="e.g. user@vivion.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/30"
                                    required
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">System Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/30"
                                >
                                    <option value="user">User (Standard)</option>
                                    <option value="admin">Admin (Full Control)</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setFormError('');
                                    }}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
                                >
                                    <FiCheck className="w-4 h-4" /> {formLoading ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
