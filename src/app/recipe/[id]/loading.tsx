export default function LoadingRecipe() {
  return (
    <main className="max-w-2xl mx-auto py-10 px-4 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-2/3 mb-4" />
      <div className="h-4 bg-gray-100 rounded w-1/4 mb-8" />
      <div className="h-72 bg-gray-100 rounded mb-6" />
      <div className="space-y-4">
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-5/6" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
      </div>
    </main>
  );
}
