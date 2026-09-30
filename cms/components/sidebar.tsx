"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Clapperboard,
  Footprints,
  Star,
  Globe,
  Wrench,
  Settings,
  ChevronRight,
  Users,
  HelpCircle,
  Briefcase,
  UserCheck,
  KeyRound,
  X,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { authFetch, setToken } from "@/lib/auth";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Careers & Hiring",
    icon: Briefcase,
    children: [
      { label: "Job Vacancies", href: "/dashboard/vacancies", icon: Briefcase },
      {
        label: "Job Responses",
        href: "/dashboard/applications",
        icon: UserCheck,
      },
    ],
  },
  {
    label: "Site Content",
    icon: Globe,
    children: [
      { label: "Hero Slides", href: "/dashboard/hero", icon: Clapperboard },
      { label: "Products", href: "/dashboard/products", icon: ShoppingBag },
      { label: "Services", href: "/dashboard/services", icon: Wrench },
      { label: "Clients", href: "/dashboard/clients", icon: Users },
      { label: "FAQs", href: "/dashboard/faqs", icon: HelpCircle },
      {
        label: "Process Steps",
        href: "/dashboard/process-steps",
        icon: Footprints,
      },
      {
        label: "Quality Points",
        href: "/dashboard/quality-points",
        icon: Star,
      },
      {
        label: "Site Settings",
        href: "/dashboard/site-settings",
        icon: Settings,
      },
    ],
  },
];

/* ───────────────────────── Change Password Modal ───────────────────────── */

type Step = "request" | "verify" | "done";

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("request");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await authFetch("/api/auth/password/send-otp", {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "OTP bhejne me problem aayi");
      setStep("verify");
      setCooldown(60); // backend ka cooldown 60s hai
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setError("");
    if (!/^\d{6}$/.test(otp)) return setError("6 digit ka OTP daalo");
    if (newPassword.length < 8)
      return setError("Password kam se kam 8 characters ka hona chahiye");
    if (newPassword !== confirmPassword)
      return setError("Dono passwords match nahi kar rahe");

    setLoading(true);
    try {
      const res = await authFetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Password change nahi hua");
      if (data.token) setToken(data.token); // purane sessions invalid, isliye naya token
      setStep("done");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  
  const inputCls =
    "w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#4A90C4] transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-[#0B1C30] border border-slate-800 p-6 text-slate-300 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <KeyRound className="w-4 h-4 text-[#4A90C4]" />
            Change Password
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === "request" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              Security ke liye ek 6 digit OTP registered admin email par bheja
              jayega. OTP verify hone ke baad hi password change hoga.
            </p>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00355F] hover:bg-[#0F4C81] disabled:opacity-60 text-white text-xs font-semibold py-2.5 transition-colors"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Send OTP
            </button>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              OTP email par bhej diya gaya hai (10 minute tak valid).
            </p>
            <input
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="6 digit OTP"
              className={cn(
                inputCls,
                "tracking-[0.4em] text-center font-semibold",
              )}
            />
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPass ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <input
              type={showPass ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className={inputCls}
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00355F] hover:bg-[#0F4C81] disabled:opacity-60 text-white text-xs font-semibold py-2.5 transition-colors"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Verify & Change Password
            </button>
            <button
              onClick={sendOtp}
              disabled={loading || cooldown > 0}
              className="w-full text-[11px] text-slate-500 hover:text-slate-300 disabled:hover:text-slate-500 transition-colors"
            >
              {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            <p className="text-sm font-semibold text-white">
              Password changed!
            </p>
            <p className="text-xs text-slate-400">
              Ab se naye password se login karna.
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full rounded-xl bg-[#00355F] hover:bg-[#0F4C81] text-white text-xs font-semibold py-2.5 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ───────────────────────────────── Sidebar ───────────────────────────────── */

export function Sidebar() {
  const pathname = usePathname();
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <aside className="w-64 shrink-0 bg-[#0B1C30] h-full flex flex-col border-r border-slate-800/60 text-slate-300">
      {/* Brand Header */}
      <div className="px-6 py-6 border-b border-slate-800/70">
        <div className="flex flex-col items-center gap-3.5">
          <Image
            src="/logo.png"
            alt="Conbell Engineering"
            width={120}
            height={60}
            className="w-full h-16 object-contain"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 overflow-y-auto space-y-6">
        <div className="flex flex-col gap-1.5">
          {NAV.map((item) => {
            if ("children" in item && item.children) {
              return (
                <div
                  key={item.label}
                  className="mt-4 pt-4 border-t border-slate-800/80 space-y-1"
                >
                  <div className="flex items-center gap-2 px-3 py-1.5 mb-1 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <item.icon className="w-3.5 h-3.5 text-[#4A90C4]" />
                    {item.label}
                  </div>
                  {item.children.map((child) => {
                    const active =
                      pathname === child.href ||
                      pathname.startsWith(child.href + "/");
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-medium transition-colors group",
                          active
                            ? "text-white font-semibold"
                            : "text-slate-400 hover:text-slate-200 hover:bg-white/5",
                        )}
                      >
                        {active && (
                          <motion.div
                            layoutId="active-sidebar-pill"
                            className="absolute inset-0 bg-[#00355F] rounded-xl shadow-md shadow-[#00355F]/50"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 30,
                            }}
                          />
                        )}
                        <child.icon
                          className={cn(
                            "w-4 h-4 shrink-0 relative z-10 transition-transform group-hover:scale-110",
                            active ? "text-white" : "text-slate-400",
                          )}
                        />
                        <span className="relative z-10 flex-1">
                          {child.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              );
            }

            const href = item.href as string;
            const active =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-medium transition-colors group",
                  active
                    ? "text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5",
                )}
              >
                {active && (
                  <motion.div
                    layoutId="active-sidebar-pill"
                    className="absolute inset-0 bg-[#00355F] rounded-xl shadow-md shadow-[#00355F]/50"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <item.icon
                  className={cn(
                    "w-4 h-4 shrink-0 relative z-10 transition-transform group-hover:scale-110",
                    active ? "text-white" : "text-slate-400",
                  )}
                />
                <span className="relative z-10 flex-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer: Change Password */}
      <div className="px-5 py-4 border-t border-slate-800/80 bg-slate-950/40">
        <button
          onClick={() => setShowChangePassword(true)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-medium hover:border-[#0F4C81]/50 hover:text-white transition-all group"
        >
          <div className="flex items-center gap-2">
            <KeyRound className="w-3.5 h-3.5 text-[#4A90C4]" />
            <span>Change Password</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <AnimatePresence>
        {showChangePassword && (
          <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
        )}
      </AnimatePresence>
    </aside>
  );
}
