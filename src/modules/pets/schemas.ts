import * as z from "zod";

export const PetSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    age: z.coerce.number().min(0, "A idade deve ser maior ou igual a 0"),
    type: z.enum(["DOG", "CAT"]),
    breed: z.string().min(1, "Raça é obrigatória"),
    ownerName: z.string().min(1, "Nome do dono é obrigatório"),
    ownerContact: z.string().min(1, "Contato do dono é obrigatório"),
    image: z.string().optional(),
});
