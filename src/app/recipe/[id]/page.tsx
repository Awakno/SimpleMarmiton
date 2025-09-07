import React from "react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { prisma } from "@/lib/prisma";

interface RecipePageProps {
  params: { id: string };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({ where: { id } });
  if (!recipe) return notFound();

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-extrabold text-[#e07a5f] mb-2 border-b-2 border-[#e07a5f] pb-2">
        {recipe.title}
      </h1>
      <div className="text-sm text-[#81b29a] mb-6">
        {new Date(recipe.createdAt).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </div>
      <article className="prose prose-lg custom-markdown text-gray-900">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ node, ...props }) => (
              <img
                className="rounded shadow max-h-96 my-4 mx-auto"
                alt=""
                {...props}
              />
            ),
            h1: ({ node, ...props }) => (
              <h1
                className="text-3xl font-bold text-[#e07a5f] mt-6 mb-2"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-2xl font-semibold text-[#81b29a] mt-4 mb-2"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                className="text-xl font-semibold text-[#81b29a] mt-3 mb-1"
                {...props}
              />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-6 my-2 text-[#81b29a]" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol
                className="list-decimal pl-6 my-2 text-[#81b29a]"
                {...props}
              />
            ),
            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            p: ({ node, ...props }) => (
              <p className="my-2 text-gray-900/90" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="text-[#e07a5f] font-semibold" {...props} />
            ),
            em: ({ node, ...props }) => (
              <em className="text-[#81b29a]" {...props} />
            ),
            code: ({ node, ...props }) => (
              <code
                className="bg-gray-100 px-1 rounded text-[#e07a5f]"
                {...props}
              />
            ),
            a: ({ node, ...props }) => (
              <a
                className="text-[#e07a5f] underline hover:text-[#81b29a]"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
            br: () => <br />,
          }}
        >
          {recipe.content}
        </ReactMarkdown>
      </article>
    </main>
  );
}
