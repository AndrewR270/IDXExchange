// Next.js route handler that proxies open‑house requests to the backend.
// This keeps backend URLs off the client and avoids CORS issues by making the request server‑side.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const backendBase = process.env.BACKEND_API_URL;

  // Validate that the client supplied an ID before forwarding the request.
  if (!id) { return Response.json({ error: "Missing listing id" }, { status: 400 }); }

  // Construct the backend URL using the listing ID. encodeURIComponent prevents malformed URLs.
  const backendUrl = `${backendBase}/api/properties/${encodeURIComponent(id)}/openhouses`;

  // Forward the request to the Express backend. Next.js acts as a secure server-side proxy.
  const res = await fetch(backendUrl);

  // Mirror the backend response status and body back to the client.
  return Response.json(await res.json(), { status: res.status });
}
