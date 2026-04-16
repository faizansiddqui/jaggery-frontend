import { HeroSection, HeritageSection, FeaturedProducts, SpotlightProducts } from "./components/HomeSections";
import { SlowCraftSection, NewsletterSection } from "./components/HomeSections2";
import TestimonialsSection from "./components/Testimonials";

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