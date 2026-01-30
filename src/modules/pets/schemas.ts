import * as z from "zod";

export const PetSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    age: z.coerce.number().min(0, "Idade inválida"),
    type: z.enum(["DOG", "CAT"]),
    breed: z.string().min(1, "Raça é obrigatória"),
    ownerName: z.string().min(1, "Nome do dono é obrigatório"),
    ownerContact: z.string().min(1, "Contato do dono é obrigatório"),
});
