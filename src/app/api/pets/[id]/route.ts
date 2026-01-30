import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const PetSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    age: z.coerce.number().min(0, "Idade deve ser maior ou igual a 0"),
    type: z.enum(["DOG", "CAT"]),
    breed: z.string().min(1, "Raça é obrigatória"),
    ownerName: z.string().min(1, "Nome do dono é obrigatório"),
    ownerContact: z.string().min(1, "Contato do dono é obrigatório"),
});

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { id } = await params;

        // Authorization check
        const pet = await prisma.pet.findUnique({ where: { id } });
        if (!pet) return NextResponse.json({ error: "Pet não encontrado" }, { status: 404 });

        if (pet.userId !== session.user.id) {
            return NextResponse.json({ error: "Permissão negada" }, { status: 403 });
        }

        const body = await req.json();
        const validatedFields = PetSchema.safeParse(body);

        if (!validatedFields.success) {
            return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
        }

        const updatedPet = await prisma.pet.update({
            where: { id },
            data: validatedFields.data,
        });

        return NextResponse.json(updatedPet);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar pet" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { id } = await params;

        // Authorization check
        const pet = await prisma.pet.findUnique({ where: { id } });
        if (!pet) return NextResponse.json({ error: "Pet não encontrado" }, { status: 404 });

        if (pet.userId !== session.user.id) {
            return NextResponse.json({ error: "Permissão negada" }, { status: 403 });
        }

        await prisma.pet.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao deletar pet" }, { status: 500 });
    }
}
