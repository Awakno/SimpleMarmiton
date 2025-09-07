export default function NotFoundRecipe() {
  return (
    <main className="max-w-2xl mx-auto py-10 px-4 text-center">
      <h1 className="text-3xl font-bold text-[#e07a5f] mb-4">
        Recette introuvable
      </h1>
      <p className="text-gray-600 mb-6">
        La recette demandée n'existe pas ou a été supprimée.
      </p>
      <a href="/" className="text-[#e07a5f] underline hover:text-[#81b29a]">
        Retour à l'accueil
      </a>
    </main>
  );
}
