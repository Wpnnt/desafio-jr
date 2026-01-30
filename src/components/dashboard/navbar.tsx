import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export async function Navbar() {
    const session = await auth();
    const initial = session?.user?.name?.charAt(0).toUpperCase() || "U";

    return (
        <nav className="border-b bg-white dark:bg-gray-950 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                {/* Simple Logo Placeholder */}
                <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">
                    P
                </div>
                <span className="font-bold text-lg">PetManager</span>
            </div>

            <div className="flex items-center gap-4">
                {session?.user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                                    <AvatarFallback>{initial}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {session.user.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <form
                                    action={async () => {
                                        "use server";
                                        await signOut();
                                    }}
                                    className="w-full"
                                >
                                    <button className="w-full text-left cursor-default">Sair</button>
                                </form>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </nav>
    );
}
