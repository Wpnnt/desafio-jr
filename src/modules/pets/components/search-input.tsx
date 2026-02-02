"use client";

import { Input } from "@/shared/components/ui/input";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search } from "lucide-react";

export function SearchInput() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative group w-full">
            <Input
                defaultValue={searchParams.get("q")?.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
                placeholder="Buscar por nome do animal ou dono..."
                className="pl-12 h-12 bg-muted/20 dark:bg-muted/5 border-border rounded-2xl focus-visible:ring-primary focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground shadow-lg transition-all duration-300"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-300 pointer-events-none">
                <Search className="h-5 w-5" />
            </div>
        </div>
    );
}
