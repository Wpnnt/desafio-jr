"use client";

import { usePathname } from "next/navigation";
import { PawPrint } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLogin = pathname === "/login";

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 transition-colors duration-500">
            {/* Brand Header */}
            <div className="flex flex-col items-center gap-4 mb-8">
                <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 text-white">
                    <PawPrint className="h-10 w-10 fill-current" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Tikki Petshop</h1>
                <p className="text-muted-foreground text-center max-w-sm">
                    Gerencie seus pets com facilidade.
                </p>
            </div>

            {/* Card Container */}
            <div
                key={isLogin ? "login" : "register"}
                className="w-full max-w-[440px] bg-card rounded-2xl border border-border/50 p-6 md:p-8 animate-in fade-in zoom-in-95 slide-in-from-right-4 duration-500 ease-out"
            >
                {children}
            </div>
        </div>
    );
}
