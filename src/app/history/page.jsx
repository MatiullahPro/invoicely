"use client";

import React, { useState, useEffect } from "react";
import { History, Search, Trash2, FileText, Calendar, DollarSign, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatCurrency";
import { useRouter } from "next/navigation";

import Pagination from "@/components/Pagination";

export default function HistoryPage() {
    const router = useRouter();
    const [history, setHistory] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const saved = localStorage.getItem("billing_history");
        if (saved) setHistory(JSON.parse(saved).reverse()); // Newest first
    }, []);

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const deleteRecord = (id) => {
        if (confirm("Delete this record from history?")) {
            const updated = history.filter(h => h.id !== id);
            setHistory(updated);
            localStorage.setItem("billing_history", JSON.stringify(updated.reverse()));
        }
    };

    const loadRecord = (record) => {
        if (record.type === 'invoice') {
            localStorage.setItem("formData", JSON.stringify(record.data));
            router.push("/");
        } else {
            localStorage.setItem("receiptFormData", JSON.stringify(record.data));
            router.push("/receipt");
        }
    };

    const filteredHistory = history.filter(h =>
        h.number.toLowerCase().includes(search.toLowerCase()) ||
        h.clientName.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedHistory = filteredHistory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="container px-4 md:px-8 max-w-7xl mx-auto mt-6 md:mt-10 mb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Billing History</h1>
                    <p className="text-muted-foreground text-sm">View and manage your previous invoices and receipts</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search records..."
                        className="w-full pl-10 pr-4 py-2 border rounded-xl bg-background"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                {filteredHistory.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-[2.5rem] bg-muted/20">
                        <History className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-10" />
                        <p className="text-xl font-medium text-muted-foreground">No history found</p>
                        <Button className="mt-6" onClick={() => router.push("/")}>Create Your First Invoice</Button>
                    </div>
                ) : (
                    paginatedHistory.map(record => (
                        <div
                            key={record.id}
                            onClick={() => loadRecord(record)}
                            className="group p-4 sm:p-6 border rounded-[1.5rem] bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer"
                        >
                            <div className="flex gap-4 items-center">
                                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <FileText className="h-6 w-6 sm:h-7 sm:w-7" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-base sm:text-lg tracking-tight">#{record.number}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${record.type === 'invoice' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                            {record.type}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-sm sm:text-base text-muted-foreground group-hover:text-foreground transition-colors">{record.clientName || "Unnamed Client"}</h3>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-12 w-full md:w-auto">
                                <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-xs sm:text-sm font-medium">{record.date}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-muted-foreground block uppercase font-black">Total</span>
                                    <span className="font-black text-lg sm:text-xl text-primary">{formatCurrency(record.total, record.currency)}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0" onClick={(e) => e.stopPropagation()}>
                                <Button variant="secondary" className="flex-1 md:flex-none rounded-xl h-10 border shadow-sm" onClick={() => loadRecord(record)}>
                                    <Eye className="h-4 w-4 mr-2" /> View/Edit
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 rounded-xl h-10 w-10 border md:border-transparent" onClick={() => deleteRecord(record.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Pagination
                totalItems={filteredHistory.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}
