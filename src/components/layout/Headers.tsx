"use client";

import { useRouter } from "next/navigation";
import { Butterfly } from "../icons/Logo";
import { Button } from "../input/Button";
import SearchBar from "../input/SearchBar";
import React, { useState, useEffect } from "react";

export default function Header() {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      setLoadingUser(true);
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
      setLoadingUser(false);
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  const fetchData = async (query: string) => {
    setIsSearching(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.awabot.xyz/api/status?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Erreur réseau ou API.");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      setError(
        "Échec de la recherche. Vérifiez votre connexion ou réessayez plus tard."
      );
      console.error("Error fetching data:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <nav className="backdrop-blur-md bg-white/70 dark:bg-secondary/80 border-b border-gray-200 shadow-md px-2 sm:px-4 py-2 sm:py-3 w-full rounded-b-2xl">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 lg:gap-8 max-w-7xl mx-auto">
          <a
            href="/"
            className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#e07a5f] rounded-full transition"
          >
            <Butterfly className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 hover:scale-105 transition-transform" />
          </a>

          <div className="hidden sm:flex flex-1 justify-end max-w-md lg:max-w-lg mx-2 sm:mx-4">
            <SearchBar onSearch={fetchData} searchLoading={isSearching} />
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            {!loadingUser && !user && (
              <Button
                onClick={() => router.push("/login")}
                className="text-sm sm:text-base px-3 sm:px-4 py-2 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#e07a5f] transition bg-[#e07a5f] text-white"
              >
                Se connecter
              </Button>
            )}
            {!loadingUser && user && (
              <>
                <span className="text-[#81b29a] font-semibold text-sm mr-2 hidden sm:inline">
                  {user.email}
                </span>
                <Button
                  onClick={handleLogout}
                  className="text-sm sm:text-base px-3 sm:px-4 py-2 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#e07a5f] transition bg-[#e07a5f] text-white"
                >
                  Déconnexion
                </Button>
              </>
            )}
            <Button
              onClick={() => router.push("/new")}
              className="text-sm sm:text-base px-3 sm:px-4 py-2 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#e07a5f] transition"
            >
              Créer une recette
            </Button>
          </div>
        </div>
      </nav>

      {error && (
        <div className="w-full bg-red-100 text-red-700 text-center py-2 px-4 text-sm border-b border-red-300 animate-fade-in">
          {error}
        </div>
      )}
    </>
  );
}
