import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    metadataBase: new URL("https://invoicely.matiullah.pro"),
    title: "Invoicely | Free Offline-First Invoice & Receipt Generator",
    description: "Generate professional invoices and receipts instantly offline. Invoicely is a local-first billing, client directory, and inventory suite for freelancers, entrepreneurs, and small businesses.",
    keywords: ["invoice generator", "receipt maker", "offline billing", "local-first accounting", "freelancer tools", "small business invoicing", "tax calculator", "PWA invoice app", "privacy-first billing"],
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Invoicely",
    },
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://invoicely.org",
        siteName: "Invoicely",
        title: "Invoicely | Free Offline-First Invoice & Receipt Generator",
        description: "Create professional invoices and receipts instantly offline. Invoicely is a local-first billing, client, and inventory suite for freelancers and small businesses.",
        images: [
            {
                url: "/icon0.svg",
                width: 512,
                height: 512,
                alt: "Invoicely Logo",
            },
        ],
    },
    twitter: {
        card: "summary",
        title: "Invoicely | Free Offline-First Invoicing",
        description: "Create professional invoices and receipts instantly offline. Privacy-first billing suite.",
        images: ["/icon0.svg"],
    },
};

export const viewport = {
    themeColor: "#000000",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} min-h-screen overflow-x-hidden`}>
                <ReactQueryProvider>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                        <TooltipProvider>
                            <Navbar />
                            <main>{children}</main>
                            <Toaster />
                        </TooltipProvider>
                    </ThemeProvider>
                </ReactQueryProvider>
            </body>
        </html>
    );
}
