export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const backendBase = process.env.BACKEND_API_URL;
  
  const backendUrl = `${backendBase}/api/properties?` + searchParams.toString();
  const res = await fetch(backendUrl);
  return Response.json(await res.json());
}
