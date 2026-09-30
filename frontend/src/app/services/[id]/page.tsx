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
      title: "Service Not Found",
    };
  }

  return {
    title: `${service.title} | Services`,
    description: service.description,
    alternates: {
      canonical: `/our-expertise/${service.id}`,
    },
    openGraph: {
      title: `${service.title} | Conbell Engineering`,
      description: service.description,
      url: `https://conbellengineering.com/our-expertise/${service.id}`,
      siteName: "Conbell Engineering",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: service.image,
          width: 800,
          height: 600,
          alt: service.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | Conbell Engineering`,
      description: service.description,
      images: [service.image],
    },
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
