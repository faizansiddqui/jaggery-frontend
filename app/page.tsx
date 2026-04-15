import { HeroSection, HeritageSection, FeaturedProducts, SpotlightProducts } from "./components/HomeSections";
import { SlowCraftSection, TestimonialsSection, NewsletterSection } from "./components/HomeSections2";

export default function HomeRoute() {
  return (
    <main>
      <HeroSection />
      <SpotlightProducts />
      <FeaturedProducts />
      <HeritageSection />
      <SlowCraftSection />
      <TestimonialsSection />
      <NewsletterSection />
    </main>
  );
}