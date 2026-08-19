"use client";

import { useState, useEffect } from "react";

interface PropertyImageGalleryProps {
  photos: string | null | undefined; // L_Photos is a JSON string
}

export default function PropertyImageGallery({ photos }: PropertyImageGalleryProps) {
  let parsed: string[] = [];

  try {
    const result = JSON.parse(photos || "[]");
    if (Array.isArray(result)) {
      parsed = result as string[];
    }
  } catch { parsed = []; }

  const [index, setIndex] = useState<number>(0);
  const [lightbox, setLightbox] = useState<boolean>(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!lightbox) return;

      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") {
        setIndex((i) => (i === 0 ? parsed.length - 1 : i - 1));
      }
      if (e.key === "ArrowRight") {
        setIndex((i) => (i === parsed.length - 1 ? 0 : i + 1));
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [lightbox, parsed.length]);

  if (parsed.length === 0) return null;

  return (
    <div>
      <img
        src={parsed[index]}
        className="aspect-[16/9] w-full object-cover rounded-2xl cursor-pointer"
        onClick={() => setLightbox(true)}
        alt="Property photo"
      />

      <div className="flex gap-2 mt-2 overflow-x-auto">
        {parsed.map((p, i) => (
          <img
            key={i}
            src={p}
            className={`h-20 w-32 object-cover rounded-2xl cursor-pointer ${
              i === index ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setIndex(i)}
            alt={`Thumbnail ${i + 1}`}
          />
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <img
            src={parsed[index]}
            className="max-h-[90%] max-w-[90%]"
            alt="Lightbox photo"
          />
        </div>
      )}
    </div>
  );
}
