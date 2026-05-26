"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '../utils/formatCurrency';
import FloatingLabelInput from '../components/FloatingLabelInput';
import BillToSection from '../components/BillToSection';
import ShipToSection from '../components/ShipToSection';
import ItemDetails from "../components/ItemDetails";
import { templates, getAllTemplates } from "../utils/templateRegistry";
import { FiEdit, FiFileText, FiTrash2, FiChevronRight, FiChevronLeft, FiCheck } from "react-icons/fi";
import { RefreshCw, Save, Users, Box, History, CheckCircle, Database, ArrowLeftRight, Percent, LayoutDashboard } from "lucide-react";
import SignatureCanvas from 'react-signature-canvas';
import { useLanguage } from '../context/LanguageContext';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

const generateRandomInvoiceNumber = () => {
    const length = Math.floor(Math.random() * 6) + 3;
    const alphabetCount = Math.min(Math.floor(Math.random() * 4), length);
    let result = "";
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    for (let i = 0; i < alphabetCount; i++) result += alphabet[Math.floor(Math.random() * alphabet.length)];
    for (let i = alphabetCount; i < length; i++) result += numbers[Math.floor(Math.random() * numbers.length)];
    return result;
};

const noteOptions = [
    "Thank you for choosing us today!",
    "Your purchase supports our community!",
    "We value your feedback!",
    "Have a great day!",
    "Keep this receipt for returns or exchanges.",
];

