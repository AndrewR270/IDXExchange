"use client";
import { useState } from "react";

export default function PropertyFilters({ onSearch }: { onSearch: (filters: any) => void }) {

  const [filters, setFilters] = useState({
    city: "",
    zipcode: "",
    minPrice: "",
    maxPrice: "",
    beds: "",
    baths: "",
  });

  function updateField(field: string, value: string) {
    setFilters(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleaned = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "")
    );
    onSearch(cleaned);
  }

  function handleClear() {
    setFilters({
      city: "",
      zipcode: "",
      minPrice: "",
      maxPrice: "",
      beds: "",
      baths: "",
    });
    onSearch({});
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-6 w-full"
    >
      {/* Logo */}
      <img
        className="idx-logo h-10"
        alt="IDXExchange"
      />

      {/* Filters */}
      <div className="grid grid-cols-18 gap-4 flex-1">

        {/* City */}
        <div className="col-span-4 animated-input flex items-center gap-1 w-full">
          <span className="text-foreground/60 whitespace-nowrap">City:</span>
          <input
            type="text"
            value={filters.city}
            onChange={e => updateField("city", e.target.value)}
            className="input w-full"
          />
        </div>

        {/* ZIP */}
        <div className="col-span-2 animated-input flex items-center gap-1 w-full">
          <span className="text-foreground/60 whitespace-nowrap">ZIP:</span>
          <input
            type="text"
            value={filters.zipcode}
            onChange={e => updateField("zipcode", e.target.value)}
            className="input w-full"
          />
        </div>

        {/* Price Range */}
        <div className="col-span-5 animated-input flex items-center w-full">
          <span className="text-foreground/60 whitespace-nowrap">Price Range:</span>

          <input
            type="number"
            placeholder="Any"
            value={filters.minPrice}
            onChange={e => updateField("minPrice", e.target.value)}
            className="input w-3/8"
          />

          <span className="text-foreground/60 mr-2">–</span>

          <input
            type="number"
            placeholder="Any"
            value={filters.maxPrice}
            onChange={e => updateField("maxPrice", e.target.value)}
            className="input w-1/2"
          />
        </div>

        {/* Beds */}
        <div className="col-span-2 flex items-center gap-2 w-full">
          <select
            value={filters.beds}
            onChange={e => updateField("beds", e.target.value)}
            className={`animated-dropdown w-full ${filters.beds === "" ? "text-foreground/60" : "text-foreground"}`}
          >
            <option value="" disabled hidden>Beds</option>
            <option value="1">1+ Beds</option>
            <option value="2">2+ Beds</option>
            <option value="3">3+ Beds</option>
            <option value="4">4+ Beds</option>
          </select>
        </div>

        {/* Baths */}
        <div className=" col-span-2 flex items-center gap-2 w-full">
          <select
            value={filters.baths}
            onChange={e => updateField("baths", e.target.value)}
            className={`animated-dropdown w-full ${filters.baths === "" ? "text-foreground/60" : "text-foreground"}`}
          >
            <option value="" disabled hidden>Baths</option>
            <option value="1">1+ Baths</option>
            <option value="2">2+ Baths</option>
            <option value="3">3+ Baths</option>
            <option value="4">4+ Baths</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="col-span-2 flex items-center gap-2 w-full">
          <button type="submit" className="primary-button px-4 py-2 w-full">
            Search
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="secondary-button px-4 py-2 w-full"
          >
            Clear
          </button>
        </div>

      </div>
    </form>
  );
}