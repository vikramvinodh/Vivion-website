"use client";

import { useEffect, useState, useCallback } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight, FiHome, FiX, FiSliders } from 'react-icons/fi';
import PropertyCard, { PublicProperty } from './PropertyCard';

const PAGE_LIMIT = 9;

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'largest', label: 'Largest' },
    { value: 'smallest', label: 'Smallest' },
    { value: 'oldest', label: 'Oldest' },
];

function CardSkeleton() {
    return (
        <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm animate-pulse">
            <div className="h-64 bg-gray-200" />
            <div className="p-6 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto mt-6" />
                <div className="h-4 bg-gray-100 rounded w-1/3 mx-auto mt-6" />
            </div>
        </div>
    );
}

export default function PropertyListing() {
    const [properties, setProperties] = useState<PublicProperty[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [debounced, setDebounced] = useState('');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Debounce the search box so we don't hit the API on every keystroke.
    useEffect(() => {
        const t = setTimeout(() => { setDebounced(search); setPage(1); }, 400);
        return () => clearTimeout(t);
    }, [search]);

    const fetchProperties = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(PAGE_LIMIT),
                sort,
            });
            if (debounced) params.set('q', debounced);

            const res = await fetch(`/api/properties?${params.toString()}`);
            const data = await res.json();
            setProperties(data.properties || []);
            setTotalPages(data.totalPages || 1);
            setTotal(data.total || 0);
        } catch {
            setProperties([]);
        } finally {
            setLoading(false);
        }
    }, [page, sort, debounced]);

    useEffect(() => { fetchProperties(); }, [fetchProperties]);

    return (
        <div>
            {/* ================= TOOLBAR ================= */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 mb-10 sticky top-20 z-30">
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                    {/* search */}
                    <div className="relative flex-1 lg:max-w-md">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by locality, BHK, type…"
                            className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 focus:bg-white transition"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                aria-label="Clear search"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* sort — segmented control */}
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 uppercase tracking-wide">
                            <FiSliders className="w-3.5 h-3.5" /> Sort
                        </span>
                        <div className="flex bg-gray-100 rounded-xl p-1 overflow-x-auto">
                            {SORT_OPTIONS.map(o => (
                                <button
                                    key={o.value}
                                    onClick={() => { setSort(o.value); setPage(1); }}
                                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                                        sort === o.value
                                            ? 'bg-white text-blue-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    {o.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= RESULT META ================= */}
            {!loading && (
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-gray-500">
                        {total > 0 ? (
                            <>
                                Showing <span className="font-semibold text-blue-900">{properties.length}</span> of{' '}
                                <span className="font-semibold text-blue-900">{total}</span>{' '}
                                {total === 1 ? 'home' : 'homes'}
                                {debounced && <> for &ldquo;<span className="text-gray-700">{debounced}</span>&rdquo;</>}
                            </>
                        ) : null}
                    </p>
                </div>
            )}

            {/* ================= GRID ================= */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
                </div>
            ) : properties.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-5">
                        <FiHome className="w-7 h-7 text-gray-300" />
                    </div>
                    <p className="text-lg font-semibold text-gray-700">No properties found</p>
                    <p className="text-sm text-gray-400 mt-1.5">
                        {debounced ? 'Try a different search term or clear the filter.' : 'Please check back soon.'}
                    </p>
                    {debounced && (
                        <button
                            onClick={() => setSearch('')}
                            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition"
                        >
                            Clear search
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {properties.map(p => <PropertyCard key={p.slug} property={p} />)}
                </div>
            )}

            {/* ================= PAGINATION ================= */}
            {!loading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-14">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="flex items-center gap-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-blue-900 hover:text-blue-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition"
                    >
                        <FiChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Prev</span>
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`w-11 h-11 rounded-lg text-sm font-semibold transition ${
                                page === i + 1
                                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                                    : 'border border-gray-200 bg-white text-gray-600 hover:border-blue-900 hover:text-blue-900'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="flex items-center gap-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-blue-900 hover:text-blue-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition"
                    >
                        <span className="hidden sm:inline">Next</span> <FiChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
