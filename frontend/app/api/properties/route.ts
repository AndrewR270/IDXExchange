export async function GET(req: Request) {

  // Extract params from frontend request to forward to backend location
  const { searchParams } = new URL(req.url);
  const backendUrl = "http://localhost:5000/api/properties?" + searchParams.toString();

  const res = await fetch(backendUrl);
  const data = await res.json();
  return Response.json(data);
}
