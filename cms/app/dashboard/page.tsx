"use client";
import { useEffect, useState } from "react";
import { checkHealth, productsApi, heroApi, servicesApi } from "@/lib/api";
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
  Layers,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [health, setHealth] = useState<boolean | null>(null);
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
    Promise.all([productsApi.list(), heroApi.list(), servicesApi.list()])
      .then(([products, slides, services]) => {
        setCounts({
          products: products.length,
          activeProducts: products.filter((p) => p.isActive).length,
          slides: slides.length,
          activeSlides: slides.filter((s) => s.isActive).length,
          services: services.length,
          activeServices: services.filter((s) => s.isActive).length,
        });
      })
      .catch(() => {});
  }, []);

  const stats = [
    {
      label: "Products Catalogue",
      value: counts.products,
      sub: `${counts.activeProducts} active on site`,
      icon: ShoppingBag,
      href: "/dashboard/products",
      color: "bg-[#EEF4FF] text-[#00355F] border-[#B2CDFA]/50",
    },
    {
      label: "Hero Slides",
      value: counts.slides,
      sub: `${counts.activeSlides} slides live`,
      icon: Clapperboard,
      href: "/dashboard/hero",
      color: "bg-[#EEF4FF] text-[#00355F] border-[#B2CDFA]/50",
    },
    {
      label: "Core Services",
      value: counts.services,
      sub: `${counts.activeServices} capabilities live`,
      icon: Wrench,
      href: "/dashboard/services",
      color: "bg-[#EEF4FF] text-[#00355F] border-[#B2CDFA]/50",
    },
    {
      label: "Content Sections",
      value: 2,
      sub: "Process & Quality",
      icon: Layers,
      href: "/dashboard/process-steps",
      color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
  ];

  const quickTiles = [
    { label: "Products Catalogue", desc: "Heavy structures & parts", icon: ShoppingBag, href: "/dashboard/products", bg: "hover:border-[#B2CDFA]" },
    { label: "Hero Slides", desc: "Homepage banners", icon: Clapperboard, href: "/dashboard/hero", bg: "hover:border-[#B2CDFA]" },
    { label: "Services & Capabilities", desc: "Core engineering expertise", icon: Wrench, href: "/dashboard/services", bg: "hover:border-[#B2CDFA]" },
    { label: "Process Steps", desc: "4 Engineering steps", icon: Footprints, href: "/dashboard/process-steps", bg: "hover:border-[#B2CDFA]" },
    { label: "Quality Points", desc: "6 Quality standards", icon: Star, href: "/dashboard/quality-points", bg: "hover:border-[#B2CDFA]" },
    { label: "Site Settings", desc: "Company contact & policies", icon: Settings, href: "/dashboard/site-settings", bg: "hover:border-[#B2CDFA]" },
  ];

  const overviewSections = [
    { title: "Products Management", badge: `${counts.products} Products`, desc: "Manage structural steel, conveyors, mezzanines, and turnkey products", href: "/dashboard/products", icon: ShoppingBag },
    { title: "Hero Carousel", badge: `${counts.slides} Slides`, desc: "Homepage showcase slides, images, headings and highlights", href: "/dashboard/hero", icon: Clapperboard },
    { title: "Core Capabilities", badge: `${counts.services} Services`, desc: "Conveyor structures, overhead systems, assembly lines, walkways", href: "/dashboard/services", icon: Wrench },
    { title: "Process & Quality", badge: "Standards", desc: "Delivery workflow steps, quality policy, and ISO compliance", href: "/dashboard/process-steps", icon: Footprints },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner & Greeting Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-2xl border border-slate-200/70 shadow-sm relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#00355F]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight pt-1">
            Conbell Engineering CMS
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Control your website content, product catalogue, hero slides, and
            engineering capabilities from your unified dashboard.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0 pt-2 lg:pt-0">
          <a
            href="http://localhost:3005"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00355F] text-white text-xs font-semibold hover:bg-[#0b2640] transition-all shadow-sm shadow-[#00355F]/20"
          >
            Preview Site <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group">
            <Card className="h-full border-slate-200/80 hover:border-[#B2CDFA] hover:shadow-md transition-all duration-200">
              <CardBody className="p-5 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {s.label}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${s.color}`}
                  >
                    <s.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900 tracking-tight group-hover:text-[#00355F] transition-colors">
                    {s.value}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {s.sub}
                  </p>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Access Card with Clickable Navigation Tiles */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00355F]" />
            <h2 className="font-bold text-slate-900 text-base">
              Quick Access Modules
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Click to navigate directly
          </span>
        </CardHeader>
        <CardBody className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickTiles.map((q) => (
              <Link key={q.href} href={q.href} className="group">
                <div
                  className={`p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-md ${q.bg} transition-all duration-200 flex items-start gap-3.5 h-full`}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#00355F] border border-[#B2CDFA]/50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <q.icon className="w-4.5 h-4.5" />
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

      {/* Content Overview Cards Grid (2x2 balanced layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {overviewSections.map((sec) => (
          <Card
            key={sec.title}
            className="hover:border-[#B2CDFA] transition-all duration-200"
          >
            <CardBody className="p-6 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF4FF] text-[#00355F] border border-[#B2CDFA]/50 flex items-center justify-center shrink-0 shadow-2xs">
                  <sec.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">
                      {sec.title}
                    </h3>
                    <Badge variant="purple">{sec.badge}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{sec.desc}</p>
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
    </div>
  );
}
