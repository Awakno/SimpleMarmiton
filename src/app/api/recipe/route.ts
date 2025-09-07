import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

// Create a new recipe
export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();
    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: "Missing title or content" }),
        { status: 400 }
      );
    }
    const recipe = await prisma.recipe.create({
      data: { title, content },
    });
    return new Response(JSON.stringify(recipe), { status: 201 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to create recipe" }), {
      status: 500,
    });
  }
}

// Get all recipes
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const recipes = await prisma.recipe.findMany({
      where: search
        ? {
            title: {
              contains: search,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });
    return new Response(JSON.stringify(recipes), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to fetch recipes" }), {
      status: 500,
    });
  }
}
