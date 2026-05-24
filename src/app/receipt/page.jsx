"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw, RotateCw, Save, Users, Box, History, Database, Search, LayoutDashboard, ArrowLeftRight, Percent } from "lucide-react";
import { FiChevronLeft, FiChevronRight, FiCheck, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
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
import Receipt1 from "@/components/templates/Receipt1";
import Receipt2 from "@/components/templates/Receipt2";
import Receipt3 from "@/components/templates/Receipt3";
import Receipt4 from "@/components/templates/Receipt4";
import { formatCurrency } from "@/utils/formatCurrency";
import { generateReceiptPDF } from "@/utils/receiptPDFGenerator";
import { generateGSTNumber } from "@/utils/invoiceCalculations";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import ItemDetails from "@/components/ItemDetails";

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

const footerOptions = [
    "Thank you for choosing us today!",
    "Your purchase supports our community!",
    "We value your feedback!",
    "Have a great day!",
    "Eco-friendly business. This receipt is recyclable.",
];

const STEPS = [
    { title: "Company", description: "Your Details" },
    { title: "Customer", description: "Recipient Details" },
    { title: "Items", description: "Purchased Products" },
    { title: "Review", description: "Preview & Download" }
];

const ReceiptPage = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const receiptRef = useRef(null);
    const isLoaded = useRef(false);

    const [billTo, setBillTo] = useState("");
    const [invoice, setInvoice] = useState({ date: "", number: "" });
    const [yourCompany, setYourCompany] = useState({ name: "", address: "", phone: "", gst: "" });
    const [cashier, setCashier] = useState("");
    const [items, setItems] = useState([]);
    const [taxPercentage, setTaxPercentage] = useState(0);
    const [theme, setTheme] = useState(1);
    const [notes, setNotes] = useState("");
    const [footer, setFooter] = useState("Thank you");
    const [selectedCurrency, setSelectedCurrency] = useState("INR");
    const [zoom, setZoom] = useState(1);
    const [isDownloading, setIsDownloading] = useState(false);

    const refreshFooter = () => {
        const randomIndex = Math.floor(Math.random() * footerOptions.length);
        setFooter(footerOptions[randomIndex]);
    };

    useEffect(() => {
        const savedData = localStorage.getItem("receiptFormData");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.billTo) setBillTo(parsed.billTo);
                if (parsed.invoice) setInvoice(parsed.invoice);
                if (parsed.yourCompany) setYourCompany(parsed.yourCompany);
                if (parsed.cashier) setCashier(parsed.cashier);
                if (parsed.items) setItems(parsed.items);
                if (parsed.taxPercentage !== undefined) setTaxPercentage(parsed.taxPercentage);
                if (parsed.notes) setNotes(parsed.notes);
                if (parsed.footer) setFooter(parsed.footer);
                if (parsed.selectedCurrency) setSelectedCurrency(parsed.selectedCurrency);
                if (parsed.theme) setTheme(parsed.theme); // Handle numeric theme
            } catch (e) { console.error(e); }
        } else {
            setInvoice(prev => ({ ...prev, number: generateRandomInvoiceNumber(), date: new Date().toISOString().split('T')[0] }));
            setItems([{ name: "", description: "", quantity: 0, amount: 0, total: 0 }]);
        }

        setTimeout(() => {
            isLoaded.current = true;
        }, 500);
    }, []);

    // Save data whenever it changes
    const saveAllData = () => {
        if (!isLoaded.current) return;
        const formData = {
            billTo, invoice, yourCompany, cashier, items,
            taxPercentage, notes, footer, selectedCurrency, theme
        };
        localStorage.setItem("receiptFormData", JSON.stringify(formData));
    };

    useEffect(() => {
        saveAllData();
    }, [billTo, invoice, yourCompany, cashier, items, taxPercentage, notes, footer, selectedCurrency, theme]);


    const saveToHistory = () => {
        const historyItem = {
            id: Date.now(),
            type: "receipt",
            number: invoice.number,
            clientName: billTo || "Walk-in Customer",
            date: invoice.date || new Date().toISOString().split('T')[0],
            total: grandTotal,
            currency: selectedCurrency,
            data: {
                billTo, invoice, yourCompany, cashier, items,
                taxPercentage, notes, footer, selectedCurrency, theme
            }
        };
        const currentHistory = JSON.parse(localStorage.getItem("billing_history") || "[]");
        localStorage.setItem("billing_history", JSON.stringify([...currentHistory, historyItem]));
        toast.success("Receipt saved to history!");
    };


    const fillDummyData = () => {
        setYourCompany({ name: "Global Retailers", address: "14 Market St, San Francisco", phone: "+1 (415) 555-0011", gst: "22AAAAA0000A1Z5" });
        setBillTo("Sarah Jenkins");
        setInvoice(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
        setCashier("Mike Wilson");
        setItems([
            { name: "Wireless Headphones", description: "Premium noise cancelling", quantity: 1, amount: 299, total: 299 },
            { name: "USB-C Cable", description: "2 meter braided", quantity: 3, amount: 15, total: 45 }
        ]);
        setTaxPercentage(8);
        setNotes("Store Credit available for 30 days.");
        setFooter("Thanks for shopping with us!");
        toast.info("Mock receipt data loaded");
    };

    const handleDownloadPDF = async () => {
        if (!isDownloading && receiptRef.current) {
            setIsDownloading(true);
            saveAllData();
            saveToHistory();
            const receiptData = {
                billTo, invoice, yourCompany, cashier, items,
                taxPercentage, notes, footer, selectedCurrency
            };
            try {
                await generateReceiptPDF(receiptRef.current, `Receipt${theme}`, receiptData);
            } catch (error) {
                console.error("Error generating PDF:", error);
            } finally {
                setIsDownloading(false);
            }
        }
    };

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

    const calculateSubTotal = () => items.reduce((sum, item) => sum + item.total, 0);
    const subTotal = calculateSubTotal();
    const taxAmount = (subTotal * taxPercentage) / 100;
    const grandTotal = subTotal + taxAmount;

    const clearForm = () => {
        if (confirm("Clear all receipt data?")) {
            setBillTo("");
            setInvoice({ date: "", number: generateRandomInvoiceNumber() });
            setYourCompany({ name: "", address: "", phone: "", gst: "" });
            setCashier("");
            setItems([{ name: "", description: "", quantity: 0, amount: 0, total: 0 }]);
            setTaxPercentage(0);
            setNotes("");
            setFooter("Thank you");
            setTheme(1); // Reset theme to 1
            localStorage.removeItem("receiptFormData");
        }
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    return (
        <div className="container px-4 md:px-8 max-w-7xl mx-auto mt-6 md:mt-10 mb-20">
            {/* Wizard Header */}
            <div className="mb-8 md:mb-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Receipt Generator</h1>
                        <p className="text-muted-foreground text-sm">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                        <Button variant="outline" className="h-9 text-destructive hover:bg-destructive/10 text-xs sm:text-sm" onClick={clearForm}>
                            <FiTrash2 className="h-4 w-4" /> <span className="ml-2">Clear</span>
                        </Button>
                        <Button variant="outline" className="h-9 border-primary text-primary hover:bg-primary/5 text-xs sm:text-sm" onClick={fillDummyData}>
                            <Database className="h-4 w-4" /> <span className="ml-2">Mock</span>
                        </Button>
                        <Button variant="outline" className="h-9 border-primary text-primary hover:bg-primary/5 text-xs sm:text-sm" onClick={saveAllData}>
                            <Save className="h-4 w-4" /> <span className="ml-2">Save</span>
                        </Button>
                    </div>
                </div>

                <div className="relative flex justify-between px-2 sm:px-5">
                    {STEPS.map((step, i) => (
                        <div key={i} className="flex flex-col items-center relative z-10 w-8 sm:w-10">
                            <div
                                onClick={() => i < currentStep && setCurrentStep(i)}
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${i <= currentStep ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110 cursor-pointer" : "bg-background border-muted text-muted-foreground"
                                    }`}>
                                {i < currentStep ? <FiCheck className="h-4 w-4 sm:h-5 sm:w-5" /> : <span className="text-xs sm:text-sm font-bold">{i + 1}</span>}
                            </div>
                            <span className={`text-[10px] mt-3 font-semibold absolute -bottom-6 whitespace-nowrap hidden md:block ${i <= currentStep ? "text-primary" : "text-muted-foreground"}`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                    <div className="absolute top-4 sm:top-5 left-8 sm:left-10 right-8 sm:right-10 h-[2px] bg-muted -z-0">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="bg-card border rounded-xl shadow-sm overflow-hidden min-h-[500px]">
                <div className="p-4 sm:p-8">
                    {/* Step 1: Your Company */}
                    {currentStep === 0 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 text-foreground">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold">Your Business</h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">Currency:</span>
                                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                                        <SelectTrigger className="w-[100px] h-8 bg-background">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="INR">INR (₹)</SelectItem>
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                            <SelectItem value="EUR">EUR (€)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FloatingLabelInput id="yourCompanyName" label="Company Name" value={yourCompany.name} onChange={handleInputChange(setYourCompany)} name="name" />
                                <FloatingLabelInput id="yourCompanyPhone" label="Phone" value={yourCompany.phone} onChange={handleInputChange(setYourCompany)} name="phone" />
                                <div className="md:col-span-2">
                                    <FloatingLabelInput id="yourCompanyAddress" label="Address" value={yourCompany.address} onChange={handleInputChange(setYourCompany)} name="address" />
                                </div>
                                <div className="relative">
                                    <FloatingLabelInput id="yourCompanyGST" label="GST Number" value={yourCompany.gst} onChange={(e) => setYourCompany(prev => ({ ...prev, gst: e.target.value }))} name="gst" />
                                    <button onClick={() => setYourCompany(prev => ({ ...prev, gst: generateGSTNumber() }))} className="absolute right-2 top-3 transform flex items-center justify-center p-1 rounded hover:bg-muted" title="Generate GST"><RotateCw size={14} /></button>
                                </div>
                                <FloatingLabelInput id="cashier" label="Cashier Name" value={cashier} onChange={(e) => setCashier(e.target.value)} name="cashier" />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Customer & Invoice */}
                    {currentStep === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 text-foreground">
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Invoice Info</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FloatingLabelInput id="invoiceNumber" label="Receipt Number" value={invoice.number} onChange={handleInputChange(setInvoice)} name="number" />
                                    <FloatingLabelInput id="invoiceDate" label="Receipt Date" type="date" value={invoice.date} onChange={handleInputChange(setInvoice)} name="date" />
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-semibold">Customer</h2>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="text-primary gap-1">
                                                <Users className="h-4 w-4" /> Select Client
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Select Customer</DialogTitle>
                                            </DialogHeader>
                                            <Command className="border rounded-lg">
                                                <CommandInput placeholder="Search clients..." />
                                                <CommandList>
                                                    <CommandEmpty>No clients found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {JSON.parse(localStorage.getItem("billing_clients") || "[]").map((client) => (
                                                            <CommandItem
                                                                key={client.id}
                                                                onSelect={() => {
                                                                    setBillTo(client.name);
                                                                    toast.success(`Loaded ${client.name}`);
                                                                }}
                                                                className="cursor-pointer"
                                                            >
                                                                <span>{client.name}</span>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <FloatingLabelInput id="billTo" label="Customer Name" value={billTo} onChange={(e) => setBillTo(e.target.value)} name="billTo" />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Items */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 text-foreground">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold">Purchased Items</h2>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-1">
                                            <Box className="h-4 w-4" /> Add from Inventory
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Select Item</DialogTitle>
                                        </DialogHeader>
                                        <Command className="border rounded-lg">
                                            <CommandInput placeholder="Search product..." />
                                            <CommandList>
                                                <CommandEmpty>No products found.</CommandEmpty>
                                                <CommandGroup>
                                                    {JSON.parse(localStorage.getItem("billing_inventory") || "[]").map((item) => (
                                                        <CommandItem
                                                            key={item.id}
                                                            onSelect={() => {
                                                                setItems([...items, { name: item.name, description: item.description, quantity: 1, amount: parseFloat(item.price), total: parseFloat(item.price) }]);
                                                                toast.success(`Added ${item.name}`);
                                                            }}
                                                            className="cursor-pointer"
                                                        >
                                                            <div className="flex justify-between w-full font-medium italic">
                                                                <span>{item.name}</span>
                                                                <span>{item.price}</span>
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <ItemDetails items={items} handleItemChange={handleItemChange} addItem={addItem} removeItem={removeItem} currencyCode={selectedCurrency} />

                            <div className="mt-8 p-6 bg-muted/30 rounded-lg space-y-3">
                                <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(subTotal, selectedCurrency)}</span></div>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2"><span>Tax (%)</span><input type="number" value={taxPercentage} onChange={e => setTaxPercentage(parseFloat(e.target.value) || 0)} className="w-16 p-1 border rounded text-right" /></div>
                                    <span>{formatCurrency(taxAmount, selectedCurrency)}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg font-bold border-t pt-3 mt-3 text-primary">
                                    <div className="flex flex-col">
                                        <span>Total</span>
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

                    {/* Step 4: Review & Preview */}
                    {currentStep === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 text-foreground">
                            <h2 className="text-2xl font-semibold mb-6 text-center">Finalize Receipt</h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold border-b pb-2">1. Select Style</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[1, 2, 3, 4].map((num) => (
                                            <div
                                                key={num}
                                                className={`group relative border-2 rounded-2xl overflow-hidden cursor-pointer transition-all ${theme === num ? "border-primary ring-2 ring-primary/20 shadow-lg" : "border-muted hover:border-muted-foreground/30 shadow-sm"}`}
                                                onClick={() => setTheme(num)}
                                            >
                                                <div className="bg-muted aspect-[3/4] flex flex-col items-center justify-center p-4">
                                                    <LayoutDashboard className={`h-10 w-10 mb-2 ${theme === num ? "text-primary" : "text-muted-foreground/50"}`} />
                                                    <span className="font-bold text-center text-xs text-muted-foreground">Style {num}</span>
                                                    {theme === num && (
                                                        <div className="absolute top-2 right-2">
                                                            <FiCheck className="bg-primary text-primary-foreground rounded-full p-0.5 h-5 w-5" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4">
                                        <h3 className="text-lg font-bold border-b pb-2 mb-4">2. Preview Options</h3>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-bold uppercase text-muted-foreground">Zoom</span>
                                            <Slider
                                                value={[zoom * 100]}
                                                min={50}
                                                max={150}
                                                step={1}
                                                onValueChange={(val) => setZoom(val[0] / 100)}
                                            />
                                            <span className="text-xs font-bold w-12">{Math.round(zoom * 100)}%</span>
                                        </div>
                                    </div>
                                    <div className="pt-6">
                                        <Button onClick={handleDownloadPDF} disabled={isDownloading} size="xl" className="w-full font-black text-lg py-8 shadow-xl shadow-primary/20 rounded-2xl">
                                            {isDownloading ? <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Preparing...</> : "DOWNLOAD RECEIPT PDF"}
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-muted/30 rounded-[2.5rem] border shadow-inner p-4 min-h-[600px] flex justify-center overflow-auto">
                                    <div
                                        className="bg-white shadow-2xl origin-top transition-transform duration-300"
                                        style={{
                                            transform: `scale(${zoom})`,
                                            width: '400px',
                                            minWidth: '400px',
                                            height: 'fit-content',
                                            marginBottom: `-${(1 - zoom) * 100}%`
                                        }}
                                    >
                                        <div ref={receiptRef}>
                                            {theme === 1 && <Receipt1 data={{ billTo, invoice, yourCompany, cashier, items, taxPercentage, notes, footer, selectedCurrency }} />}
                                            {theme === 2 && <Receipt2 data={{ billTo, invoice, yourCompany, cashier, items, taxPercentage, notes, footer, selectedCurrency }} />}
                                            {theme === 3 && <Receipt3 data={{ billTo, invoice, yourCompany, cashier, items, taxPercentage, notes, footer, selectedCurrency }} />}
                                            {theme === 4 && <Receipt4 data={{ billTo, invoice, yourCompany, cashier, items, taxPercentage, notes, footer, selectedCurrency }} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t bg-muted/20 p-6 flex justify-between items-center">
                    <Button variant="ghost" onClick={prevStep} disabled={currentStep === 0}>
                        <FiChevronLeft className="mr-2" /> Back
                    </Button>
                    <div className="text-sm font-medium">Page {currentStep + 1} of {STEPS.length}</div>
                    <Button onClick={nextStep} disabled={currentStep === STEPS.length - 1} className={currentStep === STEPS.length - 1 ? "opacity-0 pointer-events-none" : ""}>
                        Next <FiChevronRight className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptPage;
