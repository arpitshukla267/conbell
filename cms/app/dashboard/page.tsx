"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  checkHealth,
  productsApi,
  heroApi,
  servicesApi,
  applicationsApi,
  type Application,
} from "@/lib/api";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Clapperboard,
  ExternalLink,
  ArrowUpRight,
  Footprints,
  Star,
  Wrench,
  Settings,
  Zap,
  Inbox,
  CalendarCheck,
  UserCheck,
  Clock,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

/* ───────────────────────────── helpers ───────────────────────────── */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3005";

const monthKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

const monthLabel = (key: string, short = false) => {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleString("en-US", {
    month: short ? "short" : "long",
    year: short ? undefined : "numeric",
  });
};

/** Last `n` months, newest first: ["2026-09", "2026-08", ...] */
const lastMonths = (n: number) => {
  const now = new Date();
  return Array.from({ length: n }, (_, i) =>
    monthKey(new Date(now.getFullYear(), now.getMonth() - i, 1)),
  );
};

const inMonth = (date: string | Date | undefined, key: string) => {
  if (!date) return false;
  if (key === "all") return true;
  return monthKey(new Date(date)) === key;
};

/** Date of the first history entry with this action (falls back to a given date) */
const eventDate = (app: Application, action: string, fallback?: string) =>
  app.history?.find((h) => h.action === action)?.timestamp || fallback;

const receivedIn = (a: Application, key: string) => inMonth(a.createdAt, key);
const interviewTakenIn = (a: Application, key: string) =>
  inMonth(eventDate(a, "interview_taken"), key);
const hiredIn = (a: Application, key: string) =>
  inMonth(eventDate(a, "hired", a.hiringDetails?.hiredAt), key);

const STATUS_META: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "#F59E0B" },
  reviewed: { label: "Reviewed", color: "#64748B" },
  shortlisted: { label: "Shortlisted", color: "#8B5CF6" },
  interview: { label: "Interview Scheduled", color: "#0EA5E9" },
  interview_taken: { label: "Interview Taken", color: "#00355F" },
  hired: { label: "Hired", color: "#10B981" },
  accepted: { label: "Accepted", color: "#14B8A6" },
  rejected: { label: "Rejected", color: "#EF4444" },
};

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

