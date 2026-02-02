"use client";

import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        router.push(createPageURL(page));
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-12 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 p-1 bg-card border border-border/50 rounded-2xl shadow-xl">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-20"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-1 px-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePageChange(page)}
                            className={cn(
                                "h-10 w-10 rounded-xl font-bold transition-all",
                                currentPage === page
                                    ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary hover:scale-105"
                                    : "hover:bg-primary/10 hover:text-primary"
                            )}
                        >
                            {page}
                        </Button>
                    ))}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-20"
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">
                Página {currentPage} de {totalPages}
            </p>
        </div>
    );
}
