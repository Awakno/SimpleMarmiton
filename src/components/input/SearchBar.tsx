"use client";
import { LoupeIcon } from "../icons/Loupe";
import { useState, useEffect } from "react";
import { LoadingIcon } from "../icons/Loading";
import RecipeCard from "@/components/layout/RecipeCard";

type SearchBarProps = {
  onSearch?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  searchLoading?: boolean;
};

export default function SearchBar({
  onSearch,
  onKeyDown,
  searchLoading,
}: SearchBarProps) {
  const [value, setValue] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const isSearching = searchLoading || false;

  useEffect(() => {
    if (value.trim().length === 0) {
      setResults([]);
      setShowResults(false);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/recipe?search=${encodeURIComponent(value)}`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setShowResults(true);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim() !== "") {
      onSearch?.(value);
    }
    onKeyDown?.(e);
  };

  const shouldShowResults = inputFocused && showResults && results.length > 0;

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl shadow-md backdrop-blur-md bg-white/80 border border-gray-200 w-full focus-within:ring-2 focus-within:ring-[#e07a5f] transition">
        <span className="w-7 h-7 flex items-center justify-center">
          {isSearching ? (
            <LoadingIcon className="w-6 h-6" />
          ) : (
            <LoupeIcon className="w-6 h-6" />
          )}
        </span>
        <input
          className="flex-1 bg-transparent outline-none text-base placeholder-gray-500 py-1 min-w-0"
          placeholder="Rechercher une recette..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSearching}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setTimeout(() => setInputFocused(false), 150)}
        />
      </div>
      {shouldShowResults && (
        <div className="absolute left-0 right-0 mt-2 z-50 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto p-2 w-full min-w-0 sm:min-w-[320px]">
          {results.map((recipe) => {
            const card = (
              <RecipeCard
                key={recipe.id}
                {...recipe}
                createdAt={
                  typeof recipe.createdAt === "string"
                    ? recipe.createdAt
                    : new Date(recipe.createdAt).toISOString()
                }
              />
            );
            return (
              <div
                key={recipe.id}
                className="block hover:bg-[#f9dcc4]/60 rounded-lg transition mb-2 last:mb-0 cursor-pointer"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => (window.location.href = `/recipe/${recipe.id}`)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    window.location.href = `/recipe/${recipe.id}`;
                  }
                }}
              >
                {card}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
