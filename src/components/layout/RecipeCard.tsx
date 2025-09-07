import { useRouter } from "next/navigation";
import React from "react";

interface RecipeCardProps {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function RecipeCard({
  id,
  title,
  content,
  createdAt,
}: RecipeCardProps) {
  const contentWithImage = content.replace(/!\[[^\]]*\]\([^\)]*\)/g, "");
  const excerpt =
    contentWithImage.replace(/[#*_`>\-\[\]!\(\)]/g, "").slice(0, 180) +
    (contentWithImage.length > 180 ? "..." : "");
  const date = new Date(createdAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const router = useRouter();

  return (
    <div className="group rounded-2xl bg-white border border-[#e07a5f]/10 shadow-lg hover:shadow-2xl transition p-3 sm:p-5 flex flex-col gap-2 cursor-pointer hover:-translate-y-1">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <span className="text-xs text-[#81b29a] font-semibold uppercase tracking-wider bg-[#e07a5f]/10 px-2 py-0.5 rounded">
          {date}
        </span>
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-[#e07a5f] group-hover:text-[#81b29a] transition mb-1 truncate">
        {title}
      </h3>
      <p className="text-gray-700 text-sm sm:text-base mb-2 line-clamp-3 min-h-[3.5em]">
        {excerpt}
      </p>
      <div className="flex justify-end mt-2">
        <a
          onClick={() => router.push(`/recipe/${id}`)}
          className="text-[#81b29a] font-semibold hover:text-[#e07a5f] underline underline-offset-2 text-sm transition"
        >
          Voir la recette
        </a>
      </div>
    </div>
  );
}
