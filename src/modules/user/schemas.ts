import * as z from "zod";

export const ProfileSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres").optional(),
}).refine((data) => {
    if (data.newPassword && !data.currentPassword) {
        return false;
    }
    return true;
}, {
    message: "Senha atual é obrigatória para definir uma nova senha",
    path: ["currentPassword"],
});
