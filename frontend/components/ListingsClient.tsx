"use client";

import { useState, useEffect } from "react";
import PropertyFilters from "./PropertyFilters";
import PropertyCard from "./PropertyCard";
import { fetchAPIClient as fetchAPIClient } from "../lib/fetchAPIClient";
import Pagination from "./Pagination";

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

  const [activeFilters, setActiveFilters] = useState({});

  const [results, setResults] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(total / itemsPerPage);

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, total);


  function handleSearch(filters = {}) {
    setActiveFilters(filters);
    setCurrentPage(1);
    fetchProperties(filters, 1);
  }

  // Passed to PropertyFilters, returns an object for filters
  async function fetchProperties(filters = {}, page = 1) {
    setLoading(true);
    try {
      const offset = (page - 1) * itemsPerPage;
      const params = new URLSearchParams({
        ...filters,
        limit: itemsPerPage.toString(),
        offset: offset.toString(),
      });
      const data = await fetchAPIClient(Object.fromEntries(params));
      setResults(data.results);
      setTotal(data.total);
    } catch {
      setResults([]);
      setTotal(0);
    }
    setLoading(false);
  }


  useEffect(() => { fetchProperties(); }, []); // Search immediately upon loading

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PropertyFilters onSearch={handleSearch} />

      <h2 className="text-xl font-semibold mb-4 text-foreground">
        Showing {start}-{end} of {total} properties
      </h2>

      {/*loading && <p className="text-foreground">Loading…</p>*/}
      {!loading && results.length === 0 && (<p className="text-foreground">
        No properties could be found. Try adjusting your search filters.
      </p>)}

      <div className="column-layout gap-6">
        {results.map(p => ( <PropertyCard key={p.L_ListingID} property={p}/> ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          fetchProperties(activeFilters, page);
        }}
      />
    </div>
  );
}
