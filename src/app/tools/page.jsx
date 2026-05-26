"use client";

import React, { useState, Suspense, useEffect } from "react";
import { Calculator, Percent, Scaling, ArrowLeftRight, Database, Tag, RefreshCcw, Landmark, TrendingUp, BarChart3, Coins, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

function ToolsContent() {
    const searchParams = useSearchParams();

    // GST Calculator State
    const [amount, setAmount] = useState(0);
    const [gstRate, setGstRate] = useState(18);
    const [isGstInclusive, setIsGstInclusive] = useState(false);

    useEffect(() => {
        const queryAmount = searchParams.get('amount');
        if (queryAmount) setAmount(parseFloat(queryAmount));
    }, [searchParams]);

    const calculateGst = () => {
        let gstAmount, total;
        const amt = parseFloat(amount) || 0;
        if (isGstInclusive) {
            gstAmount = amt - (amt * (100 / (100 + gstRate)));
            total = amt;
        } else {
            gstAmount = (amt * gstRate) / 100;
            total = amt + gstAmount;
        }
        return { gstAmount, total, base: amt - (isGstInclusive ? gstAmount : 0) };
    };

    const gstResults = calculateGst();

    // Margin Calculator State
    const [cost, setCost] = useState(0);
    const [sellingPrice, setSellingPrice] = useState(0);

    const margin = sellingPrice > 0 ? ((sellingPrice - cost) / sellingPrice) * 100 : 0;
    const profit = sellingPrice - cost;

    // Discount Calculator
    const [originalPrice, setOriginalPrice] = useState(0);
    const [discountPercent, setDiscountPercent] = useState(0);
    const savedAmount = (originalPrice * discountPercent) / 100;
    const finalPrice = originalPrice - savedAmount;

    // Unit Rate Calculator
    const [uPrice, setUPrice] = useState(0);
    const [uQty, setUQty] = useState(0);
    const unitRate = uQty > 0 ? uPrice / uQty : 0;

    // Late Fee Calculator
    const [lDays, setLDays] = useState(30);
    const [lRate, setLRate] = useState(12);
    const lFee = ((parseFloat(amount) || 1000) * (lRate / 100) * (lDays / 365));

    // Break-even
    const [fixedCosts, setFixedCosts] = useState(0);
    const [variableCost, setVariableCost] = useState(0);
    const [pricePerUnit, setPricePerUnit] = useState(0);
    const breakEvenUnits = (pricePerUnit - variableCost) > 0 ? fixedCosts / (pricePerUnit - variableCost) : 0;

    // ROI
    const [investmentAmount, setInvestmentAmount] = useState(0);
    const [returnAmount, setReturnAmount] = useState(0);
    const roi = investmentAmount > 0 ? ((returnAmount - investmentAmount) / investmentAmount) * 100 : 0;

    return (
        <div className="container px-4 md:px-8 max-w-7xl mx-auto mt-6 md:mt-10 mb-20">
            <div className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Business Toolkit</h1>
                <p className="text-muted-foreground text-sm md:text-lg max-w-2xl">Essential calculators to help you manage your business pricing, taxes, and performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Backup & Restore */}
                <div className="bg-card border rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-600">
                                <Database className="h-6 w-6" />
                            </div>
                            <h2 className="text-xl font-bold">Data Backups</h2>
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed mb-6">
                            Securely export all local databases to a local file or import existing backups to restore/sync your invoices, expenses, clients, and inventory records.
                        </p>
                    </div>
                    <Link href="/tools/backup" className="w-full">
                        <Button className="w-full font-bold py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all">
                            Open Backup Tool
                        </Button>
                    </Link>
                </div>

                {/* Custom Template Builder */}
                <div className="bg-card border rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-600">
                                <Scaling className="h-6 w-6" />
                            </div>
                            <h2 className="text-xl font-bold">Template Builder</h2>
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed mb-6">
                            Create fully personalized, beautiful invoice layouts using brand colors, responsive formats, custom fonts, and save them for instant PDF generation.
                        </p>
                    </div>
                    <Link href="/tools/template-builder" className="w-full">
                        <Button className="w-full font-bold py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all">
                            Open Builder
                        </Button>
                    </Link>
                </div>

                {/* GST / TAX Calculator */}
                <div className="bg-card border rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <Percent className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-bold">Tax Calculator</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-muted-foreground uppercase ml-1">Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full mt-1 p-4 bg-muted/50 border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-xl"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-sm font-bold text-muted-foreground uppercase ml-1">Rate (%)</label>
                                <select
                                    value={gstRate}
                                    onChange={(e) => setGstRate(parseFloat(e.target.value))}
                                    className="w-full mt-1 p-4 bg-muted/50 border rounded-2xl focus:ring-2 focus:ring-primary outline-none"
                                >
                                    {[5, 12, 18, 28].map(rate => (
                                        <option key={rate} value={rate}>{rate}%</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="text-sm font-bold text-muted-foreground uppercase ml-1">Type</label>
                                <div className="flex bg-muted/50 p-1 rounded-2xl mt-1 border">
                                    <button
                                        onClick={() => setIsGstInclusive(false)}
                                        className={`flex-1 py-3 text-[10px] font-bold rounded-xl transition-all ${!isGstInclusive ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:bg-muted'}`}
                                    >EXCL</button>
                                    <button
                                        onClick={() => setIsGstInclusive(true)}
                                        className={`flex-1 py-3 text-[10px] font-bold rounded-xl transition-all ${isGstInclusive ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:bg-muted'}`}
                                    >INCL</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-4 rounded-2xl border">
                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block mb-1">Tax</span>
                            <span className="text-lg font-black text-primary">₹ {gstResults.gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20">
                            <span className="text-[10px] font-black uppercase text-primary tracking-widest block mb-1">Total</span>
                            <span className="text-lg font-black text-primary">₹ {gstResults.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>

                {/* Profit Margin Calculator */}
                <div className="bg-card border rounded-[2rem] p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-green-500/10 rounded-2xl text-green-600">
                            <Calculator className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-bold">Margin / Profit</h2>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="text-sm font-bold text-muted-foreground uppercase ml-1">Cost Price</label>
                            <input
                                type="number"
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                                className="w-full mt-1 p-4 bg-muted/50 border rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-muted-foreground uppercase ml-1">Selling Price</label>
                            <input
                                type="number"
                                value={sellingPrice}
                                onChange={(e) => setSellingPrice(e.target.value)}
                                className="w-full mt-1 p-4 bg-muted/50 border rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold"
                            />
                        </div>
                    </div>

                    <div className={`p-6 rounded-2xl border transition-all ${profit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block mb-1">Profit</span>
                                <span className={`text-2xl font-black ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹ {profit.toLocaleString()}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block mb-1">Margin</span>
                                <span className={`text-lg font-black ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{margin.toFixed(2)}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Discount Calculator */}
                <div className="bg-card border rounded-[2rem] p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-600">
                            <Tag className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-bold">Discount Tool</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="text-sm font-bold text-muted-foreground uppercase ml-1">Original Price</label>
                            <input
                                type="number"
                                value={originalPrice}
                                onChange={(e) => setOriginalPrice(e.target.value)}
                                className="w-full mt-1 p-4 bg-muted/50 border rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-muted-foreground uppercase ml-1">Discount %</label>
                            <input
                                type="number"
                                value={discountPercent}
                                onChange={(e) => setDiscountPercent(e.target.value)}
                                className="w-full mt-1 p-4 bg-muted/50 border rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-orange-50 rounded-2xl border border-orange-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-[10px] font-black uppercase text-orange-800 tracking-widest block mb-1">Final Price</span>
                                <span className="text-2xl font-black text-orange-600">₹ {finalPrice.toLocaleString()}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black uppercase text-orange-800 tracking-widest block mb-1">Save</span>
                                <span className="text-lg font-bold text-orange-600">₹ {savedAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Unit Price Calculator */}
                <div className="bg-card border rounded-[2rem] p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-600">
                            <RefreshCcw className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-bold">Unit Price</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="text-sm font-bold text-muted-foreground uppercase ml-1">Total Price</label>
                            <input
                                type="number"
                                value={uPrice}
                                onChange={(e) => setUPrice(e.target.value)}
                                className="w-full mt-1 p-4 bg-muted/50 border rounded-2xl outline-none font-bold"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-muted-foreground uppercase ml-1">Quantity</label>
                            <input
                                type="number"
                                value={uQty}
                                onChange={(e) => setUQty(e.target.value)}
                                className="w-full mt-1 p-4 bg-muted/50 border rounded-2xl outline-none font-bold"
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-purple-50 rounded-2xl border border-purple-200">
                        <span className="text-[10px] font-black uppercase text-purple-800 tracking-widest block mb-1">Rate per Unit</span>
                        <span className="text-2xl font-black text-purple-600">₹ {unitRate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                {/* Late Fee Calculator */}
                <div className="bg-card border rounded-[2rem] p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-red-500/10 rounded-2xl text-red-600">
                            <ArrowLeftRight className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-bold">Late Fee Calc</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="text-sm font-bold text-muted-foreground uppercase ml-1">Days Overdue</label>
                            <input
                                type="number"
                                value={lDays}
                                onChange={(e) => setLDays(e.target.value)}
                                className="w-full mt-1 p-4 bg-muted/50 border rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-muted-foreground uppercase ml-1">Annual Rate (%)</label>
                            <input
                                type="number"
                                value={lRate}
                                onChange={(e) => setLRate(e.target.value)}
                                className="w-full mt-1 p-4 bg-muted/50 border rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-red-50 rounded-2xl border border-red-200">
                        <div className="flex justify-between items-center text-red-800 font-bold">
                            <div>
                                <span className="text-[10px] uppercase font-black block">Interest Fee</span>
                                <span className="text-2xl text-red-600">₹ {lFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] uppercase font-black block">Total with Interest</span>
                                <span className="text-lg text-red-600">₹ {((parseFloat(amount) || 0) + lFee).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ROI Calculator */}
                <div className="bg-card border rounded-[2rem] p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-bold">ROI Calculator</h2>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="text-sm font-bold text-muted-foreground uppercase ml-1">Investment</label>
                            <input
                                type="number"
                                value={investmentAmount}
                                onChange={(e) => setInvestmentAmount(e.target.value)}
                                className="w-full mt-1 p-4 bg-muted/50 border rounded-2xl outline-none font-bold"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-muted-foreground uppercase ml-1">Final Return</label>
                            <input
                                type="number"
                                value={returnAmount}
                                onChange={(e) => setReturnAmount(e.target.value)}
                                className="w-full mt-1 p-4 bg-muted/50 border rounded-2xl outline-none font-bold"
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200 flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-blue-800 tracking-widest">Net ROI</span>
                        <span className={`text-2xl font-black ${roi >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{roi.toFixed(2)}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ToolsPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center">Loading tools...</div>}>
            <ToolsContent />
        </Suspense>
    );
}
