"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { FiGrid, FiBookOpen, FiUsers, FiExternalLink, FiLogOut, FiDollarSign } from 'react-icons/fi';

interface AdminSidebarProps {
    session: any;
}

export default function AdminSidebar({ session }: AdminSidebarProps) {
    const pathname = usePathname();

    const menuItems = [
        {
            name: 'Overview',
            path: '/admin',
            icon: FiGrid,
        },
        {
            name: 'Blogs',
            path: '/admin/blogs',
            icon: FiBookOpen,
        },
        {
            name: 'Estimations',
            path: '/admin/estimations',
            icon: FiDollarSign,
        },
        {
            name: 'Users',
            path: '/admin/users',
            icon: FiUsers,
        },
    ];

    const isActive = (path: string) => {
        if (path === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(path);
    };

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-300">
            {/* Header / Brand Logo */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3 bg-slate-950/40">
                <div className="relative h-9 w-9 rounded-md overflow-hidden bg-white/10 flex items-center justify-center p-1">
                    <Image
                        src="/logo.png"
                        alt="Vivion Logo"
                        width={28}
                        height={28}
                        className="object-contain"
                    />
                </div>
                <div>
                    <h1 className="font-bold text-white tracking-wide text-sm">VIVION INFRA</h1>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Admin Panel</p>
                </div>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Core Dashboard
                </div>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                active
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20 font-semibold'
                                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                            }`}
                        >
                            <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                            {item.name}
                        </Link>
                    );
                })}

                <div className="pt-6 border-t border-slate-800/80 my-4"></div>

                <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Quick Links
                </div>
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200"
                >
                    <FiExternalLink className="w-4 h-4" />
                    View Website
                </Link>
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/20">
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all duration-200 cursor-pointer"
                >
                    <FiLogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
