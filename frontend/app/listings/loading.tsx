export default function Loading() {
  return (
    <div className="p-6 max-w-7xl mx-auto animate-pulse">
      <h2 className="text-xl font-semibold mb-4">Loading properties…</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-gray-200 h-64 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
