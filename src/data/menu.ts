/**
 * The Cafe 17 menu.
 *
 * Dishes are compiled from the café's own posts and from published reviews
 * (Kochi Post, District, EazyDiner, Wanderlog, food blogs). Prices are not
 * published anywhere reliable, so `price` is optional — add a number (in ₹)
 * to any item and it will appear on the site and in the structured data.
 */

export type Diet = "veg" | "nonveg" | "both";
export type Tag = "signature" | "bestseller" | "new" | "spicy" | "seasonal";

export interface MenuItem {
  name: string;
  description: string;
  diet?: Diet;
  price?: number;
  tags?: Tag[];
}

export interface MenuCategory {
  id: string;
  title: string;
  script: string;
  blurb: string;
  image: string;
  imageAlt: string;
  note?: string;
  items: MenuItem[];
}

export const menu: MenuCategory[] = [
  {
    id: "small-plates",
    title: "Small Plates",
    script: "to start",
    blurb: "Crunchy, cheesy and made for passing around the table.",
    image: "/images/menu/bruschetta.webp",
    imageAlt: "Tomato and basil bruschetta on a wooden board",
    items: [
      {
        name: "Bruschetta",
        description: "Toasted bread piled with tomato, basil and good olive oil — the classic opener.",
        diet: "veg",
      },
      {
        name: "Beef Croquettes",
        description: "Crumbed and golden outside, soft spiced beef inside. One of our fastest sellers.",
        diet: "nonveg",
        tags: ["bestseller"],
      },
      {
        name: "Sausage Croquettes",
        description: "Smoky sausage folded into a crisp, crumbed croquette.",
        diet: "nonveg",
      },
      {
        name: "Commando Fries",
        description: "Our loaded house fries, built for sharing (and for not sharing).",
        diet: "veg",
      },
      {
        name: "Chicken Wings",
        description: "Sticky, saucy and finger-licking. Order an extra napkin.",
        diet: "nonveg",
      },
      {
        name: "Cottage Cheese & Vegetable Skewers",
        description: "Marinated paneer, bell peppers and onion off the grill, with a cool mint dip.",
        diet: "veg",
      },
      {
        name: "Potato Wedges",
        description: "Skin-on wedges with crisp edges and a house dip.",
        diet: "veg",
      },
      {
        name: "Veg Quesadilla",
        description: "A toasted tortilla folded over melty cheese and vegetables.",
        diet: "veg",
      },
    ],
  },
  {
    id: "soups-salads",
    title: "Soups & Salads",
    script: "warm & green",
    blurb: "Comfort in a bowl, crunch on a plate.",
    image: "/images/menu/soup.webp",
    imageAlt: "A bowl of creamy tomato soup with herbs",
    items: [
      {
        name: "Cream of Chicken Soup",
        description: "Velvety, peppery and exactly what a rainy Kochi evening asks for.",
        diet: "nonveg",
      },
      {
        name: "Sliced Beef & Noodle Soup",
        description: "Thin-sliced beef and noodles in a deep, savoury broth.",
        diet: "nonveg",
        tags: ["new"],
      },
      {
        name: "Chicken Schnitzel & Coleslaw Salad",
        description: "Crumbed chicken schnitzel over crunchy house coleslaw.",
        diet: "nonveg",
      },
      {
        name: "Cottage Cheese Salad",
        description: "Grilled paneer, crisp greens and a bright dressing — customise it your way.",
        diet: "veg",
      },
    ],
  },
  {
    id: "burgers",
    title: "Burgers & Sandwiches",
    script: "two hands needed",
    blurb: "The burgers that put us on the map.",
    image: "/images/menu/burger.webp",
    imageAlt: "A tall cheeseburger with lettuce and tomato on a dark board",
    note: "Burgers come with potato wedges, salad and sauce. Swap for mash if you like.",
    items: [
      {
        name: "On The Highway Burger",
        description: "Beef patty, salami, a fried egg, onion rings, lettuce and cheese. The star of the show.",
        diet: "nonveg",
        tags: ["signature"],
      },
      {
        name: "Jus-C Lucy Burger",
        description: "Our take on the Juicy Lucy: cheese tucked into a chilli-flecked patty on a sesame bun. Chicken or beef.",
        diet: "nonveg",
        tags: ["bestseller"],
      },
      {
        name: "Class Veg Burger",
        description: "A crisp vegetable patty with onion, tomato and lettuce.",
        diet: "veg",
      },
      {
        name: "Grilled Sandwich",
        description: "Pressed, toasted and stuffed — veg or chicken.",
        diet: "both",
      },
    ],
  },
  {
    id: "grills",
    title: "Steaks & Grills",
    script: "from the grill",
    blurb: "Sauces made from scratch, every single one.",
    image: "/images/menu/steak.webp",
    imageAlt: "Sliced grilled steak with asparagus on a cast-iron plate",
    items: [
      {
        name: "Grilled Beef Tenderloin",
        description: "Pepper or mushroom sauce, creamy mash, grilled carrots and broccoli.",
        diet: "nonveg",
        tags: ["signature"],
      },
      {
        name: "Beef Steak, BBQ Sauce",
        description: "A juicy beef steak under a smoky barbecue glaze.",
        diet: "nonveg",
        tags: ["bestseller"],
      },
      {
        name: "17's Chicken Steak",
        description: "The house chicken steak. Ask us about today's sauce.",
        diet: "nonveg",
      },
      {
        name: "Chicken Fillet, Mushroom Sauce",
        description: "Tender chicken fillet with a barbecue-mushroom sauce, mash, broccoli and carrot.",
        diet: "nonveg",
      },
      {
        name: "Chicken Parmigiana",
        description: "Crumbed chicken, rich tomato sauce and a blanket of melted cheese.",
        diet: "nonveg",
      },
      {
        name: "Fish & Chips",
        description: "Crisp battered fish with chunky chips. A regular's favourite.",
        diet: "nonveg",
      },
    ],
  },
  {
    id: "pasta-pizza",
    title: "Pasta & Pizza",
    script: "Italian, sort of",
    blurb: "Slow sauces, fresh garlic bread, no shortcuts.",
    image: "/images/menu/pasta.webp",
    imageAlt: "Penne pasta in a red tomato sauce on a white plate",
    items: [
      {
        name: "Pasta Nduja",
        description: "Spicy, spreadable Calabrian-style sausage melted into a rich tomato sauce.",
        diet: "nonveg",
        tags: ["signature", "spicy"],
      },
      {
        name: "Alfredo Chicken Pasta",
        description: "Silky cream-and-parmesan sauce with chicken, and grilled garlic bread on the side.",
        diet: "nonveg",
        tags: ["bestseller"],
      },
      {
        name: "Spaghetti Bolognaise",
        description: "Slow-simmered meat ragù over spaghetti, with grilled garlic bread.",
        diet: "nonveg",
      },
      {
        name: "Prawn Pasta",
        description: "Juicy prawns tossed through pasta in a garlicky sauce.",
        diet: "nonveg",
      },
      {
        name: "Lasagna",
        description: "Layers of pasta, meat sauce and bubbling, golden cheese.",
        diet: "nonveg",
      },
      {
        name: "Pizza",
        description: "Thin, cheesy and made for sharing. Ask for today's toppings.",
        diet: "both",
      },
    ],
  },
  {
    id: "global",
    title: "Global Plates",
    script: "around the world",
    blurb: "Kochi has always welcomed the world. So do we.",
    image: "/images/feed/gumbo.webp",
    imageAlt: "Cafe 17's shrimp and sausage gumbo with a dome of rice",
    items: [
      {
        name: "Shrimp & Sausage Gumbo",
        description: "A Louisiana-style stew of shrimp, sausage and peppers with a dome of rice. The real deal.",
        diet: "nonveg",
        tags: ["signature"],
      },
      {
        name: "Beef Stroganoff",
        description: "Tender beef in a creamy mushroom sauce. A long-time house favourite.",
        diet: "nonveg",
        tags: ["bestseller"],
      },
      {
        name: "Nasi Goreng",
        description: "Indonesian fried rice: sweet, savoury and smoky.",
        diet: "nonveg",
      },
      {
        name: "Teriyaki Rice Bowl",
        description: "Glossy teriyaki over steamed rice and vegetables.",
        diet: "nonveg",
      },
      {
        name: "Kebab Specials",
        description: "Festive skewers and platters, served around Eid.",
        diet: "nonveg",
        tags: ["seasonal"],
      },
    ],
  },
  {
    id: "bowlr",
    title: "BOWLR Bowls",
    script: "by Cafe17",
    blurb: "Fresh, flavourful, delivered. Our rice-bowl kitchen.",
    image: "/images/feed/bowls-overhead.webp",
    imageAlt: "Two BOWLR rice bowls from Cafe 17, seen from above",
    items: [
      {
        name: "Katsu Bowl",
        description: "Crumbed katsu over rice with fresh crunch and house sauce.",
        diet: "nonveg",
        tags: ["bestseller"],
      },
      {
        name: "Cajun Paneer Bowl",
        description: "Cajun-spiced paneer, rice and crisp vegetables.",
        diet: "veg",
        tags: ["spicy"],
      },
      {
        name: "Schezwan Momo Bowl",
        description: "Momos tossed in fiery Schezwan over rice.",
        diet: "both",
        tags: ["spicy"],
      },
      {
        name: "Egg & Chicken Protein Bowl",
        description: "Grilled chicken, boiled eggs, broccoli, greens and rice. Built for the gym crowd.",
        diet: "nonveg",
      },
      {
        name: "Chop Suey Bowl",
        description: "Crispy noodles under a glossy sweet-and-sour sauce.",
        diet: "both",
      },
    ],
  },
  {
    id: "coolers",
    title: "Mocktails & Coolers",
    script: "shaken, not stirred",
    blurb: "Zero-proof, full flavour. We're an alcohol-free café.",
    image: "/images/menu/mocktail.webp",
    imageAlt: "Bright mocktails in coupe glasses with lime",
    items: [
      {
        name: "Pineapple & Jalapeño Margarita",
        description: "Sweet, savoury and gently fiery, with a chilli-salt rim, a pineapple chunk and a jalapeño slice.",
        diet: "veg",
        tags: ["signature", "spicy"],
      },
      {
        name: "Sour Candy",
        description: "Layered, tangy and very sunset-coloured.",
        diet: "veg",
        tags: ["bestseller"],
      },
      {
        name: "Gulabi Bliss",
        description: "A rosy summer cooler.",
        diet: "veg",
        tags: ["seasonal"],
      },
      {
        name: "Coco Ginger",
        description: "Coconut cool with a ginger kick.",
        diet: "veg",
        tags: ["seasonal"],
      },
      {
        name: "Frosty Melon",
        description: "Icy melon refresher for peak Kochi heat.",
        diet: "veg",
        tags: ["seasonal"],
      },
      {
        name: "Agua Fresca",
        description: "Fruit of the day, topped with fizz.",
        diet: "veg",
      },
      {
        name: "Mango Bite",
        description: "Mango purée, yoghurt and honey, blended smooth.",
        diet: "veg",
      },
    ],
  },
  {
    id: "coffee",
    title: "Coffee, Tea & Shakes",
    script: "the good stuff",
    blurb: "From a proper filter coffee to a cold one with ice cream.",
    image: "/images/menu/coffee-cheers.webp",
    imageAlt: "Two lattes with latte art being clinked together",
    items: [
      {
        name: "Filter Coffee",
        description: "Strong, frothy and very South Indian.",
        diet: "veg",
      },
      {
        name: "Cappuccino & Latte",
        description: "Espresso, steamed milk and a little art on top.",
        diet: "veg",
      },
      {
        name: "Iced Latte",
        description: "Espresso over ice and cold milk.",
        diet: "veg",
      },
      {
        name: "Cold Coffee",
        description: "Not too sweet. Add a scoop of ice cream if you like.",
        diet: "veg",
        tags: ["bestseller"],
      },
      {
        name: "Chocolate Shake",
        description: "Thick, cold and unapologetically chocolatey.",
        diet: "veg",
      },
      {
        name: "Tea, in a Glass",
        description: "Hot tea served in a glass cup, the way Kochi likes it.",
        diet: "veg",
      },
    ],
  },
  {
    id: "desserts",
    title: "Desserts",
    script: "save room",
    blurb: "The dessert counter is the real reason you came.",
    image: "/images/menu/chocolate-cake.webp",
    imageAlt: "A rich chocolate layer cake topped with chocolate swirls",
    items: [
      {
        name: "Death by Chocolate",
        description: "Four layers deep. Proceed with a spoon and no regrets.",
        tags: ["signature"],
      },
      {
        name: "Royal Brownie with Ice Cream",
        description: "A warm, fudgy brownie with a scoop on top.",
      },
      {
        name: "Cheesecake",
        description: "Creamy, rich and a regular's go-to.",
        tags: ["bestseller"],
      },
      {
        name: "Filter Kaapi & Chocolate Shards",
        description: "Filter-coffee ice cream studded with dark chocolate shards.",
        tags: ["new"],
      },
      {
        name: "Horlicks with Chocolate Sauce",
        description: "Childhood-in-a-cup ice cream with a chocolate drizzle.",
        tags: ["new"],
      },
      {
        name: "Nutella Sandwiches",
        description: "Neat little triangles of toast and Nutella.",
      },
      {
        name: "From the Pastry Counter",
        description: "Mango mousse, chocolate truffle and whatever just came out of the oven.",
      },
    ],
  },
];

export const tagLabels: Record<Tag, string> = {
  signature: "Signature",
  bestseller: "Fan fave",
  new: "New",
  spicy: "Spicy",
  seasonal: "Seasonal",
};
