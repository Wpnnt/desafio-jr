import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "O em-mail é obrigatório.",
    }),
    password: z.string().min(1, {
        message: "A senha é obrigatória.",
    }),
});

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, {
        message: "A senha deve ter no mínimo 6 caracteres.",
    }),
    name: z.string().min(1, {
        message: "O nome é obrigatório.",
    }),
});

export const PetSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    age: z.coerce.number().min(0, "Idade inválida"),
    type: z.enum(["DOG", "CAT"]),
    breed: z.string().min(1, "Raça é obrigatória"),
    ownerName: z.string().min(1, "Nome do dono é obrigatório"),
    ownerContact: z.string().min(1, "Contato do dono é obrigatório"),
});
