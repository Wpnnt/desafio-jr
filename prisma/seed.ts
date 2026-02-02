import { PrismaClient, PetType } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import path from "path";
import * as bcrypt from "bcryptjs";

// Ensure .env is loaded from project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing!");
    process.exit(1);
}

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DOG_BREEDS = [
    "Srd (Vira-lata)",
    "Labrador Retriever",
    "Golden Retriever",
    "Bulldog Francês",
    "Pastor Alemão",
    "Poodle",
    "Bulldog Inglês",
    "Rottweiler",
    "Yorkshire Terrier",
    "Shih Tzu",
    "Border Collie",
    "Beagle",
    "Pug",
];

const CAT_BREEDS = [
    "Srd (Vira-lata)",
    "Persa",
    "Siamês",
    "Maine Coon",
    "Angorá",
    "Ragdoll",
    "Sphynx",
    "Bengal",
];

async function main() {
    console.log("Start seeding...");

    // 1. Seed Breeds
    for (const name of DOG_BREEDS) {
        await prisma.breed.upsert({
            where: { name_type: { name, type: "DOG" } },
            update: {},
            create: { name, type: "DOG" },
        });
    }

    for (const name of CAT_BREEDS) {
        await prisma.breed.upsert({
            where: { name_type: { name, type: "CAT" } },
            update: {},
            create: { name, type: "CAT" },
        });
    }

    // 2. Seed Default User
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await prisma.user.upsert({
        where: { email: "admin@test.com" },
        update: {},
        create: {
            email: "admin@test.com",
            name: "Vitor Admin",
            password: hashedPassword,
        },
    });

    console.log(`Created user: ${user.email}`);

    // 3. Seed Sample Pets
    const samplePets = [
        {
            name: "Bento",
            age: 5,
            type: PetType.DOG,
            breed: "Beagle",
            ownerName: "Ricardo",
            ownerContact: "21977665544",
            image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800",
            userId: user.id
        },
        {
            name: "Luna",
            age: 2,
            type: PetType.CAT,
            breed: "Siamês",
            ownerName: "Ana",
            ownerContact: "21988887777",
            image: "https://www.whiskas.com.br/sites/g/files/fnmzdf2156/files/2024-10/gato-siames-02.jpg",
            userId: user.id
        },
        {
            name: "Thor",
            age: 3,
            type: PetType.DOG,
            breed: "Golden Retriever",
            ownerName: "Carlos",
            ownerContact: "21977776666",
            image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800",
            userId: user.id
        },
        {
            name: "Mel",
            age: 1,
            type: PetType.DOG,
            breed: "Bulldog Francês",
            ownerName: "Mariana",
            ownerContact: "21966665555",
            image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800",
            userId: user.id
        },
        {
            name: "Oliver",
            age: 4,
            type: PetType.CAT,
            breed: "Maine Coon",
            ownerName: "Julia",
            ownerContact: "21955554444",
            image: "https://blog-static.petlove.com.br/wp-content/uploads/2018/05/Maine-Coon.jpg",
            userId: user.id
        },
        {
            name: "Max",
            age: 6,
            type: PetType.DOG,
            breed: "Husky Siberiano",
            ownerName: "Fabio",
            ownerContact: "21944443333",
            image: "https://drk9.com.br/wp-content/uploads/2025/10/AdobeStock_100800827-scaled-1.jpeg",
            userId: user.id
        }
    ];

    for (const petData of samplePets) {
        // Find existing pet by name and owner to avoid duplication
        const existingPet = await prisma.pet.findFirst({
            where: {
                name: petData.name,
                ownerName: petData.ownerName,
                userId: petData.userId
            }
        });

        if (existingPet) {
            await prisma.pet.update({
                where: { id: existingPet.id },
                data: petData
            });
        } else {
            await prisma.pet.create({
                data: petData
            });
        }
    }

    console.log("Seeding finished successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
