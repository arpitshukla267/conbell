"use client";
import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { API_URL, authFetch, clearToken, getToken, setToken } from "@/lib/auth";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // page load par saved token backend se verify karo
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (getToken()) {
        try {
          const res = await authFetch("/api/auth/me");
          if (!cancelled && res.ok) setAuthed(true);
          else if (!res.ok) clearToken();
        } catch {
          /* backend down hai, login screen dikhegi */
        }
      }
      if (!cancelled) setChecking(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // kahin bhi 401 aaya to login screen par wapas
  useEffect(() => {
    const onLogout = () => setAuthed(false);
    window.addEventListener("cms-logout", onLogout);
    return () => window.removeEventListener("cms-logout", onLogout);
  }, []);

  if (checking) return null;
  if (authed) return <>{children}</>;

  async function login(e: React.FormEvent) {
    e.preventDefault();
    if (!pw || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Login fail hua");
      setToken(data.token);
      setAuthed(true);
    } catch (err: any) {
      setError(err.message || "Server se connect nahi ho paya");
      setPw("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 border border-slate-200">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#00355F] rounded-xl flex items-center justify-center shadow-lg shadow-[#00355F]/30">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-slate-900">
              Conbell Engineering
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Content Management System
            </p>
          </div>
        </div>

        <form onSubmit={login} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={pw}
              onChange={(e) => {
                setPw(e.target.value);
                setError("");
              }}
              placeholder="Enter CMS password"
              autoFocus
              className="w-full border border-slate-200 rounded-lg px-4 py-3.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#00355F]/30 focus:border-[#00355F]"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {show ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {error && <p className="text-xs text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-[#00355F] text-white rounded-lg py-3.5 text-sm font-semibold hover:bg-[#0b2640] disabled:opacity-60 transition-colors shadow-sm"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
