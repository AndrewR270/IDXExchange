"use client";

import { useState } from "react";

interface PropertyImageCarouselProps {
  photos: string | null | undefined; // L_Photos is a JSON string
}

// The listing API preserves the database representation, so parsing happens
// at the component boundary and the carousel works with a normal string array.
export default function PropertyImageCarousel({ photos }: PropertyImageCarouselProps) {
  // parsed photos will always be string[]
  let parsed: string[] = [];

  try {
    const result = JSON.parse(photos || "[]");
    if (Array.isArray(result)) {
      parsed = result as string[];
    }
  } catch {
    parsed = [];
  }

  const [index, setIndex] = useState<number>(0);

  if (parsed.length === 0) return null;

  function prev(e: React.MouseEvent<HTMLButtonElement>) {
    // The card is clickable; stop the control event from bubbling into its link.
    e.stopPropagation();
    setIndex((i) => (i === 0 ? parsed.length - 1 : i - 1));
  }

  function next(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setIndex((i) => (i === parsed.length - 1 ? 0 : i + 1));
  }

  return (
    <div className="relative">
      <img
        src={parsed[index]}
        className="w-full h-48 object-cover rounded"
        alt="Property photo"
      />
      
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 px-2 py-1 rounded"
      >◀</button>

      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 px-2 py-1 rounded"
      >▶</button>

      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded">
        {index + 1} / {parsed.length}
      </div>
    </div>
  );
}
