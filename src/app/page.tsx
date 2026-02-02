import { auth } from "@/auth";
import { Navbar } from "@/modules/pets/components/navbar";
import { PetCard } from "@/modules/pets/components/pet-card";
import { PetDialog } from "@/modules/pets/components/pet-dialog";
import { SearchInput } from "@/modules/pets/components/search-input";
import { StatsCards } from "@/modules/pets/components/stats-cards";
import { PetEmptyState } from "@/modules/pets/components/pet-empty-state";
import { Pagination } from "@/shared/components/ui/pagination";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q, type, page } = await searchParams;
  const session = await auth();

  const currentPage = Number(page) || 1;
  const itemsPerPage = 6;
  const skip = (currentPage - 1) * itemsPerPage;

  // Base filter for stats (only search query)
  const baseWhere: any = {
    AND: [
      {
        OR: q
          ? [
            { name: { contains: q.toString(), mode: "insensitive" } },
            { breed: { contains: q.toString(), mode: "insensitive" } },
            { ownerName: { contains: q.toString(), mode: "insensitive" } },
          ]
          : undefined,
      },
    ].filter(Boolean), // Filter out undefined if q is not present
  };

  // Filter for the actual pet list (search query + type)
  const queryWhere: any = {
    AND: [
      ...baseWhere.AND,
      {
        type: type && (type === "DOG" || type === "CAT") ? (type as "DOG" | "CAT") : undefined,
      },
    ].filter(Boolean), // Filter out undefined if type is not present
  };

  // Run queries in parallel
  const [pets, totalGlobalCount, dogsCount, catsCount, totalQueryCount] = await Promise.all([
    prisma.pet.findMany({
      where: queryWhere,
      orderBy: { createdAt: "desc" },
      skip,
      take: itemsPerPage,
    }),
    prisma.pet.count({ where: baseWhere }),
    prisma.pet.count({ where: { AND: [...baseWhere.AND, { type: "DOG" }].filter(Boolean) } }),
    prisma.pet.count({ where: { AND: [...baseWhere.AND, { type: "CAT" }].filter(Boolean) } }),
    prisma.pet.count({ where: queryWhere }),
  ]);

  const totalPages = Math.ceil(totalQueryCount / itemsPerPage);

  // BUG FIX: Redirection for orphan pages after deletion
  // If we are on a page that no longer exists (e.g. page 2 but only 1 page remains)
  // we redirect to the last valid page.
  if (currentPage > totalPages && totalPages > 0) {
    const params = new URLSearchParams();
    if (q) params.set("q", q.toString());
    if (type) params.set("type", type.toString());
    params.set("page", totalPages.toString());

    const { redirect } = await import("next/navigation");
    redirect(`/?${params.toString()}`);
  }

  // Serialization of usage dates to avoid Client Component errors
  const serializedPets = pets.map((pet: any) => ({
    ...pet,
    createdAt: pet.createdAt.toISOString(),
    updatedAt: pet.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />
      <main className="container mx-auto py-8 px-4 md:px-6 relative z-10">
        {/* Stats Section */}
        <StatsCards total={totalGlobalCount} dogs={dogsCount} cats={catsCount} />

        {/* Action Header */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10 max-w-4xl mx-auto">
          <div className="w-full flex-1">
            <SearchInput />
          </div>
          <div className="hidden md:block">
            <PetDialog
              trigger={
                <Button className="group font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl h-12 px-8 shadow-lg hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer border-0 whitespace-nowrap">
                  <Plus className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-90" /> Cadastrar Pet
                </Button>
              }
            />
          </div>
        </div>

        {/* Mobile FAB */}
        <div className="fixed bottom-6 right-6 z-50 md:hidden">
          <PetDialog
            trigger={
              <Button className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-orange-500/40 flex items-center justify-center p-0 border-0 active:scale-90 transition-transform">
                <Plus className="h-8 w-8" />
              </Button>
            }
          />
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {serializedPets.length === 0 ? (
            <PetEmptyState />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {serializedPets.map((pet) => (
                  <PetCard key={pet.id} pet={pet as any} currentUserId={session?.user?.id} />
                ))}
              </div>
              <Pagination totalPages={totalPages} currentPage={currentPage} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
