import { fetchPropertyByID } from "@/src/api/fetchAPIClient";
import { fetchOpenHouses } from "@/src/api/fetchAPIClient";
import PropertyImageGallery from "@/src/components/PropertyImageGallery";
import PropertyMap from "@/src/components/PropertyMap";
import OpenHouses from "@/src/components/OpenHouses";

import Link from "next/link";

interface PropertyDetailPageProps { params: { id: string }; }

// Server component for the property detail page.
// Runs on the server so API calls happen securely and without exposing backend URLs to the client.
export default async function PropertyDetailPage(props: PropertyDetailPageProps) {
  const { id } = await props.params;

  // Fetch property + open houses. If either request fails, fall back to null.
  // This prevents the entire page from crashing due to a backend or network error.
  let property = null;
  let openhouses = null;

  try { 
    property = await fetchPropertyByID(id); 
    openhouses = await fetchOpenHouses(id);
  }
  catch { 
    property = null; 
    openhouses = null;
  }

  // If the backend returns an error or the property doesn't exist,
  // show a user-friendly fallback instead of throwing an exception.
  if (!property || property.error) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Property not found</h1>
        <p>This listing ID does not exist.</p>
      </div>
    );
  }

  // Parse the photo JSON string. MLS data is inconsistent, so parsing must be defensive.
  // If parsing fails or the array is empty, the page gracefully falls back to no gallery.
  let hasPhotos = false;
  let mainPhoto = null;

  try { 
    const res = JSON.parse(property.L_Photos);
    if (Array.isArray(res) && res.length > 0) { 
      hasPhotos = true; 
      mainPhoto = res[0]; // Use the first photo as the hero background.
    }
  } catch { 
    hasPhotos = false; 
    mainPhoto = null; 
  }

  return (
    <div className="relative">
      {/* Background hero image. 
         Applied with low opacity so the foreground content remains readable. */}
      {mainPhoto && (
        <div
          className="
            absolute inset-0 
            bg-cover bg-center  
            opacity-30
            dark:opacity-30
            -z-10
          "
          style={{ backgroundImage: `url(${mainPhoto})` }}
        />
      )}

      <div className="p-6 grid grid-cols-3 gap-6 relative z-10">

        {/* LEFT COLUMN (2/3) — main property content */}
        <div className="col-span-2 space-y-6">

          {/* HERO SECTION — image gallery + address + price */}
          <div className="relative">
            {/* Only render gallery if photos exist and parsed successfully */}
            {hasPhotos && <PropertyImageGallery photos={property.L_Photos} />}

            <div className="absolute top-0 left-0 w-full p-6 
              bg-gradient-to-t from-black/80 to-black/20
              text-white rounded-t-2xl">

              <div className="flex items-center gap-4">
                {/* Back button to listings */}
                <Link href="/listings" className="text-4xl font-bold">↶</Link>

                {/* Address + price */}
                <h1 className="text-3xl font-bold">{property.L_Address}</h1>
                <p className="text-3xl font-light">${property.L_SystemPrice}</p>
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-3 mt-3">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  {property.L_Keyword2} beds
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  {property.LM_Dec_3} baths
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  {property.LM_Int2_3} sqft
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  Built {property.YearBuilt}
                </span>
              </div>
            </div>
          </div>

          {/* OPEN HOUSES — shows scheduled events or an empty state */}
          <div className={`p-4 rounded-2xl shadow-sm bg-background/80 ${hasPhotos ? "" : "mt-35"}`}>
            <h2 className="text-xl font-semibold mb-2">Open Houses</h2>
            <OpenHouses openHouses={openhouses} />
          </div>
        </div>

        {/* RIGHT COLUMN (1/3) — description + map */}
        <div className="col-span-1 flex flex-col gap-6">

          {/* DESCRIPTION — scrollable to avoid layout overflow */}
          <div className="p-4 rounded-2xl shadow-sm bg-background/80">
            <h2 className="text-xl text-foreground font-semibold mb-2">Description</h2>
            <div className="max-h-[45vh] overflow-y-auto">
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {property.L_Remarks}
              </p>
            </div>
          </div>

          {/* MAP — uses lat/lng from the property record */}
          <div className="p-4 rounded-2xl shadow-sm bg-background/80">
            <h2 className="text-xl font-semibold mb-2">Map</h2>
            <PropertyMap lat={property.LMD_MP_Latitude} lng={property.LMD_MP_Longitude} />
          </div>
        </div>
      </div>
    </div>
  );
}
