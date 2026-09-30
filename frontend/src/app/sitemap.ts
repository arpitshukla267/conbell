import type { MetadataRoute } from "next";
import { SERVICES } from "../data/services";
import { INDUSTRIES } from "../data/industries";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://conbellengineering.com";
  const currentDate = new Date();

  // Core static public pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/our-expertise`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/our-presence`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/clients`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/safety-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Dynamic service/expertise pages
  const serviceRoutes: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: `${baseUrl}/our-expertise/${service.id}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Dynamic industry presence pages
  const industryRoutes: MetadataRoute.Sitemap = INDUSTRIES.map((industry) => ({
    url: `${baseUrl}/our-presence/${industry.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes, ...industryRoutes];
}
