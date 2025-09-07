import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const recipe = await prisma.recipe.findUnique({ where: { id: params.id } });
  if (!recipe) return { title: "Recette introuvable" };
  return {
    title: recipe.title,
    description: recipe.content?.slice(0, 150) || "Recette Marmiton",
  };
}
