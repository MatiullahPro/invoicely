"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, TrendingDown, ArrowUpRight, Calendar, DollarSign, Wallet, IndianRupee } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

import Pagination from "@/components/Pagination";
import { Search } from "lucide-react";

export default function LedgerPage() {
    const [history, setHistory] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const saved = localStorage.getItem("billing_history");
        if (saved) setHistory(JSON.parse(saved).reverse());
    }, []);

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const calculatePerformance = (period) => {
        const now = new Date();
        let startDate;

        if (period === 'weekly') {
            startDate = new Date(now.setDate(now.getDate() - 7));
        } else if (period === 'monthly') {
            startDate = new Date(now.setMonth(now.getMonth() - 1));
        } else {
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        }

        const filtered = history.filter(item => new Date(item.date) >= startDate);
        const totalInvoice = filtered.filter(i => i.type === 'invoice').reduce((sum, item) => sum + item.total, 0);
        const totalReceipt = filtered.filter(i => i.type === 'receipt').reduce((sum, item) => sum + item.total, 0);

        return { total: totalInvoice + totalReceipt, count: filtered.length, invoice: totalInvoice, receipt: totalReceipt };
    };

    const stats = {
        weekly: calculatePerformance('weekly'),
        monthly: calculatePerformance('monthly'),
        yearly: calculatePerformance('yearly')
    };

    const filteredTransactions = history.filter(h =>
        h.clientName?.toLowerCase().includes(search.toLowerCase()) ||
        h.number?.toLowerCase().includes(search.toLowerCase()) ||
        h.type?.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="container px-4 md:px-8 max-w-7xl mx-auto mt-6 md:mt-10 mb-20">
            <div className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Performance Ledger</h1>
                <p className="text-muted-foreground text-sm md:text-lg max-w-2xl">Detailed overview of your business revenue and transaction volume.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
                {/* Weekly Card */}
                <div className="bg-card border rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <Calendar className="h-6 w-6 sm:h-7 sm:w-7" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Last 7 Days</span>
                    </div>
                    <div className="space-y-1">
                        <span className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Revenue</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-primary">₹ {stats.weekly.total.toLocaleString()}</h2>
                    </div>
                    <div className="mt-6 pt-6 border-t flex justify-between items-center text-xs sm:text-sm font-bold">
                        <span className="text-muted-foreground">{stats.weekly.count} Transactions</span>
                        <div className="flex items-center text-green-500"><TrendingUp className="h-4 w-4 mr-1" /> Active</div>
                    </div>
                </div>

                {/* Monthly Card */}
                <div className="bg-card border rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                            <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Last 30 Days</span>
                    </div>
                    <div className="space-y-1">
                        <span className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Revenue</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-primary">₹ {stats.monthly.total.toLocaleString()}</h2>
                    </div>
                    <div className="mt-6 pt-6 border-t flex justify-between items-center text-xs sm:text-sm font-bold">
                        <span className="text-muted-foreground">{stats.monthly.count} Transactions</span>
                        <div className="flex items-center text-green-500"><TrendingUp className="h-4 w-4 mr-1" /> Healthy</div>
                    </div>
                </div>

                {/* Yearly Card */}
                <div className="bg-card border rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                            <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-orange-600 bg-orange-50 px-3 py-1 rounded-full">Yearly View</span>
                    </div>
                    <div className="space-y-1">
                        <span className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Revenue</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-primary">₹ {stats.yearly.total.toLocaleString()}</h2>
                    </div>
                    <div className="mt-6 pt-6 border-t flex justify-between items-center text-xs sm:text-sm font-bold">
                        <span className="text-muted-foreground">{stats.yearly.count} Transactions</span>
                        <div className="flex items-center text-green-500"><TrendingUp className="h-4 w-4 mr-1" /> Growth</div>
                    </div>
                </div>
            </div>

            {/* Excel-like Transaction Sheet */}
            <div className="mb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h3 className="text-2xl font-black flex items-center gap-3">
                        Transaction Sheet
                    </h3>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search ledger..."
                            className="w-full pl-10 pr-4 py-2 border rounded-xl bg-background text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left font-bold text-muted-foreground uppercase text-xs min-w-[100px]">Date</th>
                                    <th className="px-4 py-3 text-left font-bold text-muted-foreground uppercase text-xs min-w-[120px]">Ref Number</th>
                                    <th className="px-4 py-3 text-left font-bold text-muted-foreground uppercase text-xs min-w-[150px]">Client / Source</th>
                                    <th className="px-4 py-3 text-center font-bold text-muted-foreground uppercase text-xs w-[80px]">Type</th>
                                    <th className="hidden sm:table-cell px-4 py-3 text-center font-bold text-muted-foreground uppercase text-xs w-[80px]">Cur</th>
                                    <th className="px-4 py-3 text-right font-bold text-muted-foreground uppercase text-xs min-w-[120px]">Amount</th>
                                    <th className="hidden sm:table-cell px-4 py-3 text-center font-bold text-muted-foreground uppercase text-xs w-[100px]">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-xs sm:text-sm">
                                {paginatedTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-8 text-center text-muted-foreground">No transactions found</td>
                                    </tr>
                                ) : (
                                    paginatedTransactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3 font-medium font-mono text-muted-foreground whitespace-nowrap">{tx.date}</td>
                                            <td className="px-4 py-3 font-bold truncate max-w-[120px]">{tx.number}</td>
                                            <td className="px-4 py-3 text-foreground/90 truncate max-w-[150px]">{tx.clientName || "Unknown"}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${tx.type === 'invoice' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="hidden sm:table-cell px-4 py-3 text-center font-mono text-xs">{tx.currency}</td>
                                            <td className="px-4 py-3 text-right font-bold text-foreground whitespace-nowrap">
                                                {formatCurrency(tx.total, tx.currency)}
                                            </td>
                                            <td className="hidden sm:table-cell px-4 py-3 text-center">
                                                <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                                                    PAID
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {filteredTransactions.length > 0 && (
                        <div className="p-4 border-t bg-muted/10">
                            <Pagination
                                totalItems={filteredTransactions.length}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card border rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10">
                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                        <Wallet className="h-6 w-6 text-primary" /> Breakdown
                    </h3>
                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 bg-muted/20 rounded-2xl border border-dashed gap-4 sm:gap-2">
                            <div>
                                <span className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Total Invoices</span>
                                <span className="text-xl sm:text-2xl font-black">₹ {stats.yearly.invoice.toLocaleString()}</span>
                            </div>
                            <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg text-xs">Standard Billing</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 bg-muted/20 rounded-2xl border border-dashed gap-4 sm:gap-2">
                            <div>
                                <span className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Total Receipts</span>
                                <span className="text-xl sm:text-2xl font-black">₹ {stats.yearly.receipt.toLocaleString()}</span>
                            </div>
                            <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-lg text-xs">Direct Sales</span>
                        </div>
                    </div>
                </div>

                <div className="bg-primary p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] text-primary-foreground relative overflow-hidden flex flex-col justify-center min-h-[300px]">
                    <div className="relative z-10">
                        <h3 className="text-2xl sm:text-3xl font-black mb-4">Business Insight</h3>
                        <p className="text-primary-foreground/80 font-medium text-base sm:text-lg leading-relaxed">
                            Your performance is currently trending upwards. Based on the last 30 days, your transaction volume is steady.
                            Consider optimizing your {stats.yearly.invoice > stats.yearly.receipt ? 'invoice follow-ups' : 'direct sale conversion'} for better cash flow.
                        </p>
                        <div className="mt-8 flex gap-4">
                            <div className="px-4 py-2 sm:px-6 sm:py-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 font-bold text-sm sm:text-base">
                                Avg Ticket: ₹ {(stats.yearly.count > 0 ? stats.yearly.total / stats.yearly.count : 0).toLocaleString()}
                            </div>
                        </div>
                    </div>
                    <ArrowUpRight className="absolute bottom-[-20%] right-[-10%] h-48 w-48 sm:h-64 sm:w-64 text-white/5" />
                </div>
            </div>
        </div>
    );
}
