"use client";

import { useState, useMemo } from 'react';
import { FiCheck, FiInfo, FiSliders, FiDollarSign, FiPercent, FiList, FiPhoneCall, FiGrid } from 'react-icons/fi';
import { motion } from 'framer-motion';
import LeadModal from '@/components/LeadModal';

interface EstimationData {
    _id: string;
    category: 'basic' | 'medium' | 'premium' | 'max';
    title: string;
    costPerSqFt: number;
    description: string;
    inclusions: string[];
}

interface EstimationsCalculatorProps {
    initialEstimations: EstimationData[];
}

export default function EstimationsCalculator({ initialEstimations }: EstimationsCalculatorProps) {
    const [area, setArea] = useState<number>(2000);
    const [selectedCategory, setSelectedCategory] = useState<'basic' | 'medium' | 'premium' | 'max'>('medium');
    const [leadOpen, setLeadOpen] = useState(false);

    const activeEstimation = useMemo(() => {
        return initialEstimations.find(est => est.category === selectedCategory) || initialEstimations[0];
    }, [selectedCategory, initialEstimations]);

    const totalCost = useMemo(() => {
        return area * activeEstimation.costPerSqFt;
    }, [area, activeEstimation]);

    // Format numbers to Indian Currency system
    const formatINR = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    };

    // Format to Lakhs/Crores readable shorthand
    const formatINRWords = (value: number) => {
        if (value >= 10000000) {
            return `₹ ${(value / 10000000).toFixed(2)} Crores`;
        }
        return `₹ ${(value / 100000).toFixed(2)} Lakhs`;
    };

    // Cost Breakdowns
    const breakdowns = useMemo(() => {
        return [
            { name: "Civil Structure & Shell", percentage: 55, color: "bg-amber-500", desc: "Foundation, RCC beams/columns, brickwork, plastering, premium cement & steel." },
            { name: "Finishing & Interiors", percentage: 25, color: "bg-blue-500", desc: "Flooring, wall paint, custom woodwork, windows, and main door installations." },
            { name: "Plumbing, Electrical & MEP", percentage: 12, color: "bg-emerald-500", desc: "Internal wiring, PVC conduits, water lines, drainage piping, and modular switches." },
            { name: "Architectural & Supervision", percentage: 8, color: "bg-purple-500", desc: "Architectural drawings, structural engineering plans, project management & site safety supervision." }
        ];
    }, []);

    const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (val < 0) return;
        setArea(val);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input & Calculator Section */}
            <div className="lg:col-span-8 space-y-8">
                
                {/* Step 1: Area Input */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 text-amber-500">
                            <FiSliders className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">1. Select Build Area</h3>
                            <p className="text-xs text-slate-400">Specify the total built-up area in Square Feet</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Area Input Box */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <input
                                    type="range"
                                    min="500"
                                    max="10000"
                                    step="50"
                                    value={area}
                                    onChange={(e) => setArea(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 font-semibold mt-2">
                                    <span>500 SQ.FT.</span>
                                    <span>5,000 SQ.FT.</span>
                                    <span>10,000 SQ.FT.</span>
                                </div>
                            </div>
                            <div className="w-36 relative">
                                <input
                                    type="number"
                                    value={area}
                                    onChange={handleAreaChange}
                                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-right text-lg font-bold text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                    min="100"
                                    max="50000"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-slate-500 tracking-wider">
                                    SQ.FT.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 2: Tier Selection */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 text-amber-500">
                            <FiGrid className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">2. Select Quality Specifications</h3>
                            <p className="text-xs text-slate-400">Choose the quality tier matching your aspirations</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {initialEstimations.map((est) => {
                            const isSelected = selectedCategory === est.category;

                            return (
                                <div
                                    key={est._id}
                                    onClick={() => setSelectedCategory(est.category)}
                                    className={`p-5 rounded-xl border transition-all duration-350 cursor-pointer flex flex-col justify-between ${
                                        isSelected
                                            ? 'bg-slate-950/80 border-amber-500/80 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20 scale-[1.01]'
                                            : 'bg-slate-900/40 border-slate-800 hover:border-slate-700/80'
                                    }`}
                                >
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className={`font-bold transition-colors ${isSelected ? 'text-amber-500' : 'text-white'}`}>
                                                {est.title}
                                            </h4>
                                            <span className={`text-xs font-extrabold tracking-wider uppercase px-2 py-0.5 rounded border ${
                                                est.category === 'basic' ? 'border-slate-800 text-slate-400 bg-slate-900/20' :
                                                est.category === 'medium' ? 'border-blue-900/50 text-blue-400 bg-blue-950/10' :
                                                est.category === 'premium' ? 'border-amber-900/50 text-amber-400 bg-amber-950/10' :
                                                'border-purple-900/50 text-purple-400 bg-purple-950/10'
                                            }`}>
                                                {est.category}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                            {est.description}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-baseline pt-3 border-t border-slate-800/60 mt-auto">
                                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Rate</span>
                                        <div className="flex items-baseline gap-0.5">
                                            <span className="text-xl font-black text-white">₹{est.costPerSqFt.toLocaleString('en-IN')}</span>
                                            <span className="text-[10px] text-slate-500 font-semibold">/sqft</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Step 3: Detailed Inclusions */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 text-amber-500">
                            <FiList className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">3. Package Specifications</h3>
                            <p className="text-xs text-slate-400">Materials and scopes included in {activeEstimation.title}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeEstimation.inclusions.map((incl, idx) => (
                            <div key={idx} className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                                <div className="bg-amber-500/20 p-0.5 rounded-full text-amber-400 shrink-0 mt-0.5">
                                    <FiCheck className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-slate-350 text-sm">{incl}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Calculations Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                
                {/* Result Summary Box */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-850 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -z-10" />

                    <span className="text-amber-500/80 font-bold uppercase tracking-wider text-[10px]">
                        Estimated Budget Breakdown
                    </span>
                    <h2 className="text-lg font-extrabold text-white mt-1 mb-6">Estimate Summary</h2>

                    <div className="space-y-6">
                        {/* Area & Rate Display */}
                        <div className="flex justify-between items-center text-sm py-2 border-b border-slate-800">
                            <span className="text-slate-450 font-medium">Build Area</span>
                            <span className="text-slate-200 font-bold">{area.toLocaleString('en-IN')} Sq.Ft.</span>
                        </div>
                        <div className="flex justify-between items-center text-sm py-2 border-b border-slate-800">
                            <span className="text-slate-450 font-medium">Rate per Sq.Ft.</span>
                            <span className="text-slate-200 font-bold">₹{activeEstimation.costPerSqFt.toLocaleString('en-IN')} / sqft</span>
                        </div>

                        {/* Grand Total */}
                        <div className="pt-4 pb-2">
                            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Est. Cost</p>
                            <p className="text-3xl font-black text-amber-500 tracking-tight mt-1">
                                {formatINR(totalCost)}
                            </p>
                            <p className="text-xs text-slate-400 font-bold mt-1">
                                {formatINRWords(totalCost)} (Approx.)
                            </p>
                        </div>

                        {/* Interactive Dynamic cost details breakdown */}
                        <div className="space-y-4 pt-4 border-t border-slate-800">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                <FiPercent className="w-3.5 h-3.5 text-amber-500" /> System Distribution
                            </h4>
                            <div className="space-y-3.5">
                                {breakdowns.map((item, idx) => {
                                    const costItem = totalCost * (item.percentage / 100);
                                    return (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="text-slate-400">{item.name}</span>
                                                <span className="text-slate-200 font-bold">{formatINR(costItem)}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${item.color}`}
                                                    style={{ width: `${item.percentage}%` }}
                                                />
                                            </div>
                                            <p className="text-[9px] text-slate-500 leading-normal">{item.desc}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Book Consultation Button */}
                        <button
                            type="button"
                            onClick={() => setLeadOpen(true)}
                            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 px-5 rounded-xl text-sm transition-all duration-350 active:scale-98 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 mt-6 cursor-pointer"
                        >
                            <FiPhoneCall className="w-4 h-4" /> Book Consultation
                        </button>
                    </div>
                </div>

                {/* Important Disclaimer Notice */}
                <div className="bg-slate-900/30 border border-slate-850 rounded-xl p-4 flex gap-3 text-xs text-slate-450 leading-relaxed">
                    <FiInfo className="w-4 h-4 text-amber-500/80 shrink-0 mt-0.5" />
                    <p>
                        <strong>Note:</strong> Estimates are approximations based on standard construction scopes in India. Actual rates vary based on soil condition, structural design height, steel requirements, municipal clearances, and customization scopes.
                    </p>
                </div>
            </div>

            <LeadModal
                open={leadOpen}
                onClose={() => setLeadOpen(false)}
                title="Book a Free Consultation"
                subtitle="Share your details and our team will call you back."
                source="Book Consultation"
                submitLabel="Book Consultation"
            />
        </div>
    );
}
