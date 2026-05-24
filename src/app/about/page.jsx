import { Info, Shield, Zap, Globe, Smartphone, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
    return (
        <div className="container max-w-7xl mx-auto px-4 mt-10">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                    About Invoicely
                </h1>
                <p className="text-xl text-muted-foreground">
                    The most powerful, offline-first invoice generator for freelancers and small businesses.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="flex gap-4 p-6 border rounded-xl bg-card shadow-sm">
                    <div className="p-3 bg-primary/10 rounded-lg h-fit">
                        <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Blazing Fast</h3>
                        <p className="text-muted-foreground">Built with Next.js and optimized for speed. Generate professional invoices in seconds.</p>
                    </div>
                </div>

                <div className="flex gap-4 p-6 border rounded-xl bg-card shadow-sm">
                    <div className="p-3 bg-primary/10 rounded-lg h-fit">
                        <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Privacy First</h3>
                        <p className="text-muted-foreground">Your data never leaves your browser. Everything is stored locally in your browser's persistent storage.</p>
                    </div>
                </div>

                <div className="flex gap-4 p-6 border rounded-xl bg-card shadow-sm">
                    <div className="p-3 bg-primary/10 rounded-lg h-fit">
                        <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Offline Capability</h3>
                        <p className="text-muted-foreground">Access your invoices anytime, even without an internet connection, thanks to PWA technology.</p>
                    </div>
                </div>

                <div className="flex gap-4 p-6 border rounded-xl bg-card shadow-sm">
                    <div className="p-3 bg-primary/10 rounded-lg h-fit">
                        <Save className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Auto-Save</h3>
                        <p className="text-muted-foreground">Never lose your work. Every character you type is immediately saved for your next session.</p>
                    </div>
                </div>
            </div>

            <div className="bg-primary text-primary-foreground p-8 rounded-3xl text-center space-y-6">
                <h2 className="text-3xl font-bold">Ready to bill?</h2>
                <p className="opacity-90 max-w-lg mx-auto">Join thousands of professionals who trust Invoicely for their daily billing needs.</p>
                <Button size="lg" variant="secondary" className="font-bold" asChild>
                    <a href="/">Get Started Now</a>
                </Button>
            </div>
        </div>
    );
}
