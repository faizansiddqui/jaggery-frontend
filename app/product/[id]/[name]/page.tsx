import React from "react";
import ProductHeader from "./components/ProductHeader";
import WellnessPath from "./components/WellnessPath";
import NutritionFacts from "./components/NutritionFacts";
import ReviewsAndSimilar from "./components/ReviewsAndSimilar";
import PromiseBanner from "./components/PromiseBanner";

export default function ProductPage() {
  return (
    <div className="pt-24 pb-12 px-6 lg:px-12 max-w-screen-2xl mx-auto selection:bg-secondary-container selection:text-on-secondary-container">
      <ProductHeader />
      <div className="max-w-6xl mx-auto">
        <WellnessPath />
        <NutritionFacts />
        <ReviewsAndSimilar />
        <PromiseBanner />
      </div>
    </div>
  );
}