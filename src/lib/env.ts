import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    AUTH_SECRET: z.string().min(1),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error(
        "❌ Invalid environment variables:",
        _env.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
}

export const env = _env.data;
