import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
      images: [
        `${siteUrl}/opengraph-image.png`,
        `${siteUrl}/images/hero/burger.webp`,
        `${siteUrl}/images/hero/gumbo.webp`,
        `${siteUrl}/images/hero/mocktail.webp`,
        `${siteUrl}/images/feed/signboard.webp`,
        `${siteUrl}/images/feed/bowls-overhead.webp`,
        `${siteUrl}/images/feed/gumbo.webp`,
        `${siteUrl}/images/feed/onam.webp`,
      ],
    },
  ];
}
