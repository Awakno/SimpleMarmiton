"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.replace("/login?registered=1");
    } else {
      const data = await res.json();
      setError(data.error || "Erreur lors de l'inscription");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f4f1ee] via-[#f9dcc4] to-[#f4f1ee]">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md text-gray-900 border border-[#e07a5f]/30"
      >
        <h1 className="text-3xl font-extrabold mb-6 text-center text-[#e07a5f]">
          Créer un compte
        </h1>
        {error && (
          <div className="bg-[#ffe5e0] text-[#e07a5f] rounded p-2 mb-4">
            {error}
          </div>
        )}
        <label className="block mb-4">
          <span className="block mb-1 font-semibold text-[#81b29a]">Email</span>
          <input
            type="email"
            className="w-full px-4 py-2 rounded bg-[#f9dcc4]/60 border border-[#e07a5f]/30 focus:outline-none focus:border-[#e07a5f] text-gray-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </label>
        <label className="block mb-6">
          <span className="block mb-1 font-semibold text-[#81b29a]">
            Mot de passe
          </span>
          <input
            type="password"
            className="w-full px-4 py-2 rounded bg-[#f9dcc4]/60 border border-[#e07a5f]/30 focus:outline-none focus:border-[#e07a5f] text-gray-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="w-full bg-[#e07a5f] hover:bg-[#81b29a] transition-colors py-3 rounded-xl font-semibold text-lg text-white disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Création..." : "Créer un compte"}
        </button>
        <div className="text-center mt-4">
          <a href="/login" className="text-[#81b29a] hover:underline">
            Déjà inscrit ? Se connecter
          </a>
        </div>
      </form>
    </main>
  );
}
