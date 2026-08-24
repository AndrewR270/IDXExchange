"use client";

import { useState, useEffect } from "react";
import PropertyFilters from "./PropertyFilters";
import PropertyCard from "./PropertyCard";
import { fetchPropertyByFilter } from "../api/fetchAPIClient";
import Pagination from "./Pagination";
import SortControls from "./SortControls";
import { SortRule } from "./SortControls";

export default function ListingsClient() {

  // Shape of a property returned from the backend.
  // Only the fields used by the listings page are included.
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

  // Active search filters (city, price, beds, baths, etc.)
  const [activeFilters, setActiveFilters] = useState({});

  // Results returned from the backend.
  const [results, setResults] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);

  // Loading state for showing spinners or empty states.
  const [loading, setLoading] = useState(false);

  // Pagination state.
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Total number of pages based on backend `total`.
  const totalPages = Math.ceil(total / itemsPerPage);

  // Compute the "Showing X–Y of Z" text.
  // start = index of first item on the current page (1-based).
  // end = index of last item, clamped to total.
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, total);

  // Sorting rules (e.g., [{ field: "L_SystemPrice", order: "asc" }])
  // Multiple sort rules are allowed and sent as sortBy[0], sortOrder[0], etc.
  const [sortFields, setSortFields] = useState<SortRule[]>([]);

  // Called when the user submits the filter form.
  // Resets pagination and sorting, then fetches new results.
  function handleSearch(filters = {}) {
    setActiveFilters(filters);
    setCurrentPage(1);
    fetchProperties(filters, 1);
    setSortFields([]);
  }

  // Core function that fetches property results from the backend.
  // Accepts filters, page number, and sorting rules.
  async function fetchProperties(filters = {}, page = 1, sorts: SortRule[] = []) {
    setLoading(true);
    try {
      // Convert page → offset for SQL pagination.
      // offset = (page - 1) * limit
      const offset = (page - 1) * itemsPerPage;

      // Build query parameters for the backend.
      const params = new URLSearchParams({
        ...filters,
        limit: itemsPerPage.toString(),
        offset: offset.toString(),
      });

      // Append sorting rules using indexed keys (sortBy[0], sortOrder[0], etc.)
      // This matches the backend's expected format.
      sorts.forEach((rule, idx) => {
        params.append(`sortBy[${idx}]`, rule.field);
        params.append(`sortOrder[${idx}]`, rule.order);
      });

      // Convert URLSearchParams → plain object for fetchPropertyByFilter.
      const data = await fetchPropertyByFilter(Object.fromEntries(params));

      // Store results + total count.
      setResults(data.results);
      setTotal(data.total);
    } catch {
      // On error, show an empty state instead of crashing the page.
      setResults([]);
      setTotal(0);
    }
    setLoading(false);
  }

  // Add a new sort rule (only if it doesn't already exist).
  function handleAddSort(field: string) {
    if (sortFields.some(s => s.field === field)) return;

    const updated = [...sortFields, { field, order: "asc" as const }];
    setSortFields(updated);

    // Re-fetch results with updated sorting.
    fetchProperties(activeFilters, currentPage, updated);
  }

  // Remove a sort rule by index.
  function handleRemoveSort(index: number) {
    const updated = sortFields.filter((_, i) => i !== index);
    setSortFields(updated);

    fetchProperties(activeFilters, currentPage, updated);
  }

  // Toggle sort order between ASC and DESC.
  function handleToggleSort(index: number) {
    setSortFields(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        order: updated[index].order === "asc" ? "desc" : "asc"
      };

      // Re-fetch with updated sorting.
      fetchProperties(activeFilters, currentPage, updated);
      return updated;
    });
  }

  // Initial load: fetch first page with no filters.
  useEffect(() => { fetchProperties(); }, []);

  return (
    <div className="mx-auto">
      {/* Sticky filter bar so filters remain visible while scrolling */}
      <div className="w-full bg-element sticky top-0 z-50">
        <div className="w-full px-6 py-4">
          <PropertyFilters onSearch={handleSearch} />
        </div>
      </div>

      <div className="p-6">
        {/* Header showing result count + sorting controls */}
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Showing {start}-{end} of {total} properties
          </h2>

          <SortControls
            sortFields={sortFields}
            onAddSort={handleAddSort}
            onRemoveSort={handleRemoveSort}
            onToggleSort={handleToggleSort}
          />
        </div>

        {/* Empty state when no results match the filters */}
        {!loading && results.length === 0 && (
          <p className="text-foreground">
            No properties could be found. Try adjusting your search filters.
          </p>
        )}

        {/* Property cards */}
        <div className="column-layout gap-6">
          {results.map(p => (
            <PropertyCard key={p.L_ListingID} property={p}/>
          ))}
        </div>

        {/* Pagination controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            fetchProperties(activeFilters, page);
          }}
        />
      </div>
    </div>
  );
}
