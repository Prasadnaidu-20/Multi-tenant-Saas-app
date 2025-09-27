// utils/api.ts
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
  token?: string;
}

export async function api<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  console.log(`Making ${method} request to:`, `${API_BASE}${endpoint}`);
  console.log("Request body:", body);

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  console.log("Response status:", res.status);
  console.log("Response headers:", Object.fromEntries(res.headers.entries()));

  if (!res.ok) {
    const errorData = await res.json();
    console.error("API Error:", errorData);
    throw new Error(errorData.msg || "API request failed");
  }

  const data = await res.json();
  console.log("API Response:", data);
  return data;
}
