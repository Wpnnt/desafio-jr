import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

import { PetSchema } from "@/schemas";

export async function GET(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");

        const where: any = {};

        if (query) {
            where.OR = [
                { name: { contains: query, mode: "insensitive" } },
                { ownerName: { contains: query, mode: "insensitive" } },
            ];
        }

        const pets = await prisma.pet.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true, email: true } } }, // Optional: include owner user details
        });

        return NextResponse.json(pets);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar pets" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const body = await req.json();
        const validatedFields = PetSchema.safeParse(body);

        if (!validatedFields.success) {
            return NextResponse.json(
                { error: "Dados inválidos", details: validatedFields.error.flatten() },
                { status: 400 }
            );
        }

        const { name, age, type, breed, ownerName, ownerContact } = validatedFields.data;

        const pet = await prisma.pet.create({
            data: {
                name,
                age,
                type,
                breed,
                ownerName,
                ownerContact,
                userId: session.user.id,
            },
        });

        return NextResponse.json(pet, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao criar pet" }, { status: 500 });
    }
}
