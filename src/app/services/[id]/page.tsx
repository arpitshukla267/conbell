import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES, getServiceById, getAllServiceIds } from "../../../data/services";
import ServiceShowcase from "../../../components/ServiceShowcase";

export function generateStaticParams() {
  return getAllServiceIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const service = getServiceById(id);

  if (!service) {
    return {
      title: "Service Not Found | Conbell Engineering",
    };
  }

  return {
    title: `${service.title} | Services | Conbell Engineering`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = getServiceById(id);

  if (!service) {
    notFound();
  }

  return (
    <main className="w-full">
      <ServiceShowcase service={service} allServices={SERVICES} />
    </main>
  );
}
