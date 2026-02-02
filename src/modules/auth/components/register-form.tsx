"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RegisterSchema } from "@/modules/auth/schemas";
import { Input } from "@/shared/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/components/ui/form";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";
import { AuthTabs } from "./auth-tabs";
import { Mail, Lock, User } from "lucide-react";

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
        },
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");

        startTransition(async () => {
            try {
                const response = await fetch("/api/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.error);
                } else {
                    setSuccess(data.success);
                    setTimeout(() => {
                        router.push("/login");
                    }, 2000);
                }
            } catch (err) {
                console.error(err);
                setError("Algo deu errado.");
            }
        });
    };

    return (
        <div className="w-full">
            <AuthTabs />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-400 font-medium">Nome</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="Seu nome completo"
                                                className="pl-10 h-12 bg-background border-input focus-visible:ring-primary focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground rounded-lg"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-400 font-medium">E-mail</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="seu@email.com"
                                                type="email"
                                                className="pl-10 h-12 bg-background border-input focus-visible:ring-primary focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground rounded-lg"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-400 font-medium">Senha</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <Lock className="h-5 w-5" />
                                            </div>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="••••••"
                                                type="password"
                                                className="pl-10 h-12 bg-background border-input focus-visible:ring-primary focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground rounded-lg"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {error && <div className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
                    {success && <div className="text-sm text-green-500 font-medium bg-green-50 p-3 rounded-lg border border-green-100">{success}</div>}

                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.01]"
                    >
                        {isPending ? "Criando conta..." : "Criar Conta"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};
