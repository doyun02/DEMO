import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const ROUTES = ["", "/criteria", "/competencies", "/candidates", "/records"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.6,
  }));
}
