"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PetSchema } from "@/modules/pets/schemas";
import { Button } from "@/shared/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Pet } from "@prisma/client";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { useRouter } from "next/navigation";
import { Plus, Dog, Cat, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBreeds } from "../actions/get-breeds";

interface PetFormProps {
    pet?: Pet;
    trigger?: React.ReactNode;
    mode?: "create" | "edit";
}

export function PetDialog({ pet, trigger, mode = "create" }: PetFormProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [breeds, setBreeds] = useState<{ id: string; name: string }[]>([]);
    const [openBreed, setOpenBreed] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof PetSchema>>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(PetSchema) as any,
        defaultValues: {
            name: "",
            age: 0,
            type: "DOG",
            breed: "",
            ownerName: "",
            ownerContact: "",
            image: "",
        },
    });

    useEffect(() => {
        if (pet && open) {
            form.reset({
                name: pet.name,
                age: pet.age,
                type: pet.type,
                breed: pet.breed,
                ownerName: pet.ownerName,
                ownerContact: pet.ownerContact,
                image: pet.image || "",
            });
        } else if (!pet && open) {
            form.reset({
                name: "",
                age: 0,
                type: "DOG",
                breed: "",
                ownerName: "",
                ownerContact: "",
                image: "",
            });
        }
    }, [pet, open, form]);


    const fetchBreeds = async (type: "DOG" | "CAT") => {
        try {
            const result = await getBreeds(type);
            if (result.success && result.data) {
                setBreeds(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch breeds action", error);
        }
    };

    // Fetch breeds initially and when type changes
    useEffect(() => {
        const type = form.watch("type");
        fetchBreeds(type);
    }, [form.watch("type")]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            // Limitar a 4MB no cliente para evitar erros de servidor
            if (file.size > 4 * 1024 * 1024) {
                alert("A imagem é muito pesada! Por favor, escolha uma imagem de até 4MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                fieldChange(base64String);
            };
            reader.readAsDataURL(file);
        }
    };



    const onSubmit = (values: z.infer<typeof PetSchema>) => {
        startTransition(async () => {
            try {
                const url = mode === "edit" ? `/api/pets/${pet?.id}` : "/api/pets";
                const method = mode === "edit" ? "PUT" : "POST";

                const res = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                });

                if (res.ok) {
                    setOpen(false);
                    router.refresh();
                } else {
                    // Handle error
                    console.error("Failed to save pet");
                }
            } catch (error) {
                console.error(error);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button className="h-10 px-6 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all shadow-md shadow-orange-500/20">
                        <Plus className="mr-2 h-4 w-4" /> Cadastrar
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent aria-describedby={undefined} className="sm:max-w-[600px] bg-card border-border shadow-2xl">
                <DialogHeader className="pb-4 border-b border-border">
                    <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                        {mode === "edit" ? <Pencil className="h-5 w-5 text-muted-foreground" /> : <Plus className="h-5 w-5 text-muted-foreground" />}
                        {mode === "edit" ? "Editar Pet" : "Novo Pet"}
                    </DialogTitle>
                </DialogHeader>

                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Section 1: Animal Info */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <h4 className="text-sm font-black uppercase tracking-widest text-foreground/70">Sobre o Animal</h4>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-center justify-center space-y-4 pt-2">
                                            <FormControl>
                                                <div className="relative group cursor-pointer" onClick={() => document.getElementById("pet-image-upload")?.click()}>
                                                    <div className={cn(
                                                        "h-36 w-36 rounded-[2.5rem] overflow-hidden border-4 border-background shadow-2xl relative bg-muted flex items-center justify-center transition-all group-hover:scale-105",
                                                        !field.value && "bg-orange-500/5"
                                                    )}>
                                                        {field.value ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={field.value} alt="Preview" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <Dog className="h-16 w-16 text-primary/20" />
                                                        )}

                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Pencil className="text-white h-6 w-6" />
                                                        </div>
                                                    </div>

                                                    <Input
                                                        id="pet-image-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleImageUpload(e, field.onChange)}
                                                    />
                                                </div>
                                            </FormControl>
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Alterar Foto</p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-black uppercase tracking-tight text-muted-foreground">Nome</FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled={isPending} className="bg-muted/20 dark:bg-muted/5 border-border focus-visible:ring-primary h-12 rounded-xl px-4 font-bold" placeholder="Ex: Rex" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="age"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-black uppercase tracking-tight text-muted-foreground">Idade (Anos)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" disabled={isPending} className="bg-muted/20 dark:bg-muted/5 border-border focus-visible:ring-primary h-12 rounded-xl px-4 font-bold" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-black uppercase tracking-tight text-muted-foreground">Tipo</FormLabel>
                                                <FormControl>
                                                    <div className="flex bg-muted p-1.5 rounded-2xl h-12">
                                                        <button
                                                            type="button"
                                                            onClick={() => field.onChange("DOG")}
                                                            className={`flex-1 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-tighter rounded-xl transition-all cursor-pointer ${field.value === "DOG" ? "bg-card text-orange-500 shadow-xl scale-[1.02]" : "text-muted-foreground hover:text-foreground"}`}
                                                        >
                                                            <Dog className="h-4 w-4" /> Cão
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => field.onChange("CAT")}
                                                            className={`flex-1 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-tighter rounded-xl transition-all cursor-pointer ${field.value === "CAT" ? "bg-card text-purple-500 shadow-xl scale-[1.02]" : "text-muted-foreground hover:text-foreground"}`}
                                                        >
                                                            <Cat className="h-4 w-4" /> Gato
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="breed"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col relative">
                                                <FormLabel className="text-xs font-black uppercase tracking-tight text-muted-foreground">Raça</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            {...field}
                                                            placeholder="Buscar raça..."
                                                            className="bg-muted/20 dark:bg-muted/5 border-border focus-visible:ring-primary h-12 rounded-xl px-4 font-bold"
                                                            autoComplete="off"
                                                            onFocus={() => setOpenBreed(true)}
                                                            onBlur={() => {
                                                                setTimeout(() => setOpenBreed(false), 200);
                                                            }}
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                                setOpenBreed(true);
                                                            }}
                                                        />
                                                        {openBreed && field.value && (
                                                            <div className="absolute z-[60] w-full mt-2 bg-popover text-popover-foreground rounded-2xl border border-border shadow-2xl max-h-[200px] overflow-auto p-1">
                                                                {breeds
                                                                    .filter((breed) =>
                                                                        breed.name.toLowerCase().includes(field.value.toLowerCase()) &&
                                                                        breed.name.toLowerCase() !== field.value.toLowerCase()
                                                                    )
                                                                    .map((breed) => (
                                                                        <div
                                                                            key={breed.id}
                                                                            className="cursor-pointer px-4 py-2.5 text-sm font-bold hover:bg-primary/10 hover:text-primary rounded-xl transition-colors"
                                                                            onMouseDown={(e) => {
                                                                                e.preventDefault();
                                                                                field.onChange(breed.name);
                                                                                setOpenBreed(false);
                                                                            }}
                                                                        >
                                                                            {breed.name}
                                                                        </div>
                                                                    ))}
                                                                {breeds.filter((breed) =>
                                                                    breed.name.toLowerCase().includes(field.value.toLowerCase())
                                                                ).length === 0 && (
                                                                        <div className="px-4 py-3 text-xs font-bold text-muted-foreground p-2">
                                                                            Nenhuma sugestão
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Section 2: Owner Info */}
                            <div className="space-y-6 pt-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    <h4 className="text-sm font-black uppercase tracking-widest text-foreground/70">Sobre o Dono</h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="ownerName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-black uppercase tracking-tight text-muted-foreground">Nome Completo</FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled={isPending} className="bg-muted/20 dark:bg-muted/5 border-border focus-visible:ring-primary h-12 rounded-xl px-4 font-bold" placeholder="Nome do proprietário" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="ownerContact"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-black uppercase tracking-tight text-muted-foreground">Telefone / WhatsApp</FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled={isPending} placeholder="(99) 99999-9999" className="bg-muted/20 dark:bg-muted/5 border-border focus-visible:ring-primary h-12 rounded-xl px-4 font-bold" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-border">
                                <Button type="button" variant="ghost" className="flex-1 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => setOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold" disabled={isPending}>
                                    {mode === "edit" ? "Salvar Alterações" : "Cadastrar Pet"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
