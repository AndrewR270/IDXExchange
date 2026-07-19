export default function PropertyCard({ property }: { property: any }) {
  // Defensive photo parsing
  let photoUrl = "";

  try {
    const photos = JSON.parse(property.L_Photos);
    if (Array.isArray(photos) && photos.length > 0) {
      photoUrl = photos[0];
    }
  } catch {
    photoUrl = "";
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] transform transition-all duration-200 flex flex-col">
      {photoUrl ? (
        <img src={photoUrl} alt="Property" className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
          No photo available
        </div>
      )}

      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-gray-900">
          ${property.L_SystemPrice?.toLocaleString()}
        </h3>

        <p className="text-gray-700">{property.L_Address}</p>
        <p className="text-gray-600">
          {property.L_City}, {property.L_State}
        </p>

        <p className="text-gray-500 text-sm mt-2">
          {property.L_Keyword2} beds • {property.LM_Dec_3} baths • {property.LM_Int2_3} sqft
        </p>
      </div>
    </div>
  );
}
