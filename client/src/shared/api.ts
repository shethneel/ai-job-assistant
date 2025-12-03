// client/src/shared/api.ts

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// =============================
// USER PROFILE TYPES
// =============================
export interface UserProfile {
  id: number;
  user_id: number;
  experience_level?: string | null;
  preferred_roles?: string | null;
  preferred_industries?: string | null;
  preferred_locations?: string | null;
  skills?: string | null;
  work_authorization?: string | null;
  career_goal?: string | null;
  created_at: string;
  updated_at: string;
}

// =============================
// UNIVERSAL API FETCH WRAPPER
// =============================
export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers || {});

  // Automatically set Content-Type for JSON requests
  if (!(options.body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  // Add Authorization token if logged in
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null; // avoid JSON parsing error
  }

  return res.json();
}

// =============================
// USER PROFILE API HELPERS
// =============================

// GET USER PROFILE
export async function getUserProfile(): Promise<UserProfile> {
  return await apiFetch("/user/profile", {
    method: "GET",
  });
}

// UPSERT USER PROFILE (create or update)
export async function upsertUserProfile(
  payload: Partial<Omit<UserProfile, "id" | "user_id" | "created_at" | "updated_at">>
): Promise<UserProfile> {
  return await apiFetch("/user/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
