"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PetSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";

interface PetFormProps {
    pet?: any; // Replace with proper type
    trigger?: React.ReactNode;
    mode?: "create" | "edit";
}

export function PetDialog({ pet, trigger, mode = "create" }: PetFormProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<z.infer<typeof PetSchema>>({
        resolver: zodResolver(PetSchema),
        defaultValues: {
            name: "",
            age: 0,
            type: "DOG",
            breed: "",
            ownerName: "",
            ownerContact: "",
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
            });
        } else if (!pet && open) {
            form.reset({
                name: "",
                age: 0,
                type: "DOG",
                breed: "",
                ownerName: "",
                ownerContact: "",
            });
        }
    }, [pet, open, form]);

    const onSubmit = (values: z.infer<typeof PetSchema>) => {
        startTransition(async () => {
            try {
                const url = mode === "edit" ? `/api/pets/${pet.id}` : "/api/pets";
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
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Novo Pet
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === "edit" ? "Editar Pet" : "Novo Pet"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="age"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Idade</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger disabled={isPending}>
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="DOG">Cachorro</SelectItem>
                                                <SelectItem value="CAT">Gato</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="breed"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Raça</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ownerName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Dono</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
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
                                    <FormLabel>Contato</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} placeholder="(00) 00000-0000" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {mode === "edit" ? "Salvar Alterações" : "Cadastrar"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
