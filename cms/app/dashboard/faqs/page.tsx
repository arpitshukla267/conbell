"use client";
import { ContentManager } from "@/components/content-manager";
import { faqsApi, type Faq } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";

export default function FaqsPage() {
  return (
    <ContentManager<Faq>
      title="Frequently Asked Questions (FAQs)"
      description="Manage common customer queries and detailed technical answers displayed on the website."
      gridCols="grid-cols-1 md:grid-cols-2 gap-6"
      api={faqsApi}
      emptyDefaults={{ question: "", answer: "", isActive: true, order: 0 }}
      fields={[
        { key: "question", label: "Question", type: "text", span: "full", placeholder: "What types of metals and alloy grades do you manufacture?" },
        { key: "answer", label: "Detailed Answer", type: "textarea", span: "full", rows: 4 },
        { key: "order", label: "Display Order", type: "number" },
      ]}
      renderRow={(item) => (
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#00355F] border border-[#B2CDFA]/50 flex items-center justify-center shrink-0 font-bold">
                <HelpCircle className="w-4 h-4 text-[#00355F]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.question}</h3>
                <span className="text-[11px] font-mono text-slate-400">Order: #{item.order}</span>
              </div>
            </div>
            <Badge variant={item.isActive ? "success" : "warning"}>
              {item.isActive ? "Active" : "Hidden"}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed pl-12">
            {item.answer || "No answer provided."}
          </p>
        </div>
      )}
    />
  );
}
