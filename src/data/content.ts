export interface Review {
  quote: string;
  who: string;
  source: string;
}

/** Quotes are verbatim from public reviews and press. */
export const reviews: Review[] = [
  {
    quote: "Good food, nice ambience, good music and excellent service. Highly recommendable.",
    who: "Dinesh K.",
    source: "District",
  },
  {
    quote: "This place is a treasure for all those who want to relax and slow down.",
    who: "Restaurant review",
    source: "Kochi Post",
  },
  {
    quote: "Food is good and ambience is very calming.",
    who: "Anamika V.",
    source: "District",
  },
  {
    quote: "Just sitting in the restaurant gives a sense of peace and calm.",
    who: "Food blog",
    source: "Flavourites",
  },
  {
    quote: "The staff is extremely friendly and courteous.",
    who: "Restaurant review",
    source: "Kochi Post",
  },
  {
    quote: "Really good food and great service.",
    who: "Vineetha",
    source: "District",
  },
  {
    quote: "A complete package where you can hang out with friends.",
    who: "Food blog",
    source: "Flavourites",
  },
  {
    quote: "Sweet and savoury at the same time with a hint of heat from the jalapeño… a must-try.",
    who: "On the Pineapple & Jalapeño Margarita",
    source: "Kochi Post",
  },
  {
    quote: "Food was pretty good. Price is also decent.",
    who: "Swarup M. S.",
    source: "EazyDiner",
  },
  {
    quote: "Great ambiance. Really good food. Good place to hang out.",
    who: "Food guide",
    source: "Kerala Food Guide",
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  {
    q: "Where is Cafe 17 in Kochi?",
    a: "We're on the ground floor of CT Tower, R. Madhavan Nair Road, Ravipuram, Kochi 682016. That's a short hop from MG Road, away from the noise. Tap “Get directions” below for Google Maps.",
  },
  {
    q: "What are Cafe 17's opening hours?",
    a: "We're open every day from 12 noon to 11:30 pm. Hours can shift on festival days, so give us a call if you're planning a late visit.",
  },
  {
    q: "Is there food for vegetarians?",
    a: "Plenty. Veg burgers, paneer skewers, quesadillas, the Cajun Paneer Bowl, pizzas, salads, mocktails and the whole dessert counter. Every dish on our menu is marked veg or non-veg.",
  },
  {
    q: "Can I book a table or host a birthday or team lunch?",
    a: "Yes. Call +91 81138 14417 to reserve. Our first floor has an open layout that works for birthdays, family dinners, team lunches, workshops and community meetups.",
  },
  {
    q: "Do you screen football matches?",
    a: "We do. There's a screen on each floor, and big league nights get loud in the best way. Follow @cafe17tps for match-night plans.",
  },
  {
    q: "Do you deliver?",
    a: "Yes. Order Cafe 17 favourites and our BOWLR rice bowls on Swiggy and Zomato, or call us for direct orders.",
  },
  {
    q: "Do you serve alcohol?",
    a: "No, Cafe 17 is an alcohol-free café. Try the Pineapple & Jalapeño Margarita, our zero-proof favourite.",
  },
];
