"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
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
        userId: string;
    };
    currentUserId?: string;
}

export function PetCard({ pet, currentUserId }: PetCardProps) {
    const router = useRouter();
    const isOwner = currentUserId === pet.userId;

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/pets/${pet.id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to delete pet", error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{pet.name}</CardTitle>
                    <Badge variant={pet.type === "DOG" ? "default" : "secondary"}>
                        {pet.type === "DOG" ? "Cachorro" : "Gato"}
                    </Badge>
                </div>
                <CardDescription>Raça: {pet.breed}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-sm">
                    <span className="font-semibold">Idade:</span> {pet.age} anos
                </p>
                <p className="text-sm">
                    <span className="font-semibold">Dono:</span> {pet.ownerName}
                </p>
                <p className="text-sm">
                    <span className="font-semibold">Contato:</span> {pet.ownerContact}
                </p>
            </CardContent>
            {isOwner && (
                <CardFooter className="flex justify-end gap-2">
                    <PetDialog
                        mode="edit"
                        pet={pet}
                        trigger={
                            <Button variant="outline" size="icon">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        }
                    />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                                <Trash className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Essa ação não pode ser desfeita. Isso excluirá permanentemente o pet do sistema.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                    Deletar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            )}
        </Card>
    );
}
