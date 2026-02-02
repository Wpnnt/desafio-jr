import * as z from "zod";

export const ProfileSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    originalEmail: z.string().optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional().refine((val) => !val || val.length >= 6, {
        message: "A nova senha deve ter pelo menos 6 caracteres",
    }),
}).refine((data) => {
    const isEmailChange = data.originalEmail && data.email !== data.originalEmail;
    const isPasswordChange = !!data.newPassword && data.newPassword.length >= 6;

    if ((isEmailChange || isPasswordChange) && !data.currentPassword) {
        return false;
    }
    return true;
}, {
    message: "Senha atual é necessária para alterar e-mail ou senha",
    path: ["currentPassword"],
});
