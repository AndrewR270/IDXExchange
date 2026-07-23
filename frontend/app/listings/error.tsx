"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-foreground"> Could not load properties </h2>
      <p className="text-foregound/70">{error.message}</p>
    </div>
  );
}
