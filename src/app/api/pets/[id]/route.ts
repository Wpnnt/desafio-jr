import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PetSchema } from "@/modules/pets/schemas";

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
            console.error("Validation failed for PUT:", validatedFields.error.flatten());
            return NextResponse.json({ error: "Dados inválidos", details: validatedFields.error.flatten() }, { status: 400 });
        }

        const updatedPet = await prisma.pet.update({
            where: { id },
            data: validatedFields.data,
        });

        return NextResponse.json(updatedPet);
    } catch (error) {
        console.error("Error updating pet:", error);
        return NextResponse.json({ error: "Erro ao atualizar pet", details: String(error) }, { status: 500 });
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
