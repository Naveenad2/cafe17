import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { RouteProgress } from "@/components/layout/RouteProgress";
import { Bowlr } from "@/components/sections/Bowlr";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { MenuSection } from "@/components/sections/MenuSection";
import { Reviews } from "@/components/sections/Reviews";
import { Signatures } from "@/components/sections/Signatures";
import { Space } from "@/components/sections/Space";
import { Ribbon, Story } from "@/components/sections/Story";
import { Visit } from "@/components/sections/Visit";
import { Wall } from "@/components/sections/Wall";
import { buildJsonLd } from "@/lib/seo";

export default function Home() {
  const jsonLd = buildJsonLd();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Nav />
      <RouteProgress />
      <main>
        <Hero />
        <Ribbon />
        <Story />
        <Signatures />
        <MenuSection />
        <Bowlr />
        <Space />
        <Wall />
        <Reviews />
        <Faq />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
