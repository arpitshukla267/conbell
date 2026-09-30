const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function fetchFromBackend<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return fallback;
    const json = await res.json();
    if (json.success && json.data) {
      if (Array.isArray(json.data) && json.data.length === 0) {
        return fallback;
      }
      return json.data as T;
    }
    return fallback;
  } catch {
    return fallback;
  }
}
