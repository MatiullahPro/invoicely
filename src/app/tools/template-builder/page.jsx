"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Layout, Palette, Type, Eye, Layers, ZoomIn, ZoomOut, Maximize2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import CustomTemplate from "@/components/templates/CustomTemplate";

// Colors palette options
const THEME_COLORS = [
    { name: "Royal Indigo", hex: "#4f46e5" },
    { name: "Forest Emerald", hex: "#059669" },
    { name: "Sunset Amber", hex: "#d97706" },
    { name: "Crimson Rose", hex: "#e11d48" },
    { name: "Midnight Charcoal", hex: "#374151" },
    { name: "Neon Cyan", hex: "#0891b2" },
    { name: "Deep Purple", hex: "#7c3aed" }
];

const FONTS = [
    { name: "Inter (Modern Sans)", value: "Inter" },
    { name: "Outfit (Geometric Sans)", value: "Outfit" },
    { name: "Playfair (Classic Serif)", value: "Playfair Display" },
    { name: "Fira Code (Monospace Developer)", value: "Fira Code" }
];

const LAYOUTS = [
    { value: "modern", label: "Modern Split Column" },
    { value: "minimal", label: "Clean Minimalist" },
    { value: "banner", label: "Bold Top Banner" },
    { value: "sidebar", label: "Left Sidebar Accent" }
];

const TABLE_STYLES = [
    { value: "striped", label: "Striped Rows" },
    { value: "bordered", label: "Grid Outlines" },
    { value: "minimal", label: "Minimalist Borderless" }
];

const DUMMY_DATA = {
    billTo: { name: "John Doe", address: "123 Client Lane, Tech District, CA 94016", phone: "+1 (555) 789-0123" },
    shipTo: { name: "Jane Smith", address: "456 Warehouse Blvd, Logistics Hub, NY 10001", phone: "+1 (555) 321-7890" },
    invoice: { date: "2026-05-25", paymentDate: "2026-06-15", number: "INV-2026-99" },
    yourCompany: { name: "Acme Creative Co.", address: "789 Studio Block, Silicon Valley, CA 95051", phone: "+1 (800) 555-1234" },
    items: [
        { name: "Website Development", description: "Full-stack development of enterprise Next.js application.", quantity: 1, amount: 4500, total: 4500 },
        { name: "UI/UX Design Package", description: "High-fidelity wireframes and mobile screen interactions.", quantity: 2, amount: 1200, total: 2400 },
        { name: "Monthly Cloud Maintenance", description: "Vercel deployments, domain SSL renews, database checks.", quantity: 5, amount: 150, total: 750 }
    ],
    taxPercentage: 10,
    taxAmount: 765,
    subTotal: 7650,
    grandTotal: 8415,
    notes: "Thank you for your business! Please settle the payment by the due date. Standard terms apply.",
    selectedCurrency: "USD",
    img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAwCAYAAADgQ09oAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAbUlEQVR4nO3BMQEAAADCoPVP7WsJdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4A1nEAAEvdZqMAAAAAElFTkSuQmCC" // Simulated sig
};

