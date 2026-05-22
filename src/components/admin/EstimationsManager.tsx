"use client";

import { useState } from 'react';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiCheckCircle, FiDollarSign, FiInfo } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface EstimationData {
    _id: string;
    category: 'basic' | 'medium' | 'premium' | 'max';
    title: string;
    costPerSqFt: number;
    description: string;
    inclusions: string[];
    updatedAt: string;
}

interface EstimationsManagerProps {
    initialEstimations: EstimationData[];
}

export default function EstimationsManager({ initialEstimations }: EstimationsManagerProps) {
    const [estimations, setEstimations] = useState<EstimationData[]>(initialEstimations);
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<EstimationData>>({});
    const [newInclusion, setNewInclusion] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleStartEdit = (est: EstimationData) => {
        setEditingCategory(est.category);
        setEditForm({ ...est });
        setNewInclusion('');
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        setEditForm({});
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: name === 'costPerSqFt' ? Number(value) : value
        }));
    };

    const handleAddInclusion = () => {
        if (!newInclusion.trim()) return;
        const currentInclusions = editForm.inclusions || [];
        setEditForm(prev => ({
            ...prev,
            inclusions: [...currentInclusions, newInclusion.trim()]
        }));
        setNewInclusion('');
    };

    const handleRemoveInclusion = (index: number) => {
        const currentInclusions = editForm.inclusions || [];
        setEditForm(prev => ({
            ...prev,
            inclusions: currentInclusions.filter((_, i) => i !== index)
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const res = await fetch('/api/estimations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update settings');
            }

            const updatedData = await res.json();
            
            // Update client state
            setEstimations(prev =>
                prev.map(est => est.category === editForm.category ? updatedData : est)
            );
            
            setSuccessMessage(`Pricing for "${updatedData.title}" updated successfully!`);
            setEditingCategory(null);
            router.refresh();
        } catch (err: any) {
            setErrorMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatCategoryName = (cat: string) => {
        switch (cat) {
            case 'basic': return 'Standard / Basic';
            case 'medium': return 'Executive / Medium';
            case 'premium': return 'Premium / Luxury';
            case 'max': return 'Elite / Max';
            default: return cat;
        }
    };

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'basic': return 'border-slate-300 text-slate-700 bg-slate-50';
            case 'medium': return 'border-blue-300 text-blue-700 bg-blue-50';
            case 'premium': return 'border-amber-300 text-amber-700 bg-amber-50';
            case 'max': return 'border-purple-300 text-purple-700 bg-purple-50';
            default: return 'border-gray-300 text-gray-700 bg-gray-50';
        }
    };

    return (
        <div className="space-y-6">
            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-3 text-sm animate-fade-in shadow-sm">
                    <FiCheckCircle className="w-5 h-5 shrink-0" />
                    <span>{successMessage}</span>
                </div>
            )}
            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 text-sm animate-fade-in shadow-sm">
                    <FiInfo className="w-5 h-5 shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {estimations.map((est) => {
                    const isEditing = editingCategory === est.category;

                    return (
                        <div 
                            key={est._id} 
                            className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col transition-all duration-300 ${
                                isEditing ? 'ring-2 ring-blue-500 scale-[1.01]' : 'hover:shadow-md'
                            }`}
                        >
                            {/* Card Header */}
                            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                                <div>
                                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] uppercase font-extrabold tracking-wider border mb-2 ${getCategoryColor(est.category)}`}>
                                        {formatCategoryName(est.category)}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                        {isEditing ? editForm.title : est.title}
                                    </h3>
                                </div>
                                {!isEditing && (
                                    <button
                                        onClick={() => handleStartEdit(est)}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition cursor-pointer"
                                    >
                                        <FiEdit2 className="w-3.5 h-3.5" /> Edit Rate
                                    </button>
                                )}
                            </div>

                            {/* Card Body */}
                            {isEditing ? (
                                <form onSubmit={handleSave} className="p-6 flex-1 flex flex-col space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Display Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={editForm.title || ''}
                                                onChange={handleFieldChange}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cost per Sq. Ft. (₹ INR)</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 font-semibold text-sm pointer-events-none">
                                                    ₹
                                                </span>
                                                <input
                                                    type="number"
                                                    name="costPerSqFt"
                                                    value={editForm.costPerSqFt || 0}
                                                    onChange={handleFieldChange}
                                                    className="w-full pl-7 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                                                    required
                                                    min={100}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            value={editForm.description || ''}
                                            onChange={handleFieldChange}
                                            rows={2}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* Inclusions Editor */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Specifications & Inclusions</label>
                                        
                                        {/* Inclusions List */}
                                        <div className="max-h-56 overflow-y-auto border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50/50 mb-3">
                                            {(editForm.inclusions || []).map((inclusion, idx) => (
                                                <div key={idx} className="flex justify-between items-center gap-2 bg-white px-3 py-2 rounded-md border border-gray-150 text-sm text-gray-700">
                                                    <span className="truncate">{inclusion}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveInclusion(idx)}
                                                        className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-gray-100 cursor-pointer"
                                                    >
                                                        <FiTrash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                            {(editForm.inclusions || []).length === 0 && (
                                                <p className="text-xs text-gray-400 text-center py-4">No specifications added yet. Add one below.</p>
                                            )}
                                        </div>

                                        {/* Add Inclusion Input */}
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newInclusion}
                                                onChange={e => setNewInclusion(e.target.value)}
                                                placeholder="e.g. Steel: Tata Tiscon FE 550"
                                                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddInclusion();
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddInclusion}
                                                className="bg-gray-100 hover:bg-gray-200 border border-gray-250 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                            >
                                                <FiPlus className="w-3.5 h-3.5" /> Add
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 mt-auto">
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-50 transition cursor-pointer"
                                        >
                                            <FiX className="w-3.5 h-3.5" /> Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
                                        >
                                            <FiSave className="w-3.5 h-3.5" /> {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        {/* Cost */}
                                        <div className="flex items-baseline gap-1 text-gray-900">
                                            <span className="text-3xl font-extrabold tracking-tight">₹{est.costPerSqFt.toLocaleString('en-IN')}</span>
                                            <span className="text-xs font-semibold text-gray-400">/ Sq.Ft.</span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            {est.description}
                                        </p>

                                        {/* Inclusions List Preview */}
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Key Specifications</h4>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {est.inclusions.slice(0, 6).map((incl, index) => (
                                                    <li key={index} className="text-xs text-gray-600 flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                                        <span className="truncate" title={incl}>{incl}</span>
                                                    </li>
                                                ))}
                                                {est.inclusions.length > 6 && (
                                                    <li className="text-xs text-blue-500 font-semibold">
                                                        + {est.inclusions.length - 6} more specifications
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Footer Update Time */}
                                    <div className="text-[10px] text-gray-400 mt-6 pt-4 border-t border-gray-100">
                                        Last Updated: {new Date(est.updatedAt).toLocaleString()}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
