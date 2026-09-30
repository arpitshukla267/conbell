"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { API_URL, authFetch, clearToken, getToken, setToken } from "@/lib/auth";

type View = "login" | "request" | "verify" | "done";

const inputCls =
  "w-full border border-slate-200 rounded-lg py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00355F]/30 focus:border-[#00355F] transition-colors";

const primaryBtn =
  "w-full flex items-center justify-center gap-2 bg-[#0B1C30] text-white rounded-lg py-3 text-sm font-semibold hover:bg-[#00355F] disabled:opacity-60 transition-colors shadow-sm";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  const [view, setView] = useState<View>("login");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // change password state
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // On page load, verify the saved token with the backend
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (getToken()) {
        try {
          const res = await authFetch("/api/auth/me");
          if (!cancelled && res.ok) setAuthed(true);
          else if (!res.ok) clearToken();
        } catch {
          /* Backend is unreachable; the sign-in screen will be shown */
        }
      }
      if (!cancelled) setChecking(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // If any request returns 401, return to the sign-in screen
  useEffect(() => {
    const onLogout = () => setAuthed(false);
    window.addEventListener("cms-logout", onLogout);
    return () => window.removeEventListener("cms-logout", onLogout);
  }, []);

  // resend OTP cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const goTo = (next: View) => {
    setView(next);
    setError("");
    if (next === "login") {
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setShowNew(false);
      setCooldown(0);
    }
  };

  const login = async (e: React.FormEvent) => {
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
      if (!res.ok)
        throw new Error(data.error || "Sign-in failed. Please try again.");
      setToken(data.token);
      setAuthed(true);
    } catch (err: any) {
      setError(
        err.message ||
          "Unable to connect to the server. Please try again later.",
      );
      setPw("");
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/password/send-otp", {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send the OTP.");
      setView("verify");
      setCooldown(30);
    } catch (err: any) {
      setError(err.message || "Could not send the OTP.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(otp)) return setError("Enter the 6 digit OTP.");
    if (newPassword.length < 8)
      return setError("Password must be at least 8 characters.");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match.");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Password was not changed.");
      setView("done");
    } catch (err: any) {
      setError(err.message || "Password was not changed.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) return null;
  if (authed) return <>{children}</>;

  return (
    <div className="min-h-screen flex bg-[#F4F7FA]">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-[44%] relative flex-col justify-between bg-[#0B1C30] text-slate-200 px-12 py-12 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #4A90C4 0, transparent 40%), radial-gradient(circle at 80% 75%, #4A90C4 0, transparent 35%)",
          }}
        />

        <div className="relative z-10">
          <Image
            src="/logo.png"
            alt="Conbell Engineering"
            width={220}
            height={110}
            priority
            className="h-auto w-96 object-contain opacity-0"
          />
        </div>

        <div className="relative z-10 max-w-sm -mt-16">
          <div className="relative z-10">
            <Image
              src="/logo.png"
              alt="Conbell Engineering"
              width={220}
              height={110}
              priority
              className="h-auto w-96 object-contain mb-6 -ml-10"
            />
          </div>
          <h1 className="text-3xl font-semibold leading-snug text-white">
            Your website content,
            <br />
            managed with ease.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Update products, services, hiring and site settings from one secure
            workspace.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Access restricted to authorized personnel</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile brand */}
          <div className="lg:hidden flex justify-center mb-10">
            <div className="rounded-xl bg-[#0B1C30] px-5 py-3">
              <Image
                src="/logo.png"
                alt="Conbell Engineering"
                width={140}
                height={70}
                className="h-auto w-32 object-contain"
              />
            </div>
          </div>

          {/* ───────────── Sign in ───────────── */}
          {view === "login" && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Sign in
                </h2>
                <p className="mt-1.5 text-sm text-slate-500">
                  Enter your CMS password to continue.
                </p>
              </div>

              <form onSubmit={login} className="space-y-4">
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={show ? "text" : "password"}
                    value={pw}
                    onChange={(e) => {
                      setPw(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your CMS password"
                    autoFocus
                    autoComplete="current-password"
                    className={`${inputCls} pl-10 pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {show ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <button type="submit" disabled={loading} className={primaryBtn}>
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{loading ? "Signing in…" : "Sign In"}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                <button
                  type="button"
                  onClick={() => goTo("request")}
                  className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#00355F] font-medium transition-colors"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Change password</span>
                </button>
              </div>
            </>
          )}

          {/* ───────────── Change password: request OTP ───────────── */}
          {view === "request" && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Change password
                </h2>
                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                  For security, a 6 digit OTP will be sent to the registered
                  admin email. Your password changes only after the OTP is
                  verified.
                </p>
              </div>

              {error && <p className="mb-4 text-xs text-red-500">{error}</p>}

              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                className={primaryBtn}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Send OTP
              </button>

              <BackToSignIn onClick={() => goTo("login")} />
            </>
          )}

          {/* ───────────── Change password: verify + set ───────────── */}
          {view === "verify" && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Verify &amp; set password
                </h2>
                <p className="mt-1.5 text-sm text-slate-500">
                  The OTP has been sent to the admin email. It is valid for 10
                  minutes.
                </p>
              </div>

              <form onSubmit={resetPassword} className="space-y-3">
                <input
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  placeholder="6 digit OTP"
                  autoFocus
                  className={`${inputCls} px-3.5 text-center font-semibold tracking-[0.4em]`}
                />

                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="New password"
                    autoComplete="new-password"
                    className={`${inputCls} px-3.5 pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((s) => !s)}
                    aria-label={showNew ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <input
                  type={showNew ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className={`${inputCls} px-3.5`}
                />

                {error && <p className="text-xs text-red-500">{error}</p>}

                <button type="submit" disabled={loading} className={primaryBtn}>
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Verify &amp; Change Password
                </button>

                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={loading || cooldown > 0}
                  className="w-full text-xs text-slate-500 hover:text-[#00355F] disabled:hover:text-slate-500 disabled:opacity-70 transition-colors"
                >
                  {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
                </button>
              </form>

              <BackToSignIn onClick={() => goTo("login")} />
            </>
          )}

          {/* ───────────── Done ───────────── */}
          {view === "done" && (
            <div className="flex flex-col items-center gap-3 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              <h2 className="text-2xl font-semibold text-slate-900">
                Password changed
              </h2>
              <p className="text-sm text-slate-500">
                Use your new password the next time you sign in.
              </p>
              <button
                type="button"
                onClick={() => goTo("login")}
                className={`${primaryBtn} mt-3`}
              >
                Back to sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BackToSignIn({ onClick }: { onClick: () => void }) {
  return (
    <div className="mt-8 pt-6 border-t border-slate-200 text-center">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#00355F] font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to sign in</span>
      </button>
    </div>
  );
}
