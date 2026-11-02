import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-01-01"),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date("2026-01-01"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/promotions`,
      lastModified: new Date("2026-01-01"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
