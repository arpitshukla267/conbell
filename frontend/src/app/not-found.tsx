import Link from "next/link";
import { ArrowLeft, Home, Layers } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#00355F]">
        Error 404
      </div>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        Service Not Found
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">
        The service or page you are looking for does not exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/our-presence"
          className="inline-flex items-center gap-2 rounded-xl bg-[#00355F] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#072542]"
        >
          <Layers size={16} />
          View All Services
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <Home size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
