/**
 * Single source of truth for Cafe 17's public details.
 * Everything on the page, in the metadata and in the JSON-LD reads from here,
 * so updating a phone number or the hours is a one-line change.
 */
export const site = {
  name: "Cafe 17",
  altNames: ["Cafe17", "Café 17", "Cafe 17 Ravipuram", "Cafe 17 Kochi"],
  shortTagline: "Café & kitchen · Ravipuram, Kochi",
  tagline:
    "Burgers stacked high, steaks off the grill, pastas, bowls, mocktails and long conversations — in Ravipuram, Kochi, since 2014.",
  founded: "2014",
  foundedIso: "2014-11",

  phone: {
    primary: "+91 81138 14417",
    primaryHref: "tel:+918113814417",
    landline: "+91 484 406 0717",
    landlineHref: "tel:+914844060717",
  },

  address: {
    line1: "Ground Floor, CT Tower",
    line2: "R. Madhavan Nair Road, Ravipuram",
    street: "Ground Floor, CT Tower, R. Madhavan Nair Road",
    locality: "Ravipuram",
    city: "Kochi",
    region: "Kerala",
    postalCode: "682016",
    country: "IN",
  },

  geo: { lat: 9.9591377, lng: 76.2878631 },
  coords: { lat: `09°57'32.9"N`, lng: `76°17'16.3"E` },

  hours: {
    opens: "12:00",
    closes: "23:30",
    label: "Open daily · 12 noon – 11:30 pm",
    short: "12 noon – 11:30 pm",
  },

  links: {
    maps: "https://maps.app.goo.gl/iSMEfaKUuZfQyoNP7",
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=9.9591377,76.2878631",
    instagram: "https://www.instagram.com/cafe17tps/",
    instagramHandle: "@cafe17tps",
    facebook: "https://www.facebook.com/cafe17tps",
    swiggy: "https://www.swiggy.com/search?query=Cafe%2017%20Ravipuram",
    zomato: "https://www.zomato.com/kochi/restaurants?q=cafe%2017",
    bowlrSwiggy: "https://www.swiggy.com/search?query=BOWLR%20by%20Cafe17",
    bowlrZomato: "https://www.zomato.com/kochi/restaurants?q=bowlr",
    reserve: "https://www.district.in/dining/kochi/cafe-17-ravipuram",
    dineout: "https://www.swiggy.com/restaurants/854262/dineout",
  },

  cuisines: ["Continental", "American", "Italian", "Café", "Desserts", "Healthy Bowls"],
  priceRange: "₹₹",

  ratings: [
    { source: "Google", score: "4.5", count: "1,900+ reviews" },
    { source: "Swiggy Dineout", score: "4.5", count: "2K ratings" },
    { source: "District", score: "4.9", count: "500+ ratings" },
  ],
} as const;

export const navLinks = [
  { href: "#story", label: "Story" },
  { href: "#signatures", label: "Signatures" },
  { href: "#menu", label: "Menu" },
  { href: "#bowlr", label: "BOWLR" },
  { href: "#space", label: "The Space" },
  { href: "#wall", label: "The Wall" },
  { href: "#visit", label: "Visit" },
] as const;
