export default function PropertyCard({ property }: { property: any }) {

  let photoUrl;
  try { const photos = JSON.parse(property.L_Photos);
    if (Array.isArray(photos) && photos.length > 0) { photoUrl = photos[0]; }
  } catch { photoUrl = ""; }

  return (
    <div className="property-card">

      {photoUrl ? (<img src={photoUrl} alt="Property" className="w-full h-48 object-cover" />) 
      : (<div className="no-photo">No photo available</div>) }

      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-foreground">${property.L_SystemPrice?.toLocaleString()}</h3>
        <p className="text-foreground/80">{property.L_Address}</p>
        <p className="text-foreground/60">{property.L_City}, {property.L_State}</p>
        <p className="text-foreground/50 text-sm mt-2">
          {property.L_Keyword2} beds • {property.LM_Dec_3} baths • {property.LM_Int2_3} sqft
        </p>
      </div>
    </div>
  );
}
