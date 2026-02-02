"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoginSchema } from "@/modules/auth/schemas";
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
import { login } from "@/modules/auth/actions/login";
import { AuthTabs } from "./auth-tabs";
import { Mail, Lock } from "lucide-react";

export const LoginForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            login(values).then((data) => {
                if (data?.error) {
                    setError(data.error);
                }
            });
        });
    };

    return (
        <div className="w-full">
            <AuthTabs />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
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
                                                placeholder="username@gmail.com"
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

                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]"
                    >
                        {isPending ? "Entrando..." : "Entrar"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};
