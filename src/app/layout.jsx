import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Invoicely",
    description: "Invoicely is an offline invoice generator that uses local storage to save data.",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Invoicely",
    },
    formatDetection: {
        telephone: false,
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
