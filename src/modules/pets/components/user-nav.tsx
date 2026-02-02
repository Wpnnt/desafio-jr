"use client";

import { useState } from "react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import { LogOut, User as UserIcon } from "lucide-react";
import { ProfileDialog } from "@/modules/user/components/profile-dialog";

interface UserNavProps {
    user: User;
}

export function UserNav({ user }: UserNavProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <>
            <div className="flex items-center gap-4 md:gap-8">
                <button
                    onClick={() => setIsProfileOpen(true)}
                    className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-primary transition-colors border-none bg-transparent p-0"
                >
                    <UserIcon className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors hidden md:inline truncate max-w-[150px]">
                        {user.email}
                    </span>
                    <span className="text-sm font-medium md:hidden">Perfil</span>
                </button>
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-primary transition-colors border-none bg-transparent p-0"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Sair</span>
                </button>
            </div>

            <ProfileDialog
                user={user}
                open={isProfileOpen}
                onOpenChange={setIsProfileOpen}
            />
        </>
    );
}
