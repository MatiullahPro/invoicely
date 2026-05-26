"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Download, Layout } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import InvoiceTemplate from '@/components/InvoiceTemplate';
import { generatePDF } from '@/utils/pdfGenerator';
import { templates, getAllTemplates } from '@/utils/templateRegistry';

const TemplatePage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState(null);
    const [currentTemplate, setCurrentTemplate] = useState(1);
    const [isDownloading, setIsDownloading] = useState(false);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        const savedFormData = localStorage.getItem('formData');
        const savedTemplate = localStorage.getItem('selectedTemplate');
        if (savedFormData) {
            try {
                setFormData(JSON.parse(savedFormData));
            } catch (e) {
                console.error("Error loading data", e);
            }
        }
        if (savedTemplate) {
            setCurrentTemplate(savedTemplate.startsWith('custom-') ? savedTemplate : parseInt(savedTemplate));
        }
    }, []);

    const handleTemplateChange = (templateNumber) => {
        setCurrentTemplate(templateNumber);
        localStorage.setItem('selectedTemplate', templateNumber);
    };

    const handleDownloadPDF = async () => {
        if (formData && !isDownloading) {
            setIsDownloading(true);
            try {
                await generatePDF(formData, currentTemplate);
            } catch (error) {
                console.error('Error generating PDF:', error);
            } finally {
                setIsDownloading(false);
            }
        }
    };

    if (!formData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium">Loading your invoice...</p>
            </div>
        );
    }

    return (
        <div className="container max-w-7xl mx-auto px-4 mt-10 mb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Invoice Preview</h1>
                    <p className="text-muted-foreground">Customize your design and download your PDF</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => router.push('/')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Edit Details
                    </Button>
                    <Button onClick={handleDownloadPDF} disabled={isDownloading} size="lg" className="font-bold shadow-lg shadow-primary/20">
                        {isDownloading ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Preparing PDF...</>
                        ) : (
                            <><Download className="mr-2 h-5 w-5" /> Download PDF</>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Sidebar - Template Selection */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Layout className="h-5 w-5 text-primary" />
                        <h2 className="font-bold uppercase text-xs tracking-widest text-muted-foreground">Select Design</h2>
                    </div>
                    <div className="space-y-3 h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                        {getAllTemplates().map((template) => (
                            <button
                                key={template.id}
                                className={`w-full text-left rounded-xl border-2 transition-all group overflow-hidden ${currentTemplate === template.id
                                    ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-md"
                                    : "border-muted bg-card hover:border-muted-foreground/30"
                                    }`}
                                onClick={() => handleTemplateChange(template.id)}
                            >
                                <div className="aspect-[4/3] bg-muted relative overflow-hidden flex items-center justify-center">
                                    {template.isCustom ? (
                                        <div className="flex flex-col items-center gap-1.5 p-3 text-center">
                                            <Layout className="h-6 w-6 text-primary" />
                                            <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Custom Design</span>
                                        </div>
                                    ) : (
                                        <img
                                            src={`/assets/template${template.id}-preview.png`}
                                            alt={template.name}
                                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                        />
                                    )}
                                    {currentTemplate === template.id && (
                                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                            <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-[10px] font-bold uppercase">Active</div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <p className={`font-bold text-sm ${currentTemplate === template.id ? "text-primary" : ""}`}>
                                        {template.name}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content - Preview */}
                <div className="lg:col-span-3">
                    <div className="mb-6 flex items-center justify-between bg-card p-4 rounded-2xl border shadow-sm">
                        <div className="flex items-center gap-4 flex-1 max-w-xs">
                            <span className="text-xs font-bold uppercase text-muted-foreground whitespace-nowrap">Zoom</span>
                            <Slider
                                value={[zoom * 100]}
                                min={50}
                                max={150}
                                step={1}
                                onValueChange={(val) => setZoom(val[0] / 100)}
                            />
                            <span className="text-xs font-bold w-12 text-center">{Math.round(zoom * 100)}%%</span>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setZoom(0.8)}>80%</Button>
                            <Button variant="ghost" size="sm" onClick={() => setZoom(1)}>100%</Button>
                        </div>
                    </div>

                    <div className="bg-muted/30 rounded-[2.5rem] border shadow-inner p-4 md:p-8 min-h-[850px] flex justify-center overflow-auto scrollbar-thin">
                        <div
                            className="origin-top transition-transform duration-300"
                            style={{
                                transform: `scale(${zoom})`,
                                width: '800px',
                                minWidth: '800px',
                                height: 'fit-content',
                                marginBottom: `-${(1 - zoom) * 100}%`
                            }}
                        >
                            <div className="text-black overflow-hidden">
                                <InvoiceTemplate data={formData} templateNumber={currentTemplate} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplatePage;
