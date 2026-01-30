import { auth } from "@/auth";
import { UserMenu } from "@/modules/user/components/user-menu";

export async function Navbar() {
    const session = await auth();

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
                {session?.user && <UserMenu user={session.user} />}
            </div>
        </nav>
    );
}
