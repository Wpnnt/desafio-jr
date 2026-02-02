"use client";

import { Card } from "@/shared/components/ui/card";
import { Dog, Cat, LayoutGrid } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
    total: number;
    dogs: number;
    cats: number;
}

export function StatsCards({ total, dogs, cats }: StatsCardsProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const currentType = searchParams.get("type");

    const handleFilter = (type: string | null) => {
        const params = new URLSearchParams(searchParams);
        if (type) {
            if (params.get("type") === type) {
                params.delete("type");
            } else {
                params.set("type", type);
            }
        } else {
            params.delete("type");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const cards = [
        {
            label: "Total",
            value: total,
            icon: <LayoutGrid className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />,
            color: "blue",
            delay: "duration-500",
            type: null,
            isActive: !currentType
        },
        {
            label: "Cachorros",
            value: dogs,
            icon: <Dog className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />,
            color: "orange",
            delay: "delay-100 duration-500",
            type: "DOG",
            isActive: currentType === "DOG"
        },
        {
            label: "Gatos",
            value: cats,
            icon: <Cat className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />,
            color: "purple",
            delay: "delay-200 duration-500",
            type: "CAT",
            isActive: currentType === "CAT"
        }
    ];

    return (
        <div className="w-full mb-6">
            <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-4xl mx-auto">
                {cards.map((card) => (
                    <Card
                        key={card.label}
                        onClick={() => handleFilter(card.type)}
                        className={cn(
                            "group flex flex-col items-center justify-center p-3 h-20 md:h-24 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95 animate-in fade-in slide-in-from-bottom-2 fill-mode-both rounded-xl md:rounded-3xl relative overflow-hidden",
                            card.isActive
                                ? "bg-primary/20 border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/20"
                                : "bg-card border border-white/10 dark:border-white/5 shadow-sm",
                            card.delay
                        )}
                    >
                        <div className="flex flex-col items-center gap-1.5 md:gap-2">
                            {/* Top Row: Icon and Number */}
                            <div className="flex items-center gap-2 md:gap-2.5">
                                <div className={cn(
                                    "flex shrink-0 p-2 rounded-lg md:rounded-xl transition-all duration-300",
                                    card.isActive ? "bg-primary/20" : `bg-${card.color}-500/10`
                                )}>
                                    {card.icon}
                                </div>
                                <span className={cn(
                                    "text-2xl md:text-3xl font-black leading-none tracking-tighter",
                                    card.isActive ? "text-primary" : "text-foreground"
                                )}>
                                    {card.value}
                                </span>
                            </div>

                            {/* Bottom Row: Label */}
                            <p className={cn(
                                "text-[10px] md:text-xs font-black uppercase tracking-tight md:tracking-[0.2em] opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap",
                                card.isActive ? "text-primary/90" : "text-muted-foreground/80"
                            )}>
                                {card.label}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
