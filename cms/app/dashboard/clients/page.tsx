"use client";
import Image from "next/image";
import { ContentManager } from "@/components/content-manager";
import { clientsApi, type Client } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { resolveMediaUrl } from "@/lib/media-url";
import { Building2 } from "lucide-react";

export default function ClientsManagerPage() {
  return (
    <ContentManager<Client>
      title="Clients & Partners"
      description="Manage OEM clients, partners, and enterprise customer logos showcased on the website."
      gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      api={clientsApi}
      uploadSection="clients"
      uploadIdentifier={(item) =>
        item.name
          ? item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
          : `client-${Date.now()}`
      }
      emptyDefaults={{ name: "", logo: "", isActive: true, order: 0 }}
      fields={[
        { key: "name", label: "Client / Company Name", type: "text", span: "full", placeholder: "e.g. Maruti Suzuki India Ltd" },
        { key: "logo", label: "Company Logo Image", type: "image" },
        { key: "order", label: "Display Order", type: "number" },
      ]}
      renderRow={(item) => (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{item.name}</h3>
            <Badge variant={item.isActive ? "success" : "warning"}>
              {item.isActive ? "Active" : "Hidden"}
            </Badge>
          </div>

          <div className="h-28 w-full bg-slate-50 border border-slate-200/70 rounded-xl p-3 flex items-center justify-center relative overflow-hidden">
            {item.logo ? (
              <div className="relative h-full w-full">
                <Image
                  src={resolveMediaUrl(item.logo)}
                  alt={item.name}
                  fill
                  sizes="240px"
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-slate-400">
                <Building2 className="w-6 h-6" />
                <span className="text-xs font-semibold">{item.name || "No Logo"}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Order Priority: #{item.order}</span>
          </div>
        </div>
      )}
    />
  );
}
