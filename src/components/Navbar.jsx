"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Receipt, LayoutDashboard, Info, Users, Box, History, Database, Wrench, BarChart3, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

const NavItem = ({ href, icon: Icon, children, onClick }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-semibold transition-all hover:bg-muted rounded-lg group",
                isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
            )}
        >
            <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive ? "text-primary" : "")} />
            {children}
        </Link>
    );
};

export function Navbar() {
    const fillAllDummyData = () => {
        // Fill Clients
        const dummyClients = [
            { id: Date.now() + 1, name: "John Smith", address: "123 Business Way, New York, NY 10001", phone: "+1 (555) 012-3456" },
            { id: Date.now() + 2, name: "Jane Doe", address: "456 Residential Avenue, Brooklyn, NY 11201", phone: "+1 (555) 987-6543" },
            { id: Date.now() + 3, name: "Tech Solutions Inc", address: "789 Innovation Dr, San Francisco, CA 94105", phone: "+1 (415) 123-4567" }
        ];
        localStorage.setItem("billing_clients", JSON.stringify(dummyClients));

        // Fill Inventory
        const dummyInventory = [
            { id: Date.now() + 4, name: "Website Development", description: "Full-stack Next.js development", price: "2500" },
            { id: Date.now() + 5, name: "Logo Design", description: "Professional branding package", price: "450" },
            { id: Date.now() + 6, name: "Cloud Hosting", description: "Annual management fee", price: "1200" }
        ];
        localStorage.setItem("billing_inventory", JSON.stringify(dummyInventory));

        // Fill History with multiple items
        const dummyHistory = Array.from({ length: 25 }, (_, i) => {
            const isInvoice = i % 3 !== 0; // Mix of invoices and receipts
            const date = new Date();
            date.setDate(date.getDate() - (i * 2)); // Spread dates over past days

            return {
                id: Date.now() + i + 100,
                type: isInvoice ? "invoice" : "receipt",
                number: `${isInvoice ? 'INV' : 'REC'}-${1000 + i}`,
                clientName: i % 2 === 0 ? "John Smith" : "Jane Doe",
                date: date.toISOString().split('T')[0],
                total: 1000 + (i * 150),
                currency: "USD",
                data: {
                    billTo: { name: "John Smith", address: "123 Business Way", phone: "555-0123" },
                    shipTo: { name: "John Smith", address: "123 Business Way", phone: "555-0123" },
                    invoice: { date: date.toISOString().split('T')[0], number: `${isInvoice ? 'INV' : 'REC'}-${1000 + i}` },
                    yourCompany: { name: "Acme Corp", address: "789 Enterprise Blvd", phone: "800-123-4567" },
                    items: [{ name: "Service", quantity: 1, amount: 1000 + (i * 150), total: 1000 + (i * 150) }],
                    taxPercentage: 0,
                    selectedCurrency: "USD"
                }
            };
        });
        localStorage.setItem("billing_history", JSON.stringify(dummyHistory));

        // Fill current wizard data too so the UI is active
        localStorage.setItem("formData", JSON.stringify(dummyHistory[0].data));
        localStorage.setItem("receiptFormData", JSON.stringify(dummyHistory[0].data));

        window.location.reload(); // Refresh to show data
    };

    const navLinks = [
        { href: "/", icon: FileText, label: "Invoices" },
        { href: "/receipt", icon: Receipt, label: "Receipts" },
        { href: "/clients", icon: Users, label: "Clients" },
        { href: "/inventory", icon: Box, label: "Inventory" },
        { href: "/history", icon: History, label: "History" },
        { href: "/ledger", icon: BarChart3, label: "Ledger" },
        { href: "/tools", icon: Wrench, label: "Tools" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container px-4 flex h-16 items-center justify-between">
                <div className="flex items-center gap-4 lg:gap-8">
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                                <SheetHeader>
                                    <SheetTitle className="text-left flex items-center gap-2 mb-4">
                                        <div className="bg-primary p-1 rounded-lg">
                                            <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
                                        </div>
                                        INVOICELY
                                    </SheetTitle>
                                </SheetHeader>
                                <nav className="flex flex-col gap-2 mt-4">
                                    {navLinks.map((link) => (
                                        <NavItem key={link.href} href={link.href} icon={link.icon}>
                                            {link.label}
                                        </NavItem>
                                    ))}
                                    <div className="h-[1px] bg-muted my-2"></div>
                                    <NavItem href="/about" icon={Info}>About</NavItem>
                                </nav>
                                <div className="absolute bottom-8 left-6 right-6">
                                    <Button variant="outline" className="w-full gap-2 text-xs font-bold" onClick={fillAllDummyData}>
                                        <Database className="h-3.5 w-3.5" />
                                        Fill All Demo Data
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href="/" className="flex items-center space-x-2 md:border-r md:pr-8">
                        <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20">
                            <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tighter uppercase">
                            Invoicely
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-1">
                        {navLinks.slice(0, 2).map(link => (
                            <NavItem key={link.href} href={link.href} icon={link.icon}>{link.label}</NavItem>
                        ))}
                        <div className="w-[1px] h-4 bg-muted mx-2"></div>
                        {navLinks.slice(2).map(link => (
                            <NavItem key={link.href} href={link.href} icon={link.icon}>{link.label}</NavItem>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={fillAllDummyData} className="hidden lg:flex gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                        <Database className="h-3.5 w-3.5" />
                        <span>Fill All Demo Data</span>
                    </Button>
                    <div className="hidden sm:block">
                        <NavItem href="/about" icon={Info}>About</NavItem>
                    </div>
                </div>
            </div>
        </header>
    );
}


