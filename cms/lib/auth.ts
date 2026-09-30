const TOKEN_KEY = "cms_token";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:4000";

export const getToken = () =>
  typeof window === "undefined" ? null : sessionStorage.getItem(TOKEN_KEY);

export const setToken = (token: string) =>
  sessionStorage.setItem(TOKEN_KEY, token);

export const clearToken = () => sessionStorage.removeItem(TOKEN_KEY);

/** Backend ko token ke saath call karta hai. 401 aane par auto logout. */
export async function authFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (res.status === 401) {
    clearToken();
    window.dispatchEvent(new Event("cms-logout"));
  }
  return res;
}