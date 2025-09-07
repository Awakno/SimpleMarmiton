"use client";

import useSWR from "swr";
import RecipeCard from "@/components/layout/RecipeCard";
import { LoadingIcon } from "@/components/icons/Loading";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error } = useSWR<any[]>("/api/recipe", fetcher);

  if (error) return <div>Failed to load recipes</div>;
  if (!data)
    return (
      <div className="flex justify-center mt-4">
        <LoadingIcon />
      </div>
    );

  return (
    <>
      <main className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Bienvenue sur Marmiton !</h1>
          <p className="text-lg text-gray-700">
            Découvrez nos délicieuses recettes.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {!data || data.length === 0 ? (
            <div className="col-span-3 text-center text-lg text-gray-700">
              Aucune recette trouvée
            </div>
          ) : (
            data.map((recipe: any) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))
          )}
        </div>
      </main>
    </>
  );
}
