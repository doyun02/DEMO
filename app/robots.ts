import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/hr", "/room", "/criteria", "/competencies", "/candidates", "/records"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
