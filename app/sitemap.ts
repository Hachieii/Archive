import { MetadataRoute } from "next";
import { competitionsData } from "@/lib/ctf-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://archive-hachieli.vercel.app";

  // Root pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/ctf-writeup`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Competition pages
  competitionsData.forEach((comp) => {
    routes.push({
      url: `${baseUrl}/ctf-writeup/${comp.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });

    // Challenge pages
    if (comp.challenges && Array.isArray(comp.challenges)) {
      comp.challenges.forEach((challenge: any) => {
        routes.push({
          url: `${baseUrl}/ctf-writeup/${comp.id}/${challenge.category}/${challenge.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      });
    }
  });

  return routes;
}
