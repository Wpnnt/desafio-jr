"use client";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User } from "next-auth";
import { Button } from "@/shared/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { ProfileSchema } from "../schemas";
import { updateUser } from "../actions";
import { useRouter } from "next/navigation";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/components/ui/form";
import { User as UserIcon, ShieldCheck, Mail, Lock, AlertCircle, Edit2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileDialogProps {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ user, open, onOpenChange }: ProfileDialogProps) {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState<string | undefined>();
    const [error, setError] = useState<string | undefined>();
    const [isEmailChanging, setIsEmailChanging] = useState(false);
    const [isPasswordChanging, setIsPasswordChanging] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            name: user.name || "",
            email: user.email || "",
            originalEmail: user.email || "",
            currentPassword: "",
            newPassword: "",
        },
    });

    const onSubmit = (values: z.infer<typeof ProfileSchema>) => {
        setError(undefined);
        setSuccess(undefined);

        startTransition(async () => {
            const res = await updateUser(values);
            if (res.success) {
                setSuccess(res.success);
                setIsEmailChanging(false);
                setIsPasswordChanging(false);
                setTimeout(() => {
                    onOpenChange(false);
                    setSuccess(undefined);
                }, 2000);

                form.reset({
                    name: values.name,
                    email: values.email,
                    originalEmail: values.email,
                    currentPassword: "",
                    newPassword: "",
                });
                router.refresh();
            } else if (res.error) {
                if (res.error === "Senha atual incorreta") {
                    form.setError("currentPassword", { message: res.error });
                } else if (res.error === "Senha atual é necessária para alterar e-mail ou senha") {
                    form.setError("currentPassword", { message: res.error });
                } else if (res.error === "Este e-mail já está em uso") {
                    form.setError("email", { message: res.error });
                } else if (res.error === "Dados inválidos") {
                    setError("Verifique os campos e tente novamente.");
                } else {
                    setError(res.error);
                }
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Perfil</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Seção: Identificação */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                                <UserIcon className="h-4 w-4 text-primary" />
                                <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Identificação</h3>
                            </div>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-tight text-muted-foreground ml-1">Nome Completo</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isPending} className="bg-muted/20 dark:bg-muted/5 border-border focus-visible:ring-primary/20 focus-visible:border-primary h-12 rounded-xl px-4 font-bold" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <div className="flex items-center justify-between px-1">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">E-mail</FormLabel>
                                            {!isEmailChanging ? (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 text-[10px] font-black uppercase tracking-tighter text-primary hover:bg-primary/10 rounded-full"
                                                    onClick={() => setIsEmailChanging(true)}
                                                >
                                                    <Edit2 className="h-2.5 w-2.5 mr-1" /> Alterar
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 text-[10px] font-black uppercase tracking-tighter text-muted-foreground hover:bg-muted rounded-full"
                                                    onClick={() => {
                                                        setIsEmailChanging(false);
                                                        form.setValue("email", user.email || "");
                                                    }}
                                                >
                                                    Cancelar
                                                </Button>
                                            )}
                                        </div>
                                        <FormControl>
                                            <div className="relative group">
                                                <Input
                                                    {...field}
                                                    disabled={isPending || !isEmailChanging}
                                                    className={cn(
                                                        "bg-muted/20 dark:bg-muted/5 border-border focus-visible:ring-primary/20 focus-visible:border-primary h-12 rounded-xl px-4 font-bold transition-all",
                                                        !isEmailChanging && "opacity-60 cursor-not-allowed bg-muted/10 border-dashed"
                                                    )}
                                                />
                                                {!isEmailChanging && <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Seção: Segurança */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Segurança</h3>
                            </div>

                            {(isEmailChanging || isPasswordChanging) ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-tight">Verificação Necessária</p>
                                            <p className="text-[11px] text-orange-600/80 dark:text-orange-400/80 font-medium leading-relaxed">
                                                Confirme sua <strong>Senha Atual</strong> para autorizar as mudanças sensíveis.
                                            </p>
                                        </div>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase tracking-tight text-muted-foreground ml-1">Senha Atual</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="password" disabled={isPending} placeholder="Digite sua senha atual" className="bg-muted/20 dark:bg-muted/5 border-border focus-visible:ring-primary/20 focus-visible:border-primary h-12 rounded-xl px-4 font-bold" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {isPasswordChanging && (
                                        <FormField
                                            control={form.control}
                                            name="newPassword"
                                            render={({ field }) => (
                                                <FormItem className="animate-in zoom-in-95 duration-200">
                                                    <FormLabel className="text-[10px] font-black uppercase tracking-tight text-muted-foreground ml-1">Nova Senha</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="password" disabled={isPending} placeholder="Mínimo 6 caracteres" className="bg-muted/20 dark:bg-muted/5 border-border focus-visible:ring-primary/20 focus-visible:border-primary h-12 rounded-xl px-4 font-bold" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    {isPasswordChanging && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="w-full h-8 text-[10px] font-black uppercase tracking-tighter text-muted-foreground hover:bg-muted rounded-xl"
                                            onClick={() => {
                                                setIsPasswordChanging(false);
                                                form.setValue("newPassword", "");
                                            }}
                                        >
                                            Manter senha atual
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-12 rounded-xl border-dashed border-2 border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group"
                                    onClick={() => setIsPasswordChanging(true)}
                                >
                                    <Lock className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" /> Alterar Senha de Acesso
                                </Button>
                            )}
                        </div>

                        <div className="space-y-3 pt-2">
                            {error && (
                                <div className="bg-destructive/15 p-4 rounded-xl flex items-center gap-x-3 text-xs text-destructive font-black uppercase tracking-tight animate-in shake-1 duration-300">
                                    <AlertCircle className="h-4 w-4" />
                                    <p>{error}</p>
                                </div>
                            )}
                            {success && (
                                <div className="bg-emerald-500/15 p-4 rounded-xl flex items-center gap-x-3 text-xs text-emerald-500 font-black uppercase tracking-tight animate-in zoom-in-95">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <p>{success}</p>
                                </div>
                            )}
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] h-14 rounded-2xl transition-all shadow-xl shadow-primary/20 active:scale-[0.98] text-xs"
                                >
                                    {isPending ? "Processando..." : "Salvar Configurações"}
                                </Button>
                            </DialogFooter>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