const Index = () => {
    const { t } = useLanguage();

    const STEPS = [
        { title: t("stepInfo"), description: t("invoiceNumber") },
        { title: t("stepCompany"), description: t("companyDetails") },
        { title: t("stepCustomer"), description: t("customerDetails") },
        { title: t("stepItems"), description: t("stepItems") },
        { title: t("stepFinalize"), description: t("notes") + " & " + t("signature") },
        { title: t("stepTemplate"), description: t("stepTemplate") }
    ];

    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedCurrency, setSelectedCurrency] = useState("INR");
    const [billTo, setBillTo] = useState({ name: "", address: "", phone: "" });
    const [shipTo, setShipTo] = useState({ name: "", address: "", phone: "" });
    const [invoice, setInvoice] = useState({ date: "", paymentDate: "", number: "" });
    const [yourCompany, setYourCompany] = useState({ name: "", address: "", phone: "" });
    const [items, setItems] = useState([]);
    const [taxPercentage, setTaxPercentage] = useState(0);
    const [taxAmount, setTaxAmount] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [notes, setNotes] = useState("");
    const [signature, setSignature] = useState(null);
    const sigCanvas = useRef(null);
    const isLoaded = useRef(false);

    const refreshNotes = () => {
        const randomIndex = Math.floor(Math.random() * noteOptions.length);
        setNotes(noteOptions[randomIndex]);
    };

    // Correctly load data on mount
    useEffect(() => {
        const savedData = localStorage.getItem("formData");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.billTo) setBillTo(parsed.billTo);
                if (parsed.shipTo) setShipTo(parsed.shipTo);
                if (parsed.invoice) setInvoice(parsed.invoice);
                if (parsed.yourCompany) setYourCompany(parsed.yourCompany);
                if (parsed.items) setItems(parsed.items);
                if (parsed.taxPercentage !== undefined) setTaxPercentage(parsed.taxPercentage);
                if (parsed.notes) setNotes(parsed.notes);
                if (parsed.selectedCurrency) setSelectedCurrency(parsed.selectedCurrency);
                if (parsed.img) setSignature(parsed.img);
            } catch (e) {
                console.error("Error parsing saved data", e);
            }
        } else {
            setInvoice(prev => ({ ...prev, number: generateRandomInvoiceNumber(), date: new Date().toISOString().split('T')[0] }));
            setItems([{ name: "", description: "", quantity: 0, amount: 0, total: 0 }]);
        }

        // Wait a bit to ensure state setters have settled before enabling auto-save
        setTimeout(() => {
            isLoaded.current = true;
        }, 500);
    }, []);

    // Save data whenever it changes
    const saveAllData = () => {
        const img = sigCanvas.current ? sigCanvas.current.toDataURL('image/png') : signature;
        const formData = {
            billTo, shipTo, invoice, yourCompany, items,
            taxPercentage, taxAmount, subTotal, grandTotal,
            notes, selectedCurrency, img
        };
        localStorage.setItem("formData", JSON.stringify(formData));
    };

    useEffect(() => {
        if (isLoaded.current) {
            saveAllData();
        }
    }, [billTo, shipTo, invoice, yourCompany, items, taxPercentage, notes, selectedCurrency]);

    const handleInputChange = (setter) => (e) => {
        const { name, value } = e.target;
        setter(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        if (field === "quantity" || field === "amount") {
            newItems[index].total = newItems[index].quantity * newItems[index].amount;
        }
        setItems(newItems);
    };

    const addItem = () => setItems([...items, { name: "", description: "", quantity: 0, amount: 0, total: 0 }]);
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

    useEffect(() => {
        const st = items.reduce((sum, item) => sum + (item.quantity * item.amount), 0);
        const ta = (st * taxPercentage) / 100;
        setSubTotal(st);
        setTaxAmount(ta);
        setGrandTotal(st + ta);
    }, [items, taxPercentage]);


    const saveToHistory = (templateNumber) => {
        const historyItem = {
            id: Date.now(),
            type: "invoice",
            number: invoice.number,
            clientName: billTo.name,
            date: invoice.date || new Date().toISOString().split('T')[0],
            total: grandTotal,
            currency: selectedCurrency,
            data: {
                billTo, shipTo, invoice, yourCompany, items,
                taxPercentage, taxAmount, subTotal, grandTotal,
                notes, selectedCurrency, templateNumber
            }
        };
        const currentHistory = JSON.parse(localStorage.getItem("billing_history") || "[]");
        localStorage.setItem("billing_history", JSON.stringify([...currentHistory, historyItem]));
        toast.success("Invoice saved to history!");
    };

    const handleTemplateClick = (templateNumber) => {
        saveAllData();
        saveToHistory(templateNumber);
        localStorage.setItem("selectedTemplate", templateNumber);
        router.push("/template");
    };


    const fillDummyData = () => {
        setBillTo({ name: "John Smith", address: "123 Business Way, New York, NY 10001", phone: "+1 (555) 012-3456" });
        setShipTo({ name: "Jane Doe", address: "456 Residential Avenue, Brooklyn, NY 11201", phone: "+1 (555) 987-6543" });
        setInvoice(prev => ({ ...prev, date: new Date().toISOString().split('T')[0], paymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }));
        setYourCompany({ name: "Acme Corp", address: "789 Enterprise Blvd, Suite 100", phone: "+1 (800) 123-4567" });
        setItems([
            { name: "Website Development", description: "Full-stack development of professional business website", quantity: 1, amount: 2500, total: 2500 },
            { name: "Graphic Design", description: "Logo and brand identity design", quantity: 2, amount: 600, total: 1200 },
            { name: "Consulting", description: "Strategic technology planning (per hour)", quantity: 10, amount: 150, total: 1500 }
        ]);
        setTaxPercentage(18);
        setNotes("Thank you for your business! Please pay within 7 days.");
        toast.info("Dummy data loaded into form");

        // Also add dummy clients/inventory if empty
        if (!localStorage.getItem("billing_clients")) {
            const dummyClients = [
                { id: 1, name: "John Smith", address: "123 Business Way, New York, NY 10001", phone: "+1 (555) 012-3456" },
                { id: 2, name: "Jane Doe", address: "456 Residential Avenue, Brooklyn, NY 11201", phone: "+1 (555) 987-6543" }
            ];
            localStorage.setItem("billing_clients", JSON.stringify(dummyClients));
        }
        if (!localStorage.getItem("billing_inventory")) {
            const dummyInventory = [
                { id: 1, name: "Website Development", description: "Full-stack development", price: "2500" },
                { id: 2, name: "Graphic Design", description: "Logo and brand identity", price: "600" }
            ];
            localStorage.setItem("billing_inventory", JSON.stringify(dummyInventory));
        }
    };

    const clearForm = () => {
        if (confirm("Clear all data?")) {
            setBillTo({ name: "", address: "", phone: "" });
            setShipTo({ name: "", address: "", phone: "" });
            setInvoice({ date: "", paymentDate: "", number: generateRandomInvoiceNumber() });
            setYourCompany({ name: "", address: "", phone: "" });
            setItems([{ name: "", description: "", quantity: 0, amount: 0, total: 0 }]);
            setTaxPercentage(0);
            setNotes("");
            setSignature(null);
            if (sigCanvas.current) sigCanvas.current.clear();
            localStorage.removeItem("formData");
        }
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    return (
        <div className="container px-4 md:px-8 max-w-7xl mx-auto mt-6 md:mt-10 mb-20">
            {/* Wizard Header */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{t("invoices")}</h1>
                        <p className="text-muted-foreground">{t("stepInfo")} {currentStep + 1} / {STEPS.length}: {STEPS[currentStep].title}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="h-10 text-destructive hover:bg-destructive/10" onClick={clearForm} title="Clear All">
                            <FiTrash2 className="h-4 w-4" /> <span className="ml-2 hidden sm:inline">{t("clear")}</span>
                        </Button>
                        <Button variant="outline" className="h-10" onClick={fillDummyData}>
                            <Database className="h-4 w-4" /> <span className="ml-2 hidden sm:inline">{t("fillDemoData")}</span>
                        </Button>
                        <Button variant="outline" className="h-10 border-primary text-primary hover:bg-primary/5" onClick={saveAllData}>
                            <Save className="h-4 w-4" /> <span className="ml-2 hidden sm:inline">{t("save")}</span>
                        </Button>
                    </div>
                </div>

                <div className="relative flex justify-between px-2 sm:px-5">
                    {STEPS.map((step, i) => (
                        <div key={i} className="flex flex-col items-center relative z-10">
                            <div
                                onClick={() => i < currentStep && setCurrentStep(i)}
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 cursor-pointer ${i <= currentStep
                                        ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110"
                                        : "bg-background border-muted text-muted-foreground"
                                    }`}
                            >
                                {i < currentStep ? <FiCheck className="h-4 w-4 sm:h-5 sm:w-5" /> : <span className="text-xs sm:text-sm font-bold">{i + 1}</span>}
                            </div>
                            <span className={`text-[10px] mt-3 font-semibold absolute -bottom-6 whitespace-nowrap hidden lg:block ${i <= currentStep ? "text-primary" : "text-muted-foreground"}`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                    <div className="absolute top-4 sm:top-5 left-8 sm:left-10 right-8 sm:right-10 h-[2px] bg-muted -z-0">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 sm:p-8">
                    {/* Step 1: Invoice Info */}
                    {currentStep === 0 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-semibold">{t("stepInfo")}</h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">{t("selectCurrency")}:</span>
                                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                                        <SelectTrigger className="w-[120px] bg-background">
                                            <SelectValue placeholder="Currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="INR">INR (₹)</SelectItem>
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                            <SelectItem value="EUR">EUR (€)</SelectItem>
                                            <SelectItem value="GBP">GBP (£)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FloatingLabelInput id="invoiceNumber" label={t("invoiceNumber")} value={invoice.number} onChange={handleInputChange(setInvoice)} name="number" />
                                <FloatingLabelInput id="invoiceDate" label={t("invoiceDate")} type="date" value={invoice.date} onChange={handleInputChange(setInvoice)} name="date" />
                                <FloatingLabelInput id="paymentDate" label={t("dueDate")} type="date" value={invoice.paymentDate} onChange={handleInputChange(setInvoice)} name="paymentDate" />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Company Info */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-semibold">{t("companyDetails")}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FloatingLabelInput id="yourCompanyName" label={t("companyName")} value={yourCompany.name} onChange={handleInputChange(setYourCompany)} name="name" />
                                <FloatingLabelInput id="yourCompanyPhone" label={t("phone")} value={yourCompany.phone} onChange={handleInputChange(setYourCompany)} name="phone" />
                                <div className="md:col-span-2">
                                    <FloatingLabelInput id="yourCompanyAddress" label={t("address")} value={yourCompany.address} onChange={handleInputChange(setYourCompany)} name="address" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Customer Info */}
                    {currentStep === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-semibold">{t("billTo")}</h2>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="text-primary gap-1 border-primary/20 hover:bg-primary/5">
                                                <Users className="h-4 w-4" /> {t("selectClient")}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>{t("clients")}</DialogTitle>
                                            </DialogHeader>
                                            <Command className="border rounded-lg">
                                                <CommandInput placeholder={t("search")} />
                                                <CommandList>
                                                    <CommandEmpty>No clients found.</CommandEmpty>
                                                    <CommandGroup heading={t("clients")}>
                                                        {JSON.parse(localStorage.getItem("billing_clients") || "[]").map((client) => (
                                                            <CommandItem
                                                                key={client.id}
                                                                onSelect={() => {
                                                                    setBillTo({ name: client.name, address: client.address, phone: client.phone });
                                                                    toast.success(`Loaded ${client.name}`);
                                                                }}
                                                                className="cursor-pointer"
                                                            >
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold">{client.name}</span>
                                                                    <span className="text-xs text-muted-foreground">{client.phone}</span>
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FloatingLabelInput id="billToName" label={t("clientName")} value={billTo.name} onChange={handleInputChange(setBillTo)} name="name" />
                                    <FloatingLabelInput id="billToPhone" label={t("phone")} value={billTo.phone} onChange={handleInputChange(setBillTo)} name="phone" />
                                    <div className="md:col-span-2">
                                        <FloatingLabelInput id="billToAddress" label={t("address")} value={billTo.address} onChange={handleInputChange(setBillTo)} name="address" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">{t("shipTo")} <span className="text-sm font-normal text-muted-foreground ml-2">(Optional)</span></h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FloatingLabelInput id="shipToName" label={t("clientName")} value={shipTo.name} onChange={handleInputChange(setShipTo)} name="name" />
                                    <FloatingLabelInput id="shipToPhone" label={t("phone")} value={shipTo.phone} onChange={handleInputChange(setShipTo)} name="phone" />
                                    <div className="md:col-span-2">
                                        <FloatingLabelInput id="shipToAddress" label={t("address")} value={shipTo.address} onChange={handleInputChange(setShipTo)} name="address" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Items */}
                    {currentStep === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold">{t("stepItems")}</h2>
                                <div className="flex gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="gap-1">
                                                <Box className="h-4 w-4" /> {t("addItem")} ({t("inventory")})
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>{t("inventory")}</DialogTitle>
                                            </DialogHeader>
                                            <Command className="border rounded-lg">
                                                <CommandInput placeholder={t("search")} />
                                                <CommandList>
                                                    <CommandEmpty>No products found.</CommandEmpty>
                                                    <CommandGroup heading={t("inventory")}>
                                                        {JSON.parse(localStorage.getItem("billing_inventory") || "[]").map((item) => (
                                                            <CommandItem
                                                                key={item.id}
                                                                onSelect={() => {
                                                                    setItems([...items, { name: item.name, description: item.description, quantity: 1, amount: parseFloat(item.price), total: parseFloat(item.price) }]);
                                                                    toast.success(`Added ${item.name}`);
                                                                }}
                                                                className="cursor-pointer"
                                                            >
                                                                <div className="flex justify-between items-center w-full">
                                                                    <div className="flex flex-col">
                                                                        <span className="font-bold">{item.name}</span>
                                                                        <span className="text-xs text-muted-foreground line-clamp-1">{item.description}</span>
                                                                    </div>
                                                                    <span className="font-bold text-primary">{item.price}</span>
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </DialogContent>
                                    </Dialog>
                                    <div className="flex items-center px-3 py-1.5 rounded-lg border bg-muted/20 text-xs font-bold uppercase tracking-tight">
                                        {selectedCurrency}
                                    </div>
                                </div>
                            </div>
                            <ItemDetails items={items} handleItemChange={handleItemChange} addItem={addItem} removeItem={removeItem} currencyCode={selectedCurrency} />

                            <div className="mt-8 p-6 bg-muted/30 rounded-lg space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>{t("subtotal")}</span>
                                    <span>{formatCurrency(subTotal, selectedCurrency)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <span>{t("taxPercentage")}</span>
                                        <input type="number" value={taxPercentage} onChange={e => setTaxPercentage(parseFloat(e.target.value) || 0)} className="w-16 p-1 border rounded text-right" />
                                        <span>%</span>
                                    </div>
                                    <span>{formatCurrency(taxAmount, selectedCurrency)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xl font-black text-primary pt-2 border-t-2 border-primary/20">
                                    <div className="flex flex-col">
                                        <span>{t("grandTotal")}</span>
                                        <button
                                            onClick={() => router.push(`/tools?amount=${grandTotal}`)}
                                            className="text-[10px] text-muted-foreground uppercase flex items-center gap-1 hover:text-primary transition-colors"
                                        >
                                            <ArrowLeftRight className="h-3 w-3" /> Estimate Late Fee
                                        </button>
                                    </div>
                                    <span>{formatCurrency(grandTotal, selectedCurrency)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Finalize */}
                    {currentStep === 4 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <h2 className="text-2xl font-semibold">{t("notes")}</h2>
                                    <Button variant="ghost" size="icon" onClick={refreshNotes} title="Randomize Notes"><RefreshCw className="h-4 w-4" /></Button>
                                </div>
                                <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-4 border rounded-lg min-h-[120px] bg-background focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Thank you for your business..."></textarea>
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">{t("signature")}</h2>
                                <div className="border rounded-lg bg-background p-1 overflow-hidden">
                                    <SignatureCanvas
                                        penColor='black'
                                        ref={sigCanvas}
                                        canvasProps={{
                                            className: 'sigCanvas w-full h-[200px] border rounded-md cursor-crosshair'
                                        }}
                                        onEnd={() => setSignature(sigCanvas.current.toDataURL())}
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-muted-foreground">Sign above for the invoice</p>
                                    <Button variant="ghost" size="sm" onClick={() => { sigCanvas.current.clear(); setSignature(null); }}>{t("clearSignature")}</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 6: Template */}
                    {currentStep === 5 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-semibold">{t("stepTemplate")}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {getAllTemplates().map((template) => (
                                    <div 
                                        key={template.id} 
                                        className="group relative border rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all shadow-sm bg-card" 
                                        onClick={() => handleTemplateClick(template.id)}
                                    >
                                        <div className="w-full h-48 bg-muted relative flex items-center justify-center">
                                            {template.isCustom ? (
                                                <div className="flex flex-col items-center gap-2 p-4 text-center">
                                                    <div className="p-3 bg-primary/10 rounded-2xl text-primary mb-1">
                                                        <LayoutDashboard className="h-8 w-8" />
                                                    </div>
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Custom Brand Design</span>
                                                </div>
                                            ) : (
                                                <img
                                                    src={`/assets/template${template.id}-preview.png`}
                                                    alt={template.name}
                                                    className="w-full h-full object-cover object-top border-b transition-opacity duration-300"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            )}
                                            <div className="absolute inset-0 hidden items-center justify-center bg-muted flex-col gap-2">
                                                <LayoutDashboard className="h-8 w-8 text-muted-foreground/50" />
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Preview Missing</span>
                                            </div>
                                        </div>
                                        <div className="p-3 text-center">
                                            <p className="font-bold text-sm">{template.name}</p>
                                        </div>
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t bg-muted/20 p-6 flex justify-between items-center">
                    <Button variant="ghost" onClick={prevStep} disabled={currentStep === 0}>
                        <FiChevronLeft className="mr-2" /> {t("previous")}
                    </Button>
                    <div className="text-sm text-muted-foreground font-medium">
                        {t("stepInfo")} {currentStep + 1} / {STEPS.length}
                    </div>
                    {currentStep < STEPS.length - 1 ? (
                        <Button onClick={nextStep}>
                            {t("next")} <FiChevronRight className="ml-2" />
                        </Button>
                    ) : (
                        <span className="text-sm font-medium text-primary">Select a template above to generate PDF</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Index;
