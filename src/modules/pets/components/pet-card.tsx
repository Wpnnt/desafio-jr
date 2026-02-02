"use client";

import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil, Trash, Dog, Cat, User, Phone, Search, Info } from "lucide-react";
import { PetDialog } from "./pet-dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

interface PetCardProps {
    pet: {
        id: string;
        name: string;
        age: number;
        type: "DOG" | "CAT";
        breed: string;
        ownerName: string;
        ownerContact: string;
        image?: string | null;
        userId: string;
    };
    currentUserId?: string;
}

export function PetCard({ pet, currentUserId }: PetCardProps) {
    const router = useRouter();
    const isOwner = currentUserId === pet.userId;

    return (
        <div className="group relative flex flex-col rounded-[2rem] bg-card border border-border/50  overflow-hidden h-fit transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 shadow-lg">
            <Dialog>
                {/* 1. Image Area (Prominent) */}
                <div className="relative w-full h-48 md:h-56 overflow-hidden bg-muted">
                    {pet.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={pet.image}
                            alt={pet.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className={cn(
                            "h-full w-full flex items-center justify-center opacity-40",
                            pet.type === "DOG" ? "bg-orange-500/10 text-orange-500" : "bg-purple-500/10 text-purple-500"
                        )}>
                            {pet.type === "DOG" ? <Dog className="h-16 w-16" /> : <Cat className="h-16 w-16" />}
                        </div>
                    )}

                    {/* Species Badge Overlay */}
                    <div className={cn(
                        "absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 shadow-2xl z-10 select-none text-white",
                        pet.type === "DOG"
                            ? "bg-orange-500 shadow-orange-500/40"
                            : "bg-purple-600 shadow-purple-500/40"
                    )}>
                        {pet.type === "DOG" ? <Dog className="h-3 w-3" /> : <Cat className="h-3 w-3" />}
                        {pet.type === "DOG" ? "Cachorro" : "Gato"}
                    </div>

                    {/* Age Badge Overlay */}
                    <div className="absolute top-4 right-4 bg-black/80 border border-white/10 px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-tighter shadow-lg z-10 select-none">
                        {pet.age} {pet.age === 1 ? 'Ano' : 'Anos'}
                    </div>

                    {/* Subtle Overlay for better text separation if needed, but keeping it very light */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>

                {/* 2. Content Info Block */}
                <div className="p-6 pt-4 space-y-4">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="font-black text-foreground text-2xl truncate tracking-tight">{pet.name}</h3>
                            {isOwner && (
                                <span className="shrink-0 bg-primary/10 text-primary text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide border border-primary/20">
                                    Meu Pet
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-foreground/80 font-bold uppercase tracking-widest truncate">{pet.breed}</p>
                    </div>

                    {/* Divider with subtle dots */}
                    <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-border/40" />
                        <div className="h-1 w-1 rounded-full bg-border" />
                        <div className="h-px flex-1 bg-border/40" />
                    </div>

                    {/* Owner Info - More Professional Row */}
                    <div className="grid grid-cols-1 gap-2.5">
                        <div className="flex items-center gap-3 text-muted-foreground/80 group/owner">
                            <div className="p-1.5 rounded-lg bg-muted/50 transition-colors group-hover/owner:bg-primary/10">
                                <User className="h-3.5 w-3.5" />
                            </div>
                            <span className="font-bold text-sm truncate">{pet.ownerName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground/80 group/phone">
                            <div className="p-1.5 rounded-lg bg-muted/50 transition-colors group-hover/phone:bg-primary/10">
                                <Phone className="h-3.5 w-3.5" />
                            </div>
                            <span className="font-medium text-sm">{pet.ownerContact}</span>
                        </div>
                    </div>
                </div>

                {/* 3. Invisible Overlay Trigger for details */}
                <DialogTrigger asChild>
                    <button
                        className="absolute inset-0 w-full h-full cursor-pointer z-0 opacity-0 bg-transparent border-0 outline-none focus:ring-0"
                        type="button"
                    >
                        <span className="sr-only">Ver detalhes de {pet.name}</span>
                    </button>
                </DialogTrigger>

                {/* 4. Details Dialog Content */}
                <DialogContent aria-describedby={undefined} className="sm:max-w-md bg-card border-border shadow-2xl rounded-[2.5rem] overflow-hidden p-0">
                    <div className="p-4 pb-0">
                        <div className="relative h-64 w-full bg-muted rounded-[2rem] overflow-hidden">
                            {pet.image ? (
                                <img src={pet.image} alt={pet.name} className="h-full w-full object-cover" />
                            ) : (
                                <div className={cn(
                                    "h-full w-full flex items-center justify-center opacity-20",
                                    pet.type === "DOG" ? "bg-orange-500/10 text-orange-500" : "bg-purple-500/10 text-purple-500"
                                )}>
                                    {pet.type === "DOG" ? <Dog className="h-24 w-24" /> : <Cat className="h-24 w-24" />}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex items-end justify-between gap-4">
                                    <div className="space-y-1">
                                        <DialogTitle className="text-4xl font-black text-white drop-shadow-md">{pet.name}</DialogTitle>
                                        <p className="text-lg font-bold text-white/80 uppercase tracking-widest opacity-90">{pet.breed}</p>
                                    </div>
                                    <div className="bg-black/80 border border-white/20 px-4 py-2 rounded-2xl text-center shadow-lg">
                                        <p className="text-2xl font-black text-white leading-none">{pet.age}</p>
                                        <p className="text-[10px] text-white font-black uppercase tracking-tighter mt-0.5">{pet.age === 1 ? 'Ano' : 'Anos'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="space-y-4">
                            <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                <Info className="h-3 w-3" /> Detalhes do Responsável
                            </h4>
                            <div className="grid grid-cols-2 gap-6 bg-muted/30 p-5 rounded-2xl border border-border/50">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Nome</p>
                                    <p className="text-base font-bold text-foreground">{pet.ownerName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Contato</p>
                                    <p className="text-base font-bold text-foreground">{pet.ownerContact}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        {isOwner && (
                            <div className="flex gap-4">
                                <PetDialog
                                    mode="edit"
                                    pet={pet as any}
                                    trigger={
                                        <Button className="flex-1 bg-foreground text-background hover:bg-foreground/90 font-black rounded-xl h-12 border-0 cursor-pointer transition-all hover:scale-[1.02] active:scale-95">
                                            <Pencil className="mr-2 h-4 w-4" /> Editar
                                        </Button>
                                    }
                                />

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" className="flex-1 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-black rounded-xl h-12 cursor-pointer transition-all hover:scale-[1.02] active:scale-95">
                                            <Trash className="mr-2 h-4 w-4" /> Remover
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-card border-border rounded-3xl">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-2xl font-black">Remover {pet.name}?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-muted-foreground font-medium">
                                                Essa ação é permanente. Toda história e registros deste pet serão removidos do sistema.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="gap-3 sm:gap-0">
                                            <AlertDialogCancel className="border-border hover:bg-muted text-foreground font-bold rounded-xl cursor-pointer">Manter Pet</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={async () => {
                                                    await fetch(`/api/pets/${pet.id}`, { method: "DELETE" });
                                                    router.refresh();
                                                }}
                                                className="bg-red-600 hover:bg-red-700 border-0 text-white font-black rounded-xl cursor-pointer"
                                            >
                                                Sim, Remover
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    );
}
