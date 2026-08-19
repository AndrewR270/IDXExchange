interface PropertyMapProps {
  lat: number | string | null | undefined;
  lng: number | string | null | undefined;
}

export default function PropertyMap({ lat, lng }: PropertyMapProps) {
  if (!lat || !lng) return null;

  const key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const src = `https://www.google.com/maps/embed/v1/place?key=${key}&q=${lat},${lng}&zoom=15`;

  return (
    <div className="mt-4">
      <iframe
        width="100%"
        height="350"
        loading="lazy"
        allowFullScreen
        src={src}
        className="rounded"
      />
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
        target="_blank"
        className="text-blue-600 underline block mt-2"
      > Get Directions </a>
    </div>
  );
}
