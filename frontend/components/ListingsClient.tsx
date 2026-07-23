"use client";

import { useState, useEffect } from "react";
import PropertyFilters from "./PropertyFilters";
import PropertyCard from "./PropertyCard";
import { fetchAPIClient as fetchAPIClient } from "@/lib/fetchAPIClient";

export default function ListingsClient() {

  // Property shape with all fields
  type Property = {
    L_ListingID: string;
    L_Photos: string;
    L_SystemPrice: number;
    L_Address: string;
    L_City: string;
    L_State: string;
    L_Keyword2: number;
    LM_Dec_3: number;
    LM_Int2_3: number;
  };

  const [results, setResults] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Passed to PropertyFilters, returns an object for filters
  async function fetchProperties(filters = {}) {
    setLoading(true);

    try {
      // Converts search filters into URL string and fetches
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/properties?${params}`);
      const data = await fetchAPIClient(filters);

      setResults(data.results);
      setTotal(data.total);
    } catch (err) {
      setResults([]);
      setTotal(0);
    }

    setLoading(false);
  }

  useEffect(() => { fetchProperties(); }, []); // Search immediately upon loading

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PropertyFilters onSearch={fetchProperties} />

      <h2 className="text-xl font-semibold mb-4 text-foreground">Showing {results.length} of {total} properties</h2>

      {/*loading && <p className="text-foreground">Loading…</p>*/}
      {!loading && results.length === 0 && (<p className="text-foreground">
        No properties could be found. Try adjusting your search filters.
      </p>)}

      <div className="column-layout gap-6">
        {results.map(p => ( <PropertyCard key={p.L_ListingID} property={p}/> ))}
      </div>
    </div>
  );
}
