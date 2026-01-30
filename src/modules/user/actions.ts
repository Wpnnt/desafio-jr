"use server";

import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileSchema } from "@/modules/user/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function updateUser(values: z.infer<typeof ProfileSchema>) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Não autorizado" };
    }

    const validatedFields = ProfileSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Dados inválidos" };
    }

    const { name, email, currentPassword, newPassword } = validatedFields.data;

    try {
        if (newPassword && currentPassword) {
            const dbUser = await prisma.user.findUnique({
                where: { id: session.user.id },
            });

            if (!dbUser || !dbUser.password) {
                return { error: "Usuário não encontrado" };
            }

            const passwordsMatch = await bcrypt.compare(currentPassword, dbUser.password);

            if (!passwordsMatch) {
                return { error: "Senha atual incorreta" };
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await prisma.user.update({
                where: { id: session.user.id },
                data: { name, email, password: hashedPassword },
            });
        } else {
            await prisma.user.update({
                where: { id: session.user.id },
                data: { name, email },
            });
        }

        revalidatePath("/");
        return { success: "Perfil atualizado com sucesso!" };
    } catch (error) {
        console.error(error);
        return { error: "Erro ao atualizar perfil" };
    }
}

export async function deleteUser() {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Não autorizado" };
    }

    try {
        await prisma.user.delete({
            where: { id: session.user.id },
        });

        await signOut({ redirect: true, redirectTo: "/login" });
        return { success: "Conta excluída com sucesso!" };
    } catch (error) {
        console.error(error);
        return { error: "Erro ao excluir conta" };
    }
}
