"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, ArrowUpDown, Download, Search, Coins, TrendingUp, TrendingDown, Landmark, Receipt, Calendar, FileText, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { formatCurrency } from "@/utils/formatCurrency";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

// Category constants with HSL color maps
const CATEGORIES = [
    { value: "Software/Hosting", labelKey: "catSoftware", color: "#6366f1" },
    { value: "Marketing", labelKey: "catMarketing", color: "#ec4899" },
    { value: "Office & Supplies", labelKey: "catOffice", color: "#10b981" },
    { value: "Travel & Dining", labelKey: "catTravel", color: "#f59e0b" },
    { value: "Salaries & Freelancers", labelKey: "catSalaries", color: "#8b5cf6" },
    { value: "Taxes & Licenses", labelKey: "catTaxes", color: "#ef4444" },
    { value: "Other Expenses", labelKey: "catOther", color: "#6b7280" }
];

const METHODS = [
    { value: "Cash", labelKey: "cash" },
    { value: "Credit Card", labelKey: "creditCard" },
    { value: "Bank Transfer", labelKey: "bankTransfer" },
    { value: "PayPal", labelKey: "paypal" }
];

export default function ExpensesPage() {
    const { t } = useLanguage();

    const [expenses, setExpenses] = useState([]);
    const [history, setHistory] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Filter and Sort states
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");

    // Form Modal states
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        category: "Software/Hosting",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "Credit Card",
        tax: "0",
        notes: ""
    });

    // Load data
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedExpenses = JSON.parse(localStorage.getItem("billing_expenses") || "[]");
            const savedHistory = JSON.parse(localStorage.getItem("billing_history") || "[]");
            setExpenses(savedExpenses);
            setHistory(savedHistory);
            setIsLoaded(true);
        }
    }, []);

    // Save expenses
    const saveExpenses = (updatedExpenses) => {
        setExpenses(updatedExpenses);
        localStorage.setItem("billing_expenses", JSON.stringify(updatedExpenses));
    };

    // Form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.amount || parseFloat(formData.amount) <= 0) {
            toast.error("Please enter a valid title and amount.");
            return;
        }

        const expenseItem = {
            id: editingExpense ? editingExpense.id : Date.now(),
            title: formData.title,
            category: formData.category,
            amount: parseFloat(formData.amount),
            date: formData.date || new Date().toISOString().split("T")[0],
            paymentMethod: formData.paymentMethod,
            tax: parseFloat(formData.tax) || 0,
            notes: formData.notes
        };

        let updated;
        if (editingExpense) {
            updated = expenses.map(exp => exp.id === editingExpense.id ? expenseItem : exp);
            toast.success("Expense item updated successfully!");
        } else {
            updated = [expenseItem, ...expenses];
            toast.success("Expense item recorded successfully!");
        }

        saveExpenses(updated);
        setIsDialogOpen(false);
        setEditingExpense(null);
        setFormData({
            title: "",
            category: "Software/Hosting",
            amount: "",
            date: new Date().toISOString().split("T")[0],
            paymentMethod: "Credit Card",
            tax: "0",
            notes: ""
        });
    };

    // Trigger edit modal
    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setFormData({
            title: expense.title,
            category: expense.category,
            amount: expense.amount.toString(),
            date: expense.date,
            paymentMethod: expense.paymentMethod,
            tax: expense.tax.toString(),
            notes: expense.notes || ""
        });
        setIsDialogOpen(true);
    };

    // Delete expense
    const handleDelete = (id) => {
        if (confirm("Delete this expense record?")) {
            const updated = expenses.filter(exp => exp.id !== id);
            saveExpenses(updated);
            toast.success("Expense record removed!");
        }
    };

    // Export to CSV helper
    const handleExportCsv = () => {
        try {
            if (expenses.length === 0) {
                toast.error("No expenses to export.");
                return;
            }

            const headers = ["ID", "Title", "Category", "Amount", "Date", "Payment Method", "Tax Paid (%)", "Notes"];
            const csvRows = [headers.join(",")];

            expenses.forEach(exp => {
                const values = [
                    exp.id,
                    `"${exp.title.replace(/"/g, '""')}"`,
                    `"${exp.category}"`,
                    exp.amount,
                    exp.date,
                    exp.paymentMethod,
                    exp.tax,
                    `"${(exp.notes || "").replace(/"/g, '""')}"`
                ];
                csvRows.push(values.join(","));
            });

            const csvString = csvRows.join("\n");
            const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = `expenses-export-${new Date().toISOString().split("T")[0]}.csv`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            toast.success("Expenses list exported to CSV!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to export CSV.");
        }
    };

    // Calculations & Metrics
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalRevenue = history.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const netProfit = totalRevenue - totalExpenses;
    const totalTaxPaid = expenses.reduce((sum, exp) => sum + (exp.amount * (exp.tax / 100)), 0);

    // Chart Data Preparation (Category Pie Chart)
    const categoryData = CATEGORIES.map(cat => {
        const value = expenses
            .filter(exp => exp.category === cat.value)
            .reduce((sum, exp) => sum + exp.amount, 0);
        return { name: t(cat.labelKey), value, color: cat.color };
    }).filter(data => data.value > 0);

    // Chart Data Preparation (Monthly Revenue vs Expenses)
    const getMonthlyChartData = () => {
        const monthlyMap = {};

        // Process revenue history
        history.forEach(item => {
            if (!item.date) return;
            const month = item.date.substring(0, 7); // YYYY-MM
            if (!monthlyMap[month]) monthlyMap[month] = { month, Revenue: 0, Expenses: 0 };
            monthlyMap[month].Revenue += (item.total || 0);
        });

        // Process expenses
        expenses.forEach(item => {
            if (!item.date) return;
            const month = item.date.substring(0, 7); // YYYY-MM
            if (!monthlyMap[month]) monthlyMap[month] = { month, Revenue: 0, Expenses: 0 };
            monthlyMap[month].Expenses += item.amount;
        });

        // Convert map to sorted list and format month labels (e.g. "2026-05" -> "May 26")
        return Object.values(monthlyMap)
            .sort((a, b) => a.month.localeCompare(b.month))
            .slice(-6) // Show last 6 active months
            .map(data => {
                const parts = data.month.split("-");
                const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
                const label = dateObj.toLocaleString("en-US", { month: "short", year: "2-digit" });
                return {
                    name: label,
                    Revenue: parseFloat(data.Revenue.toFixed(2)),
                    Expenses: parseFloat(data.Expenses.toFixed(2)),
                    Profit: parseFloat((data.Revenue - data.Expenses).toFixed(2))
                };
            });
    };

    const monthlyChartData = getMonthlyChartData();

    // Filtering & Sorting
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }
    };

    const filteredExpenses = expenses
        .filter(exp => {
            const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  exp.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  (exp.notes && exp.notes.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesCategory = categoryFilter === "All" || exp.category === categoryFilter;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            let valA = a[sortBy];
            let valB = b[sortBy];

            if (sortBy === "amount") {
                return sortOrder === "asc" ? valA - valB : valB - valA;
            } else {
                // String dates / strings comparison
                return sortOrder === "asc" 
                    ? String(valA).localeCompare(String(valB)) 
                    : String(valB).localeCompare(String(valA));
            }
        });

    return (
        <div className="container px-4 md:px-8 max-w-7xl mx-auto mt-6 md:mt-10 mb-20">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">{t("expensesDashboard")}</h1>
                    <p className="text-muted-foreground text-sm md:text-base max-w-xl">{t("expensesDesc")}</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleExportCsv} variant="outline" className="gap-2 font-bold h-11 border-primary/20 hover:bg-primary/5">
                        <Download className="h-4 w-4" /> {t("exportCsv")}
                    </Button>
                    
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) {
                            setEditingExpense(null);
                            setFormData({
                                title: "",
                                category: "Software/Hosting",
                                amount: "",
                                date: new Date().toISOString().split("T")[0],
                                paymentMethod: "Credit Card",
                                tax: "0",
                                notes: ""
                            });
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="font-bold shadow-lg shadow-primary/20 gap-2 h-11 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-600/95">
                                <Plus className="h-5 w-5" /> {t("addExpense")}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md rounded-3xl p-6">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black">{editingExpense ? t("editExpense") : t("addExpense")}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Expense Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Office Rent, Hosting Fee"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full p-3.5 bg-muted/40 border rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all font-semibold"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Amount</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={formData.amount}
                                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                            className="w-full p-3.5 bg-muted/40 border rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all font-bold text-lg"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Tax (%)</label>
                                        <input
                                            type="number"
                                            value={formData.tax}
                                            onChange={e => setFormData({ ...formData, tax: e.target.value })}
                                            className="w-full p-3.5 bg-muted/40 border rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all font-semibold"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full p-3.5 bg-muted/40 border rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none transition-all text-sm font-semibold"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Payment Method</label>
                                        <select
                                            value={formData.paymentMethod}
                                            onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                                            className="w-full p-3.5 bg-muted/40 border rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                                        >
                                            {METHODS.map(m => (
                                                <option key={m.value} value={m.value}>{t(m.labelKey)}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full p-3.5 bg-muted/40 border rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                                    >
                                        {CATEGORIES.map(c => (
                                            <option key={c.value} value={c.value}>{t(c.labelKey)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Notes</label>
                                    <textarea
                                        placeholder="Add context or invoice references..."
                                        value={formData.notes}
                                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full p-3.5 bg-muted/40 border rounded-2xl min-h-[80px] focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"
                                    ></textarea>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold">{t("cancel")}</Button>
                                    <Button type="submit" className="font-bold bg-primary text-primary-foreground rounded-xl">{t("save")}</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {/* Revenue Card */}
                <div className="bg-card border rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t("totalRevenue")}</span>
                        <h2 className="text-2xl font-black text-foreground">{formatCurrency(totalRevenue, "USD")}</h2>
                    </div>
                    <div className="p-3.5 bg-emerald-500/10 rounded-2xl text-emerald-600">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                </div>

                {/* Expenses Card */}
                <div className="bg-card border rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t("totalExpenses")}</span>
                        <h2 className="text-2xl font-black text-foreground">{formatCurrency(totalExpenses, "USD")}</h2>
                    </div>
                    <div className="p-3.5 bg-rose-500/10 rounded-2xl text-rose-600">
                        <TrendingDown className="h-6 w-6" />
                    </div>
                </div>

                {/* Profit Card */}
                <div className={`bg-card border rounded-[2rem] p-6 shadow-sm flex items-center justify-between ${netProfit >= 0 ? "border-emerald-500/20 bg-emerald-50/5" : "border-rose-500/20 bg-rose-50/5"}`}>
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t("netProfit")}</span>
                        <h2 className={`text-2xl font-black ${netProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{formatCurrency(netProfit, "USD")}</h2>
                    </div>
                    <div className={`p-3.5 rounded-2xl ${netProfit >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
                        <Coins className="h-6 w-6" />
                    </div>
                </div>

                {/* Tax paid Card */}
                <div className="bg-card border rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t("taxPaid")}</span>
                        <h2 className="text-2xl font-black text-foreground">{formatCurrency(totalTaxPaid, "USD")}</h2>
                    </div>
                    <div className="p-3.5 bg-indigo-500/10 rounded-2xl text-indigo-600">
                        <Landmark className="h-6 w-6" />
                    </div>
                </div>
            </div>

            {/* Visual Analytics */}
            {expenses.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
                    {/* Category Breakdown Pie Chart */}
                    <div className="bg-card border rounded-[2.5rem] p-6 lg:col-span-2 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4">{t("categoryBreakdown")}</h3>
                            <div className="h-[260px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            innerRadius={65}
                                            outerRadius={90}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => formatCurrency(value, "USD")} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Expenses</span>
                                    <span className="text-xl font-black text-primary">{formatCurrency(totalExpenses, "USD")}</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 mt-4 max-h-[140px] overflow-y-auto pr-2 scrollbar-thin">
                            {categoryData.map((cat, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                        <span className="font-semibold text-muted-foreground truncate max-w-[150px]">{cat.name}</span>
                                    </div>
                                    <span className="font-bold">{formatCurrency(cat.value, "USD")} ({((cat.value / totalExpenses) * 100).toFixed(0)}%)</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Revenue vs Expenses Bar Chart */}
                    <div className="bg-card border rounded-[2.5rem] p-6 lg:col-span-3 shadow-sm flex flex-col justify-between">
                        <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-6">{t("revenueVsExpenses")}</h3>
                        <div className="h-[380px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                    <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                                    <Tooltip formatter={(value) => formatCurrency(value, "USD")} />
                                    <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
                                    <Bar dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} name={t("totalRevenue")} />
                                    <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name={t("totalExpenses")} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Expenses Table */}
            <div className="bg-card border rounded-[2.5rem] p-6 shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="relative flex-1 w-full max-w-sm">
                        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <input
                            type="text"
                            placeholder={t("search")}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-muted/40 border rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-primary focus:outline-none outline-none"
                        />
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <select
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                            className="flex-1 sm:flex-initial p-2.5 bg-muted/40 border rounded-2xl text-xs font-semibold focus:outline-none"
                        >
                            <option value="All">All Categories</option>
                            {CATEGORIES.map(c => (
                                <option key={c.value} value={c.value}>{t(c.labelKey)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-muted/30 border-b">
                                <th onClick={() => handleSort("title")} className="p-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider cursor-pointer hover:bg-muted/40 select-none">
                                    <span className="flex items-center gap-1.5">{t("expenseTitle")} <ArrowUpDown className="h-3 w-3" /></span>
                                </th>
                                <th onClick={() => handleSort("category")} className="p-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider cursor-pointer hover:bg-muted/40 select-none">
                                    <span className="flex items-center gap-1.5">{t("category")} <ArrowUpDown className="h-3 w-3" /></span>
                                </th>
                                <th onClick={() => handleSort("date")} className="p-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider cursor-pointer hover:bg-muted/40 select-none">
                                    <span className="flex items-center gap-1.5">{t("expenseDate")} <ArrowUpDown className="h-3 w-3" /></span>
                                </th>
                                <th onClick={() => handleSort("paymentMethod")} className="p-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider cursor-pointer hover:bg-muted/40 select-none">
                                    <span className="flex items-center gap-1.5">{t("paymentMethod")} <ArrowUpDown className="h-3 w-3" /></span>
                                </th>
                                <th onClick={() => handleSort("amount")} className="p-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider cursor-pointer hover:bg-muted/40 select-none text-right">
                                    <span className="flex items-center gap-1.5 justify-end">{t("amount")} <ArrowUpDown className="h-3 w-3" /></span>
                                </th>
                                <th className="p-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider text-right">{t("actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.length > 0 ? (
                                filteredExpenses.map(exp => {
                                    const catObj = CATEGORIES.find(c => c.value === exp.category) || CATEGORIES[CATEGORIES.length - 1];
                                    return (
                                        <tr key={exp.id} className="border-b hover:bg-muted/10 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold">{exp.title}</div>
                                                {exp.notes && <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{exp.notes}</div>}
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ backgroundColor: catObj.color + "15", color: catObj.color }}>
                                                    {t(catObj.labelKey)}
                                                </span>
                                            </td>
                                            <td className="p-4 text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mt-2.5">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {exp.date}
                                            </td>
                                            <td className="p-4 text-xs font-semibold">
                                                {t(METHODS.find(m => m.value === exp.paymentMethod)?.labelKey || "cash")}
                                            </td>
                                            <td className="p-4 font-black text-right text-base text-foreground">
                                                {formatCurrency(exp.amount, "USD")}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <Button onClick={() => handleEdit(exp)} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                        <Landmark className="h-4 w-4" />
                                                    </Button>
                                                    <Button onClick={() => handleDelete(exp.id)} variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-muted-foreground">
                                        <Coins className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                                        No expense records found matching criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
