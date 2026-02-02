import { auth } from "@/auth";
import { UserNav } from "./user-nav";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { PawPrint } from "lucide-react";

export async function Navbar() {
    const session = await auth();

    return (
        <nav className="border-b border-border bg-card h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                    <PawPrint className="h-5 w-5" />
                </div>
                <span className="font-bold text-xl tracking-tight text-foreground hidden sm:inline">Tikki Petshop</span>
                <span className="font-bold text-xl tracking-tight text-foreground sm:hidden">Tikki</span>
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />
                {session?.user && <UserNav user={session.user} />}
            </div>
        </nav>
    );
}
