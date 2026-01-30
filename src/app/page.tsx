import { auth } from "@/auth";
import { Navbar } from "@/components/dashboard/navbar";
import { PetCard } from "@/components/dashboard/pet-card";
import { PetDialog } from "@/components/dashboard/pet-dialog";
import { SearchInput } from "@/components/dashboard/search-input";
import { prisma } from "@/lib/prisma";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const query = params?.q || "";

  const where: any = {};
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { ownerName: { contains: query, mode: "insensitive" } },
    ];
  }

  const pets = await prisma.pet.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  // Serialization of usage dates to avoid Client Component errors
  const serializedPets = pets.map((pet) => ({
    ...pet,
    createdAt: pet.createdAt.toISOString(),
    updatedAt: pet.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto py-8 px-4 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <SearchInput />
          <PetDialog />
        </div>

        {serializedPets.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Nenhum pet encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serializedPets.map((pet) => (
              <PetCard key={pet.id} pet={pet as any} currentUserId={session?.user?.id} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
