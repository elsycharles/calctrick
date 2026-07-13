import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";
import { MENTAL_MATH_GUIDES } from "@/lib/trick-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/tricks"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
  ];

  const guidePages: MetadataRoute.Sitemap = MENTAL_MATH_GUIDES.map(({ slug }) => ({
    url: absoluteUrl(`/tricks/${slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...guidePages];
}
