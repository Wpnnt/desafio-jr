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
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!dbUser || !dbUser.password) {
            return { error: "Usuário não encontrado" };
        }

        const isEmailChange = email !== dbUser.email;
        const isPasswordChange = !!newPassword;

        // Require current password if email or password is being changed
        if (isEmailChange || isPasswordChange) {
            if (!currentPassword) {
                return { error: "Senha atual é necessária para alterar e-mail ou senha" };
            }

            const passwordsMatch = await bcrypt.compare(currentPassword, dbUser.password);

            if (!passwordsMatch) {
                return { error: "Senha atual incorreta" };
            }
        }

        // Check if new email is already taken by another user
        if (isEmailChange) {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                return { error: "Este e-mail já está em uso" };
            }
        }

        const updateData: any = { name, email };

        if (isPasswordChange) {
            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
        });

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
