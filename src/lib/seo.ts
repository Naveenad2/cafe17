import "server-only";
import { faqs } from "@/data/content";
import { menu } from "@/data/menu";
import { site } from "@/data/site";
import { siteUrl } from "./site-url";

export const seoKeywords = [
  "Cafe 17",
  "Cafe17",
  "Café 17 Kochi",
  "Cafe 17 Ravipuram",
  "Cafe 17 Kochi menu",
  "cafe in Ravipuram",
  "restaurants in Ravipuram",
  "best cafe in Kochi",
  "cafes in Kochi",
  "cafe in Ernakulam",
  "best cafe in Ernakulam",
  "continental restaurant in Kochi",
  "American food Kochi",
  "Italian restaurant Kochi",
  "best burger in Kochi",
  "burgers in Kochi",
  "steak in Kochi",
  "beef steak Kochi",
  "tenderloin steak Kochi",
  "pasta in Kochi",
  "lasagna Kochi",
  "fish and chips Kochi",
  "shrimp gumbo Kochi",
  "beef stroganoff Kochi",
  "mocktails in Kochi",
  "desserts in Kochi",
  "death by chocolate Kochi",
  "coffee shop Kochi",
  "cold coffee Kochi",
  "family restaurant Kochi",
  "birthday party venue Kochi",
  "team lunch venue Kochi",
  "football screening cafe Kochi",
  "cafe near MG Road Kochi",
  "cafe near Kadavanthra",
  "R Madhavan Nair Road",
  "BOWLR by Cafe17",
  "rice bowls delivery Kochi",
  "protein bowl Kochi",
  "katsu bowl Kochi",
  "alcohol free cafe Kochi",
  "vegetarian friendly cafe Kochi",
];

export function buildJsonLd() {
  const restaurantId = `${siteUrl}/#restaurant`;
  const images = [
    `${siteUrl}/opengraph-image.png`,
    `${siteUrl}/images/hero/burger.webp`,
    `${siteUrl}/images/hero/gumbo.webp`,
    `${siteUrl}/images/feed/signboard.webp`,
    `${siteUrl}/images/feed/bowls-overhead.webp`,
    `${siteUrl}/images/feed/gumbo.webp`,
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Restaurant", "CafeOrCoffeeShop"],
        "@id": restaurantId,
        name: site.name,
        alternateName: site.altNames,
        description: site.tagline,
        url: siteUrl,
        logo: `${siteUrl}/icon.svg`,
        image: images,
        telephone: site.phone.primary.replace(/\s/g, ""),
        priceRange: site.priceRange,
        servesCuisine: site.cuisines,
        acceptsReservations: "True",
        foundingDate: site.foundedIso,
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          addressLocality: `${site.address.locality}, ${site.address.city}`,
          addressRegion: site.address.region,
          postalCode: site.address.postalCode,
          addressCountry: site.address.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: site.geo.lat,
          longitude: site.geo.lng,
        },
        hasMap: site.links.maps,
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: site.hours.opens,
            closes: site.hours.closes,
          },
        ],
        amenityFeature: [
          { "@type": "LocationFeatureSpecification", name: "Live sports screening", value: true },
          { "@type": "LocationFeatureSpecification", name: "Air conditioning", value: true },
          { "@type": "LocationFeatureSpecification", name: "Kid friendly", value: true },
          { "@type": "LocationFeatureSpecification", name: "Takeaway", value: true },
        ],
        sameAs: [site.links.instagram, site.links.facebook, site.links.reserve, site.links.dineout],
        hasMenu: {
          "@type": "Menu",
          name: "Cafe 17 Menu",
          url: `${siteUrl}/#menu`,
          inLanguage: "en-IN",
          hasMenuSection: menu.map((cat) => ({
            "@type": "MenuSection",
            name: cat.title,
            description: cat.blurb,
            hasMenuItem: cat.items.map((item) => ({
              "@type": "MenuItem",
              name: item.name,
              description: item.description,
              ...(item.diet === "veg" ? { suitableForDiet: "https://schema.org/VegetarianDiet" } : {}),
              ...(item.price
                ? { offers: { "@type": "Offer", price: item.price, priceCurrency: "INR" } }
                : {}),
            })),
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Cafe 17 — Ravipuram, Kochi",
        inLanguage: "en-IN",
        publisher: { "@id": restaurantId },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [{ "@type": "ListItem", position: 1, name: "Cafe 17", item: siteUrl }],
      },
    ],
  };
}
