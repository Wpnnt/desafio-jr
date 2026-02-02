"use server";

import { prisma } from "@/lib/prisma";
import { PetType } from "@prisma/client";

export async function getBreeds(type: "DOG" | "CAT") {
    try {
        const breeds = await prisma.breed.findMany({
            where: {
                type: type as PetType,
            },
            orderBy: {
                name: "asc",
            },
        });

        return { success: true, data: breeds };
    } catch (error) {
        console.error("Error fetching breeds action:", error);
        return { success: false, error: "Erro ao buscar raças" };
    }
}