/* ───────────────────────────── small UI pieces ───────────────────────────── */

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  href,
  tone = "blue",
}: {
  label: string;
  value: number | string;
  sub: string;
  icon: React.ElementType;
  href: string;
  tone?: "blue" | "amber" | "green" | "slate";
}) {
  const tones = {
    blue: "bg-[#EEF4FF] text-[#00355F] border-[#B2CDFA]/50",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <Link href={href} className="group">
      <Card className="h-full border-slate-200/80 hover:border-[#B2CDFA] hover:shadow-md transition-all duration-200">
        <CardBody className="p-5 flex flex-col justify-between h-full">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {label}
            </span>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${tones[tone]}`}
            >
              <Icon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-slate-900 tracking-tight group-hover:text-[#00355F] transition-colors">
              {value}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">{sub}</p>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

function DonutChart({
  data,
  centerLabel,
}: {
  data: { name: string; value: number; color: string }[];
  centerLabel: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No data available for this period
      </div>
    );
  }
  return (
    <div className="relative h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data.filter((d) => d.value > 0)}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={88}
            paddingAngle={3}
            stroke="none"
          >
            {data
              .filter((d) => d.value > 0)
              .map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, color: "#64748B" }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center total (offset up to account for the legend) */}
      <div className="absolute inset-0 -mt-6 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-slate-900">{total}</span>
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
          {centerLabel}
        </span>
      </div>
    </div>
  );
}

/* ───────────────────────────── page ───────────────────────────── */

export default function DashboardPage() {
  const [health, setHealth] = useState<boolean | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [month, setMonth] = useState<string>(lastMonths(1)[0]); // current month
  const [loaded, setLoaded] = useState(false);
  const [counts, setCounts] = useState({
    products: 0,
    activeProducts: 0,
    slides: 0,
    activeSlides: 0,
    services: 0,
    activeServices: 0,
  });

  useEffect(() => {
    checkHealth().then(setHealth);

    (async () => {
      const [products, slides, services, apps] = await Promise.allSettled([
        productsApi.list(),
        heroApi.list(),
        servicesApi.list(),
        applicationsApi.list(),
      ]);

      setCounts({
        products: products.status === "fulfilled" ? products.value.length : 0,
        activeProducts:
          products.status === "fulfilled"
            ? products.value.filter((p) => p.isActive).length
            : 0,
        slides: slides.status === "fulfilled" ? slides.value.length : 0,
        activeSlides:
          slides.status === "fulfilled"
            ? slides.value.filter((s) => s.isActive).length
            : 0,
        services: services.status === "fulfilled" ? services.value.length : 0,
        activeServices:
          services.status === "fulfilled"
            ? services.value.filter((s) => s.isActive).length
            : 0,
      });
      if (apps.status === "fulfilled") setApplications(apps.value);
      setLoaded(true);
    })();
  }, []);

  const monthOptions = useMemo(() => lastMonths(12), []);

  /* ---- application analytics ---- */
  const analytics = useMemo(() => {
    const received = applications.filter((a) => receivedIn(a, month));
    const interviewsTaken = applications.filter((a) =>
      interviewTakenIn(a, month),
    );
    const hired = applications.filter((a) => hiredIn(a, month));

    const pending = applications
      .filter((a) => a.status === "pending")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    const statusData = Object.entries(STATUS_META).map(([key, meta]) => ({
      name: meta.label,
      color: meta.color,
      value: received.filter((a) => a.status === key).length,
    }));

    const trend = lastMonths(6)
      .reverse()
      .map((k) => ({
        month: monthLabel(k, true),
        Received: applications.filter((a) => receivedIn(a, k)).length,
        "Interviews Taken": applications.filter((a) => interviewTakenIn(a, k))
          .length,
        Hired: applications.filter((a) => hiredIn(a, k)).length,
      }));

    return { received, interviewsTaken, hired, pending, statusData, trend };
  }, [applications, month]);

  const periodLabel = month === "all" ? "All time" : monthLabel(month);

  const contentData = [
    {
      name: "Live on site",
      value:
        counts.activeProducts + counts.activeSlides + counts.activeServices,
      color: "#00355F",
    },
    {
      name: "Hidden",
      value:
        counts.products -
        counts.activeProducts +
        (counts.slides - counts.activeSlides) +
        (counts.services - counts.activeServices),
      color: "#CBD5E1",
    },
  ];

  const quickTiles = [
    {
      label: "Products Catalogue",
      desc: "Heavy structures & parts",
      icon: ShoppingBag,
      href: "/dashboard/products",
    },
    {
      label: "Hero Slides",
      desc: "Homepage banners",
      icon: Clapperboard,
      href: "/dashboard/hero",
    },
    {
      label: "Services & Capabilities",
      desc: "Core engineering expertise",
      icon: Wrench,
      href: "/dashboard/services",
    },
    {
      label: "Process Steps",
      desc: "Engineering workflow",
      icon: Footprints,
      href: "/dashboard/process-steps",
    },
    {
      label: "Quality Points",
      desc: "Quality standards",
      icon: Star,
      href: "/dashboard/quality-points",
    },
    {
      label: "Site Settings",
      desc: "Company contact & policies",
      icon: Settings,
      href: "/dashboard/site-settings",
    },
  ];

  const contentSummary = [
    {
      title: "Products",
      badge: `${counts.activeProducts}/${counts.products} live`,
      icon: ShoppingBag,
      href: "/dashboard/products",
    },
    {
      title: "Hero Carousel",
      badge: `${counts.activeSlides}/${counts.slides} live`,
      icon: Clapperboard,
      href: "/dashboard/hero",
    },
    {
      title: "Core Services",
      badge: `${counts.activeServices}/${counts.services} live`,
      icon: Wrench,
      href: "/dashboard/services",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-2xl border border-slate-200/70 shadow-sm relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#00355F]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Conbell Engineering CMS
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Manage website content and track your recruitment pipeline from a
            single dashboard.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
          <span
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${
              health === null
                ? "bg-slate-50 text-slate-500 border-slate-200"
                : health
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-red-50 text-red-600 border-red-100"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {health === null
              ? "Checking API…"
              : health
                ? "API Online"
                : "API Offline"}
          </span>
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00355F] text-white text-xs font-semibold hover:bg-[#0b2640] transition-all shadow-sm shadow-[#00355F]/20"
          >
            Preview Site <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* ── Recruitment section header + month filter ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Recruitment Overview
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing: <span className="font-semibold">{periodLabel}</span>
          </p>
        </div>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          aria-label="Select month"
          className="w-full sm:w-52 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00355F]/20 focus:border-[#00355F]"
        >
          <option value="all">All time</option>
          {monthOptions.map((k) => (
            <option key={k} value={k}>
              {monthLabel(k)}
            </option>
          ))}
        </select>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          label="Applications Received"
          value={loaded ? analytics.received.length : "–"}
          sub={periodLabel}
          icon={Inbox}
          href="/dashboard/applications"
          tone="blue"
        />
        <KpiCard
          label="Interviews Taken"
          value={loaded ? analytics.interviewsTaken.length : "–"}
          sub={periodLabel}
          icon={CalendarCheck}
          href="/dashboard/applications"
          tone="slate"
        />
        <KpiCard
          label="Candidates Hired"
          value={loaded ? analytics.hired.length : "–"}
          sub={periodLabel}
          icon={UserCheck}
          href="/dashboard/applications"
          tone="green"
        />
        <KpiCard
          label="Pending Review"
          value={loaded ? analytics.pending.length : "–"}
          sub="Awaiting action (all time)"
          icon={Clock}
          href="/dashboard/applications"
          tone="amber"
        />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Monthly trend */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <h2 className="font-bold text-slate-900 text-base">
              Monthly Recruitment Trend
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Last 6 months</p>
          </CardHeader>
          <CardBody className="p-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.trend} barGap={4}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E2E8F0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#64748B" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#64748B" }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip
                    cursor={{ fill: "#F1F5F9" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11, color: "#64748B" }}
                  />
                  <Bar
                    dataKey="Received"
                    fill="#00355F"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="Interviews Taken"
                    fill="#0EA5E9"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="Hired"
                    fill="#10B981"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Status pie */}
        <Card>
          <CardHeader>
            <h2 className="font-bold text-slate-900 text-base">
              Application Status
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{periodLabel}</p>
          </CardHeader>
          <CardBody className="p-4">
            <DonutChart
              data={analytics.statusData}
              centerLabel="Applications"
            />
          </CardBody>
        </Card>
      </div>

      {/* ── Pending applications + content donut ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                Pending Applications
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Latest candidates waiting for review
              </p>
            </div>
            <Link
              href="/dashboard/applications"
              className="text-xs font-semibold text-[#00355F] hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            {analytics.pending.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                {loaded
                  ? "All caught up. There are no pending applications."
                  : "Loading…"}
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {analytics.pending.slice(0, 5).map((a) => (
                  <li key={a._id}>
                    <Link
                      href="/dashboard/applications"
                      className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#EEF4FF] text-[#00355F] border border-[#B2CDFA]/50 flex items-center justify-center text-xs font-bold shrink-0">
                        {a.applicantName?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {a.applicantName}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {a.jobTitle}
                        </p>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        {timeAgo(a.createdAt)}
                      </span>
                      <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold uppercase tracking-wide shrink-0">
                        Pending
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-bold text-slate-900 text-base">
              Website Content
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Products, slides and services
            </p>
          </CardHeader>
          <CardBody className="p-4">
            <DonutChart data={contentData} centerLabel="Items" />
          </CardBody>
        </Card>
      </div>

      {/* ── Content summary ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {contentSummary.map((sec) => (
          <Card
            key={sec.title}
            className="hover:border-[#B2CDFA] transition-all duration-200"
          >
            <CardBody className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-[#EEF4FF] text-[#00355F] border border-[#B2CDFA]/50 flex items-center justify-center shrink-0">
                  <sec.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm truncate">
                    {sec.title}
                  </h3>
                  <Badge variant="purple">{sec.badge}</Badge>
                </div>
              </div>
              <Link href={sec.href}>
                <button className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 bg-white hover:bg-[#00355F] hover:text-white hover:border-[#00355F] transition-all shrink-0 cursor-pointer">
                  Manage
                </button>
              </Link>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* ── Quick access ── */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00355F]" />
            <h2 className="font-bold text-slate-900 text-base">Quick Access</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Jump directly to a module
          </span>
        </CardHeader>
        <CardBody className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickTiles.map((q) => (
              <Link key={q.href} href={q.href} className="group">
                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-[#B2CDFA] transition-all duration-200 flex items-start gap-3.5 h-full">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#00355F] border border-[#B2CDFA]/50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <q.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-xs group-hover:text-[#00355F] transition-colors truncate">
                        {q.label}
                      </h3>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#00355F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {q.desc}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
