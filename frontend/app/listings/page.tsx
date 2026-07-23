import PropertyCard from "@/components/PropertyCard";

export default async function ListingsPage() {
  const res = await fetch("http://localhost:5000/api/properties?limit=20", { cache: "no-store", });
  if (!res.ok) { throw new Error("Backend unreachable or returned an error"); }

  const data = await res.json();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-xl text-foreground font-semibold mb-4"> 
        Showing {data.results.length} of {data.total} properties 
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.results.map((p: any) => ( 
          <PropertyCard key={p.L_ListingID} property={p} /> 
        ))}
      </div>
    </div>
  );
}
