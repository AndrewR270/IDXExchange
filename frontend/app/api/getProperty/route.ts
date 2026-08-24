// Server-side proxy for fetching a single property by ID.
// The frontend never calls Express directly; this route keeps backend secrets off the client.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const backendBase = process.env.BACKEND_API_URL;

  // Reject requests that do not include a listing ID.
  if (!id) { return Response.json({ error: "Missing listing id" }, { status: 400 }); }

  // Forward the request to the backend. encodeURIComponent prevents injection via the URL.
  const backendUrl = `${backendBase}/api/properties/${encodeURIComponent(id)}`;
  const res = await fetch(backendUrl);

  // Pass through the backend's JSON and status code.
  return Response.json(await res.json(), { status: res.status });
}
