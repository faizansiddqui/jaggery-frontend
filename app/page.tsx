import { HeroSection, HeritageSection, FeaturedProducts } from "./components/HomeSections";
import { SlowCraftSection, TestimonialsSection, NewsletterSection } from "./components/HomeSections2";

export default function HomeRoute() {
  return (
    <main>
      <HeroSection />
      <FeaturedProducts />
      <HeritageSection />
      <SlowCraftSection />
      <TestimonialsSection />
      <NewsletterSection />
    </main>
  );
}