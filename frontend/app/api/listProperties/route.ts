// Proxies property search requests to the Express backend.
// All query parameters are preserved and forwarded as-is to avoid duplicating validation logic.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const backendBase = process.env.BACKEND_API_URL;
  
  // Build the backend URL using the original query string.
  // This ensures filters, pagination, and sorting behave identically on both servers.
  const backendUrl = `${backendBase}/api/properties?` + searchParams.toString();

  // Forward the request to Express. Next.js performs the fetch server-side to avoid CORS issues.
  const res = await fetch(backendUrl);

  // Return the backend's JSON response directly.
  return Response.json(await res.json());
}
