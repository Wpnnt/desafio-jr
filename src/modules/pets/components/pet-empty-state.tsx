import { PawPrint, Plus } from "lucide-react";
import { PetDialog } from "./pet-dialog";
import { Button } from "@/shared/components/ui/button";

export function PetEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="relative h-32 w-32 bg-card border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                    <PawPrint className="h-16 w-16 text-primary" />
                </div>
            </div>

            <h3 className="text-3xl font-black text-foreground mb-4 tracking-tight">
                Seu petshop está <span className="text-primary">vazio</span>
            </h3>
            <p className="text-muted-foreground max-w-[280px] mb-10 text-lg leading-relaxed font-medium">
                Comece agora mesmo a cadastrar o seu primeiro animalzinho!
            </p>

            <PetDialog
                trigger={
                    <Button className="font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 px-10 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all hover:scale-105 active:scale-95 border-0">
                        <Plus className="mr-2 h-6 w-6" /> Cadastrar Meu Primeiro Pet
                    </Button>
                }
            />
        </div>
    );
}
