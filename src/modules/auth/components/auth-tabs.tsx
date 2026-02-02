"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function AuthTabs() {
    const pathname = usePathname();
    const router = useRouter();

    const isLogin = pathname === "/login";

    return (
        <div className="flex bg-muted/50 p-1 rounded-xl mb-6 relative">
            {/* Sliding Indicator */}
            <div
                className={cn(
                    "absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]",
                    isLogin ? "translate-x-0" : "translate-x-[calc(100%+0px)]"
                )}
            />

            <button
                onClick={() => router.push("/login")}
                className={cn(
                    "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer z-10",
                    isLogin
                        ? "text-zinc-950"
                        : "text-slate-400 hover:text-slate-100"
                )}
            >
                Entrar
            </button>
            <button
                onClick={() => router.push("/register")}
                className={cn(
                    "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer z-10",
                    !isLogin
                        ? "text-zinc-950"
                        : "text-slate-400 hover:text-slate-100"
                )}
            >
                Cadastrar
            </button>
        </div>
    );
}
