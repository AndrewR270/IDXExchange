"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-red-600">
        Failed to load properties
      </h2>
      <p className="text-gray-700">{error.message}</p>
    </div>
  );
}
