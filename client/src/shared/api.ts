// src/shared/api.ts
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export { API_BASE_URL };

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers || {});

  // Only set JSON content-type when not sending FormData
  if (!(options.body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Request failed: ${res.status}`);
  }

  // If there is no content, just return null
  if (res.status === 204) return null;

  return res.json();
}