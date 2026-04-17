import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://workbook-sigma.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date("2025-11-28"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date("2025-11-28"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date("2025-11-28"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date("2025-11-28"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2025-11-28"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date("2025-11-28"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    // /login and /signup intentionally excluded — auth utility pages with
    // no publisher content should not be indexed for AdSense compliance.
  ];
}
