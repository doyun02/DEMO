import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/** Public routes only. The HR side sits behind a gate and is not for indexing. */
const ROUTES = ["", "/apply"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
}
