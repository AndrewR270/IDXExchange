export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const backendBase = process.env.BACKEND_API_URL;

  if (!id) { return Response.json({ error: "Missing listing id" }, { status: 400 }); }

  const backendUrl = `${backendBase}/api/properties/${encodeURIComponent(id)}/openhouses`;
  const res = await fetch(backendUrl);

  return Response.json(await res.json(), { status: res.status });
}
