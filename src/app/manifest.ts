import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cafe 17 — Ravipuram, Kochi",
    short_name: "Cafe 17",
    description: "Burgers, steaks, pastas, BOWLR bowls, mocktails and desserts in Ravipuram, Kochi.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0c09",
    theme_color: "#0b0c09",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
