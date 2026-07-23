"use client";
import { useState } from "react";


// Parent passes fetchProperties function as onSearch
export default function PropertyFilters({ onSearch }: { onSearch: (filters: any) => void }) {

  const [filters, setFilters] = useState({
    city: "",
    zipcode: "",
    minPrice: "",
    maxPrice: "",
    beds: "",
    baths: "",
  });

  // Update field with value in filters
  function updateField(field: string, value: string) {
    setFilters(prev => ({ ...prev, [field]: value }));
  }

  // Stops reload, removes empty, and reloads with new params
  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleaned = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""));
    onSearch(cleaned);
  }

  // Removes all params and reloads
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
    <form onSubmit={handleSubmit} className="column-layout gap-2 p-2 rounded-xl bg-element mb-4">
      {/* City Field */}
      <div className="animated-input">
        <span className="text-foreground/60 whitespace-nowrap">City:</span>
        <input type="text" value={filters.city} onChange={e => updateField("city", e.target.value)} className="input"/>
      </div>
      
      {/* ZIP Code Field */}
      <div className="animated-input">
        <span className="text-foreground/60 whitespace-nowrap">ZIP Code:</span>
        <input type="text" value={filters.zipcode} onChange={e => updateField("zipcode", e.target.value)} className="input"/>
      </div>

      {/* Min Price Field */}
      <div className="animated-input">
        <span className="text-foreground/60 whitespace-nowrap">Min Price:</span>
        <input type="number" value={filters.minPrice} onChange={e => updateField("minPrice", e.target.value)} className="input"/>
      </div>

      {/* Max Price Field */}
      <div className="animated-input">
        <span className="text-foreground/60 whitespace-nowrap">Max Price:</span>
        <input type="number" value={filters.maxPrice} onChange={e => updateField("maxPrice", e.target.value)} className="input"/>
      </div>

      {/* Bed Count Dropdown */}
      <select value={filters.beds} onChange={e => updateField("beds", e.target.value)}
        className={`animated-dropdown ${filters.beds === "" ? "text-foreground/60" : "text-foreground"}`}>
        <option value="" disabled hidden>Beds</option>
        <option value="1">At least 1 Bed</option>
        <option value="2">At least 2 Beds</option>
        <option value="3">At least 3 Beds</option>
        <option value="4">At least 4 Beds</option>
      </select>

      {/* Bath Count Dropdown */}
      <select value={filters.baths} onChange={e => updateField("baths", e.target.value)}
        className={`animated-dropdown ${filters.baths === "" ? "text-foreground/60" : "text-foreground"}`}>
        <option value="" disabled hidden>Baths</option>
        <option value="1">At least 1 Bath</option>
        <option value="2">At least 2 Baths</option>
        <option value="3">At least 3 Baths</option>
        <option value="4">At least 4 Baths</option>
      </select>

      <button type="submit" className="search-button">Search</button>
      <button type="button" onClick={handleClear} className="clear-button">Clear</button>

    </form>
  );
}