export default function TemplateBuilderPage() {
    const router = useRouter();

    const [zoom, setZoom] = useState(0.85);
    const [templateName, setTemplateName] = useState("My Brand Style");
    
    // Design config state
    const [config, setConfig] = useState({
        themeColor: "#4f46e5",
        secondaryColor: "#1e1b4b",
        textColor: "#1f2937",
        fontFamily: "Inter",
        layout: "modern",
        tableStyle: "striped",
        visibility: {
            shipTo: true,
            signature: true,
            dueDate: true,
            tax: true,
            notes: true
        },
        labels: {
            invoice: "INVOICE",
            invoiceNumber: "Invoice Number",
            invoiceDate: "Invoice Date",
            dueDate: "Due Date",
            billTo: "Bill To",
            shipTo: "Ship To",
            itemName: "Item",
            quantity: "Qty",
            unitPrice: "Unit Price",
            total: "Total",
            subtotal: "Subtotal",
            tax: "Tax",
            grandTotal: "Total Amount"
        }
    });

    const handleVisibilityToggle = (key) => {
        setConfig(prev => ({
            ...prev,
            visibility: {
                ...prev.visibility,
                [key]: !prev.visibility[key]
            }
        }));
    };

    const handleLabelChange = (key, value) => {
        setConfig(prev => ({
            ...prev,
            labels: {
                ...prev.labels,
                [key]: value
            }
        }));
    };

    const handleSaveTemplate = () => {
        if (!templateName.trim()) {
            toast.error("Please enter a name for your custom template.");
            return;
        }

        try {
            const savedTemplates = JSON.parse(localStorage.getItem("custom_templates") || "[]");
            
            const newTemplate = {
                id: `custom-${Date.now()}`,
                name: templateName,
                config: config
            };

            const updated = [...savedTemplates.filter(t => t.name !== templateName), newTemplate];
            localStorage.setItem("custom_templates", JSON.stringify(updated));
            toast.success("Bespoke template layout saved! It is now fully active in your designs list.");
            router.push("/tools");
        } catch (e) {
            console.error(e);
            toast.error("Failed to save template.");
        }
    };

    return (
        <div className="container max-w-7xl mx-auto px-4 mt-6 md:mt-10 mb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <button onClick={() => router.push("/tools")} className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors mb-3 uppercase tracking-wider">
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to Toolkit
                    </button>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                        Template Designer Studio
                    </h1>
                    <p className="text-muted-foreground text-sm">Design bespoke layouts with brand colors, customizable structures, and typography.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <input 
                        type="text" 
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        className="p-2.5 bg-card border rounded-xl text-xs font-bold w-48 shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Template Name"
                    />
                    <Button onClick={handleSaveTemplate} size="lg" className="font-bold shadow-lg shadow-primary/20 gap-2 bg-gradient-to-r from-primary to-indigo-600">
                        <Save className="h-4 w-4" /> Save Design
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Control Panel Sidebar */}
                <div className="lg:col-span-4 bg-card border rounded-[2rem] p-6 shadow-sm space-y-6 max-h-[850px] overflow-y-auto pr-2 scrollbar-thin">
                    
                    {/* section 1: Layout format */}
                    <div className="space-y-3">
                        <h3 className="font-black text-xs uppercase text-muted-foreground tracking-widest flex items-center gap-1.5 pb-2 border-b">
                            <Layout className="h-4 w-4 text-primary" /> Layout Blueprint
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {LAYOUTS.map((lay) => (
                                <button
                                    key={lay.value}
                                    onClick={() => setConfig(prev => ({ ...prev, layout: lay.value }))}
                                    className={`p-3 text-[10px] font-bold rounded-xl border text-center transition-all ${
                                        config.layout === lay.value 
                                            ? "bg-primary text-primary-foreground border-primary shadow-md" 
                                            : "bg-muted/30 hover:bg-muted text-muted-foreground"
                                    }`}
                                >
                                    {lay.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* section 2: Styling colors */}
                    <div className="space-y-3">
                        <h3 className="font-black text-xs uppercase text-muted-foreground tracking-widest flex items-center gap-1.5 pb-2 border-b">
                            <Palette className="h-4 w-4 text-primary" /> Brand Palette
                        </h3>
                        <div>
                            <span className="text-[10px] font-black text-muted-foreground uppercase block mb-2">Theme Accent</span>
                            <div className="flex flex-wrap gap-2.5">
                                {THEME_COLORS.map((col) => (
                                    <button
                                        key={col.hex}
                                        onClick={() => setConfig(prev => ({ ...prev, themeColor: col.hex, secondaryColor: col.hex + "E0" }))}
                                        className={`w-8 h-8 rounded-full border-2 transition-all relative ${
                                            config.themeColor === col.hex ? "ring-2 ring-primary/40 scale-110" : "opacity-80 hover:opacity-100"
                                        }`}
                                        style={{ backgroundColor: col.hex, borderColor: config.themeColor === col.hex ? "#ffffff" : "transparent" }}
                                        title={col.name}
                                    />
                                ))}
                                <input 
                                    type="color" 
                                    value={config.themeColor}
                                    onChange={(e) => setConfig(prev => ({ ...prev, themeColor: e.target.value, secondaryColor: e.target.value }))}
                                    className="w-8 h-8 rounded-full border bg-transparent cursor-pointer overflow-hidden p-0"
                                    title="Custom Hex Picker"
                                />
                            </div>
                        </div>
                    </div>

                    {/* section 3: Typography */}
                    <div className="space-y-3">
                        <h3 className="font-black text-xs uppercase text-muted-foreground tracking-widest flex items-center gap-1.5 pb-2 border-b">
                            <Type className="h-4 w-4 text-primary" /> Typography & Fonts
                        </h3>
                        <div className="space-y-2">
                            {FONTS.map((font) => (
                                <button
                                    key={font.value}
                                    onClick={() => setConfig(prev => ({ ...prev, fontFamily: font.value }))}
                                    className={`w-full p-3 text-xs font-bold rounded-xl border flex justify-between items-center transition-all ${
                                        config.fontFamily === font.value 
                                            ? "bg-primary/5 border-primary text-primary shadow-sm" 
                                            : "bg-muted/30 hover:bg-muted text-muted-foreground"
                                    }`}
                                >
                                    <span>{font.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* section 4: Table and Visibility toggles */}
                    <div className="space-y-3">
                        <h3 className="font-black text-xs uppercase text-muted-foreground tracking-widest flex items-center gap-1.5 pb-2 border-b">
                            <Layers className="h-4 w-4 text-primary" /> Formatting & Elements
                        </h3>
                        <div>
                            <span className="text-[10px] font-black text-muted-foreground uppercase block mb-2">Item Table Style</span>
                            <div className="grid grid-cols-1 gap-2">
                                {TABLE_STYLES.map((tStyle) => (
                                    <button
                                        key={tStyle.value}
                                        onClick={() => setConfig(prev => ({ ...prev, tableStyle: tStyle.value }))}
                                        className={`w-full p-2.5 text-xs font-bold rounded-xl border text-center transition-all ${
                                            config.tableStyle === tStyle.value 
                                                ? "bg-primary/5 border-primary text-primary" 
                                                : "bg-muted/30 hover:bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        {tStyle.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <span className="text-[10px] font-black text-muted-foreground uppercase block mb-1">Display Toggles</span>
                            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                                {Object.keys(config.visibility).map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => handleVisibilityToggle(key)}
                                        className={`p-2 border rounded-xl flex items-center justify-between transition-colors ${
                                            config.visibility[key] ? "bg-emerald-50 text-emerald-600 border-emerald-500/20" : "bg-muted/30 text-muted-foreground"
                                        }`}
                                    >
                                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                        <span>{config.visibility[key] ? "ON" : "OFF"}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* section 5: Custom Labels */}
                    <div className="space-y-3">
                        <h3 className="font-black text-xs uppercase text-muted-foreground tracking-widest flex items-center gap-1.5 pb-2 border-b">
                            <Eye className="h-4 w-4 text-primary" /> Label Translations
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                            <div>
                                <label className="text-gray-400 block mb-1">Invoice Label</label>
                                <input
                                    type="text"
                                    value={config.labels.invoice}
                                    onChange={(e) => handleLabelChange("invoice", e.target.value)}
                                    className="w-full p-2 bg-muted/40 border rounded-lg focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 block mb-1">Invoice Number</label>
                                <input
                                    type="text"
                                    value={config.labels.invoiceNumber}
                                    onChange={(e) => handleLabelChange("invoiceNumber", e.target.value)}
                                    className="w-full p-2 bg-muted/40 border rounded-lg focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 block mb-1">Bill To Label</label>
                                <input
                                    type="text"
                                    value={config.labels.billTo}
                                    onChange={(e) => handleLabelChange("billTo", e.target.value)}
                                    className="w-full p-2 bg-muted/40 border rounded-lg focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 block mb-1">Total Amount Label</label>
                                <input
                                    type="text"
                                    value={config.labels.grandTotal}
                                    onChange={(e) => handleLabelChange("grandTotal", e.target.value)}
                                    className="w-full p-2 bg-muted/40 border rounded-lg focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side live zoomable Preview Area */}
                <div className="lg:col-span-8 flex flex-col items-center">
                    <div className="mb-4 flex items-center justify-between w-full bg-card px-5 py-3 border rounded-2xl shadow-sm">
                        <div className="flex items-center gap-4 flex-1 max-w-xs">
                            <span className="text-xs font-bold uppercase text-muted-foreground whitespace-nowrap">Zoom Factor</span>
                            <Slider
                                value={[zoom * 100]}
                                min={40}
                                max={120}
                                step={1}
                                onValueChange={(val) => setZoom(val[0] / 100)}
                            />
                            <span className="text-xs font-black text-primary">{Math.round(zoom * 100)}%</span>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setZoom(0.6)} className="h-8 font-bold text-xs">60%</Button>
                            <Button variant="ghost" size="sm" onClick={() => setZoom(0.85)} className="h-8 font-bold text-xs">85%</Button>
                            <Button variant="ghost" size="sm" onClick={() => setZoom(1.0)} className="h-8 font-bold text-xs">100%</Button>
                        </div>
                    </div>

                    <div className="bg-muted/30 rounded-[2.5rem] border shadow-inner w-full flex justify-center p-6 md:p-10 min-h-[900px] overflow-auto scrollbar-thin">
                        <div
                            className="origin-top transition-transform duration-300 shadow-2xl bg-white text-black"
                            style={{
                                transform: `scale(${zoom})`,
                                width: "800px",
                                minWidth: "800px",
                                height: "1131px",
                                minHeight: "1131px",
                                marginBottom: `-${(1 - zoom) * 1131}px`
                            }}
                        >
                            <CustomTemplate data={DUMMY_DATA} config={config} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
