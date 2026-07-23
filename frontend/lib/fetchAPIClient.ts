export async function fetchAPIClient(filters: Record<string, any> = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`/api/properties?${params}`);
  return await res.json();
}
