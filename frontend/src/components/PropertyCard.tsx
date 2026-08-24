import Link from "next/link";
import PropTypes from "prop-types";
import PropertyImageCarousel from "../components/PropertyImageCarousel";

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

// A card is deliberately a link around the textual details, while the photo
// carousel handles its own controls without navigating to the property.
export default function PropertyCard({ property }: { property: Property }) {

  let photos;
  // L_Photos comes from MySQL as a JSON-encoded string rather than string[].
  // Invalid or empty data uses the explicit no-photo state below.
  try {
    const res = JSON.parse(property.L_Photos);
    if (Array.isArray(res) && res.length > 0) {
      photos = res;
    }
  } catch {
    photos = null;
  }

  return (
    <div className="property-card" data-testid="property-card">
      {photos ? (
        <PropertyImageCarousel photos={property.L_Photos} />
      ) : (
        <div className="no-photo">No photo available</div>
      )}

      <Link href={`/property/${property.L_ListingID}`} className="block">
        <div className="p-4 flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-foreground">
            ${property.L_SystemPrice?.toLocaleString()}
          </h3>
          <p className="text-foreground/80">{property.L_Address}</p>
          <p className="text-foreground/60">
            {property.L_City}, {property.L_State}
          </p>
          <p className="text-foreground/50 text-sm mt-2">
            {property.L_Keyword2} beds • {property.LM_Dec_3} baths • {property.LM_Int2_3} sqft
          </p>
        </div>
      </Link>
    </div>
  );
}

PropertyCard.propTypes = {
  property: PropTypes.shape({
    L_ListingID: PropTypes.string.isRequired,
    L_Photos: PropTypes.string,
    L_SystemPrice: PropTypes.number.isRequired,
    L_Address: PropTypes.string.isRequired,
    L_City: PropTypes.string.isRequired,
    L_State: PropTypes.string.isRequired,
    L_Keyword2: PropTypes.number,
    LM_Dec_3: PropTypes.number,
    LM_Int2_3: PropTypes.number,
  }).isRequired,
};
