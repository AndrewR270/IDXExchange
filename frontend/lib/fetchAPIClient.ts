function getApiBaseUrl() {
  if (typeof window !== "undefined") { return ""; }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

// For Listings Page
export async function fetchPropertyByFilter(filters: Record<string, any> = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${getApiBaseUrl()}/api/listProperties?${params}`);
  return await res.json();
}


// For Property Page
export async function fetchPropertyByID(id: string) {
  const res = await fetch(`${getApiBaseUrl()}/api/getProperty?id=${encodeURIComponent(id)}`);
  return await res.json();
}

export async function fetchOpenHouses(id: string) {
  const res = await fetch(`${getApiBaseUrl()}/api/getOpenHouses?id=${encodeURIComponent(id)}`);
  return await res.json();
}
