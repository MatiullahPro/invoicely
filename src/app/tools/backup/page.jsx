"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Database, Download, Upload, AlertTriangle, ShieldCheck, ChevronRight, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

export default function BackupPage() {
    const router = useRouter();
    const { t } = useLanguage();

    // Statistics state
    const [stats, setStats] = useState({
        invoices: 0,
        clients: 0,
        inventory: 0,
        expenses: 0,
        customTemplates: 0,
    });

    const [importedData, setImportedData] = useState(null);
    const [isDragActive, setIsDragActive] = useState(false);

    // Load statistics
    const loadStats = () => {
        if (typeof window !== "undefined") {
            const invoices = JSON.parse(localStorage.getItem("billing_history") || "[]");
            const clients = JSON.parse(localStorage.getItem("billing_clients") || "[]");
            const inventory = JSON.parse(localStorage.getItem("billing_inventory") || "[]");
            const expenses = JSON.parse(localStorage.getItem("billing_expenses") || "[]");
            const customTemplates = JSON.parse(localStorage.getItem("custom_templates") || "[]");

            setStats({
                invoices: invoices.length,
                clients: clients.length,
                inventory: inventory.length,
                expenses: expenses.length,
                customTemplates: customTemplates.length,
            });
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    // Export databases
    const handleExport = () => {
        try {
            const backup = {
                version: "1.0.0",
                timestamp: new Date().toISOString(),
                billing_history: JSON.parse(localStorage.getItem("billing_history") || "[]"),
                billing_clients: JSON.parse(localStorage.getItem("billing_clients") || "[]"),
                billing_inventory: JSON.parse(localStorage.getItem("billing_inventory") || "[]"),
                billing_expenses: JSON.parse(localStorage.getItem("billing_expenses") || "[]"),
                custom_templates: JSON.parse(localStorage.getItem("custom_templates") || "[]"),
                formData: JSON.parse(localStorage.getItem("formData") || "null"),
                receiptFormData: JSON.parse(localStorage.getItem("receiptFormData") || "null"),
                selectedTemplate: localStorage.getItem("selectedTemplate") || "1",
            };

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
            const downloadAnchor = document.createElement("a");
            const dateStr = new Date().toISOString().split("T")[0];
            
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `invoicely-backup-${dateStr}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            toast.success("Backup JSON exported successfully!");
        } catch (e) {
            console.error(e);
            toast.error("Export failed. Please try again.");
        }
    };

    // File selection parsing
    const parseBackupFile = (file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                
                // Basic validation
                if (!parsed.billing_history && !parsed.billing_clients && !parsed.billing_inventory) {
                    toast.error(t("restoreFailed"));
                    return;
                }

                setImportedData(parsed);
                toast.success("Backup file parsed successfully! Review the contents below.");
            } catch (e) {
                console.error(e);
                toast.error(t("restoreFailed"));
            }
        };
        reader.readAsText(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        parseBackupFile(file);
    };

    // Drag-and-drop support
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            parseBackupFile(e.dataTransfer.files[0]);
        }
    };

    // Overwrite mode
    const handleOverwrite = () => {
        if (!importedData) return;

        if (confirm("Are you absolutely sure you want to OVERWRITE all current data? This cannot be undone.")) {
            try {
                if (importedData.billing_history) localStorage.setItem("billing_history", JSON.stringify(importedData.billing_history));
                if (importedData.billing_clients) localStorage.setItem("billing_clients", JSON.stringify(importedData.billing_clients));
                if (importedData.billing_inventory) localStorage.setItem("billing_inventory", JSON.stringify(importedData.billing_inventory));
                if (importedData.billing_expenses) localStorage.setItem("billing_expenses", JSON.stringify(importedData.billing_expenses));
                if (importedData.custom_templates) localStorage.setItem("custom_templates", JSON.stringify(importedData.custom_templates));
                if (importedData.formData) localStorage.setItem("formData", JSON.stringify(importedData.formData));
                if (importedData.receiptFormData) localStorage.setItem("receiptFormData", JSON.stringify(importedData.receiptFormData));
                if (importedData.selectedTemplate) localStorage.setItem("selectedTemplate", importedData.selectedTemplate);

                toast.success(t("restoreSuccess"));
                setImportedData(null);
                loadStats();
            } catch (e) {
                console.error(e);
                toast.error("Failed to overwrite data.");
            }
        }
    };

    // Merge mode (combining lists)
    const handleMerge = () => {
        if (!importedData) return;

        try {
            const mergeLists = (existingKey, importedList) => {
                if (!importedList || !Array.isArray(importedList)) return;
                const existingList = JSON.parse(localStorage.getItem(existingKey) || "[]");
                
                // Index existing items by ID
                const existingMap = new Map(existingList.map(item => [item.id, item]));
                
                // Add or update items
                importedList.forEach(item => {
                    existingMap.set(item.id || Date.now() + Math.random(), item);
                });

                localStorage.setItem(existingKey, JSON.stringify(Array.from(existingMap.values())));
            };

            mergeLists("billing_history", importedData.billing_history);
            mergeLists("billing_clients", importedData.billing_clients);
            mergeLists("billing_inventory", importedData.billing_inventory);
            mergeLists("billing_expenses", importedData.billing_expenses);
            mergeLists("custom_templates", importedData.custom_templates);

            toast.success(t("restoreSuccess") + " Combined items seamlessly.");
            setImportedData(null);
            loadStats();
        } catch (e) {
            console.error(e);
            toast.error("Failed to merge data.");
        }
    };

    return (
        <div className="container px-4 md:px-8 max-w-5xl mx-auto mt-6 md:mt-10 mb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <button onClick={() => router.push("/tools")} className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors mb-3 uppercase tracking-wider">
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to Toolkit
                    </button>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">{t("backupTitle")}</h1>
                    <p className="text-muted-foreground text-sm max-w-xl">{t("backupDesc")}</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={handleExport} size="lg" className="font-bold shadow-lg shadow-primary/20 gap-2 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-600/95 transition-all">
                        <Download className="h-4 w-4" /> {t("exportBackup")}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card border rounded-[2rem] p-6 shadow-sm">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-muted-foreground uppercase text-xs tracking-wider">
                            <Database className="h-4 w-4 text-primary" /> {t("backupStats")}
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3.5 bg-muted/40 rounded-2xl border">
                                <span className="text-xs font-bold text-muted-foreground">Invoices & Receipts</span>
                                <span className="text-lg font-black text-primary">{stats.invoices}</span>
                            </div>
                            <div className="flex justify-between items-center p-3.5 bg-muted/40 rounded-2xl border">
                                <span className="text-xs font-bold text-muted-foreground">Client Records</span>
                                <span className="text-lg font-black text-primary">{stats.clients}</span>
                            </div>
                            <div className="flex justify-between items-center p-3.5 bg-muted/40 rounded-2xl border">
                                <span className="text-xs font-bold text-muted-foreground">Inventory Items</span>
                                <span className="text-lg font-black text-primary">{stats.inventory}</span>
                            </div>
                            <div className="flex justify-between items-center p-3.5 bg-muted/40 rounded-2xl border">
                                <span className="text-xs font-bold text-muted-foreground">Expense Logs</span>
                                <span className="text-lg font-black text-primary">{stats.expenses}</span>
                            </div>
                            <div className="flex justify-between items-center p-3.5 bg-muted/40 rounded-2xl border">
                                <span className="text-xs font-bold text-muted-foreground">Custom Templates</span>
                                <span className="text-lg font-black text-primary">{stats.customTemplates}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6 text-xs text-primary/80 leading-relaxed flex gap-3">
                        <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold mb-1 text-primary">Privacy & Security Guarantee</p>
                            <p>All data and backups are strictly client-side. Nothing is ever sent to external servers. Your records are entirely your own.</p>
                        </div>
                    </div>
                </div>

                {/* Import / Dropzone */}
                <div className="lg:col-span-2 space-y-6">
                    {!importedData ? (
                        <div 
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDragLeave={handleDrag}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center min-h-[350px] transition-all duration-300 ${
                                isDragActive 
                                    ? "border-primary bg-primary/5 scale-[0.99] shadow-inner" 
                                    : "border-muted hover:border-primary/40 bg-card hover:shadow-md"
                            }`}
                        >
                            <div className="p-5 bg-primary/10 rounded-full text-primary mb-6 animate-bounce">
                                <Upload className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Restore Database</h3>
                            <p className="text-muted-foreground text-xs max-w-sm mb-6 leading-relaxed">
                                {t("dragDrop")}
                            </p>
                            
                            <label className="cursor-pointer">
                                <span className="px-6 py-3 border bg-background hover:bg-muted text-xs font-bold rounded-2xl transition-colors shadow-sm inline-block">
                                    {t("selectFile")}
                                </span>
                                <input 
                                    type="file" 
                                    accept=".json" 
                                    onChange={handleFileChange} 
                                    className="hidden" 
                                />
                            </label>
                        </div>
                    ) : (
                        <div className="bg-card border rounded-[2.5rem] p-8 shadow-md animate-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3.5 mb-6 pb-4 border-b">
                                <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600">
                                    <FileJson className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Review Backup Package</h3>
                                    <p className="text-xs text-muted-foreground">Version: {importedData.version || "1.0.0"} • Exported: {importedData.timestamp ? new Date(importedData.timestamp).toLocaleString() : "Unknown date"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                                <div className="bg-muted/40 p-4 rounded-2xl border text-center">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Invoices</span>
                                    <span className="text-lg font-black text-primary">{(importedData.billing_history || []).length}</span>
                                </div>
                                <div className="bg-muted/40 p-4 rounded-2xl border text-center">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Clients</span>
                                    <span className="text-lg font-black text-primary">{(importedData.billing_clients || []).length}</span>
                                </div>
                                <div className="bg-muted/40 p-4 rounded-2xl border text-center">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Inventory</span>
                                    <span className="text-lg font-black text-primary">{(importedData.billing_inventory || []).length}</span>
                                </div>
                                <div className="bg-muted/40 p-4 rounded-2xl border text-center">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Expenses</span>
                                    <span className="text-lg font-black text-primary">{(importedData.billing_expenses || []).length}</span>
                                </div>
                                <div className="bg-muted/40 p-4 rounded-2xl border text-center">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground block mb-1">Templates</span>
                                    <span className="text-lg font-black text-primary">{(importedData.custom_templates || []).length}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Merge option card */}
                                <div onClick={handleMerge} className="border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 rounded-2xl p-5 cursor-pointer flex justify-between items-center group transition-all hover:border-primary/50">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black text-primary flex items-center gap-1.5">{t("mergeMode")}</h4>
                                        <p className="text-xs text-muted-foreground max-w-md">{t("mergeDesc")}</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
                                </div>

                                {/* Overwrite option card */}
                                <div onClick={handleOverwrite} className="border-2 border-red-500/20 bg-red-50/50 hover:bg-red-50 rounded-2xl p-5 cursor-pointer flex justify-between items-center group transition-all hover:border-red-500/50">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black text-red-600 flex items-center gap-1.5">
                                            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                                            {t("overwriteMode")}
                                        </h4>
                                        <p className="text-xs text-red-800/80 max-w-md">{t("overwriteDesc")}</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-red-600 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>

                            <div className="flex justify-end mt-8">
                                <Button variant="ghost" onClick={() => setImportedData(null)} className="rounded-xl font-bold text-xs">{t("cancel")}</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
