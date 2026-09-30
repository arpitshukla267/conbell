"use client";
import { ContentManager } from "@/components/content-manager";
import { qualityPointsApi, type QualityPoint } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

export default function QualityPointsPage() {
  return (
    <ContentManager<QualityPoint>
      title="Quality Standards & Policy"
      description="Quality assurance principles and ISO-aligned standards displayed in the Quality Policy section."
      gridCols="grid-cols-1 md:grid-cols-2 gap-6"
      api={qualityPointsApi}
      emptyDefaults={{ number: "01", title: "", description: "", isActive: true, order: 0 }}
      fields={[
        { key: "number", label: "Number", type: "text", placeholder: "01" },
        { key: "title", label: "Title", type: "text", span: "full", placeholder: "Precision, Reliability & Durability" },
        { key: "description", label: "Description", type: "textarea", span: "full", rows: 3 },
        { key: "order", label: "Order", type: "number" },
      ]}
      renderRow={(item) => (
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#00355F] border border-[#B2CDFA]/50 flex items-center justify-center shrink-0 font-bold font-mono text-sm">
                {item.number || "01"}
              </div>
              <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</h3>
            </div>
            <Badge variant={item.isActive ? "success" : "warning"}>
              {item.isActive ? "Active" : "Hidden"}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed pl-13">
            {item.description || "No description provided."}
          </p>
        </div>
      )}
    />
  );
}
