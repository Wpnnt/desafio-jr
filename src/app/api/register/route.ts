import { NextResponse } from "next/server";
import { RegisterSchema } from "@/schemas";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedFields = RegisterSchema.safeParse(body);

        if (!validatedFields.success) {
            return NextResponse.json(
                { error: "Dados inválidos." },
                { status: 400 }
            );
        }

        const { email, password, name } = validatedFields.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "E-mail já está em uso." },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            { success: "Usuário criado com sucesso!" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor." },
            { status: 500 }
        );
    }
}
