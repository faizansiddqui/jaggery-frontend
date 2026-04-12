"use client";
import React from "react";

export default function NutritionFacts() {
  return (
    <section className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pb-8 border-b border-outline-variant/20">
      <div className="space-y-8">
        <h3 className="font-headline text-4xl font-bold text-primary">Ingredients & Purity</h3>
        <p className="text-on-surface leading-relaxed text-lg font-body">
          We believe in radical transparency. Our jaggery contains exactly one ingredient, sourced from heritage sugarcane varieties grown in volcanic soil.
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-outline-variant/30">
            <span className="font-bold text-on-surface font-body">Heritage Sugarcane Juice</span>
            <span className="text-secondary font-headline italic font-bold">100%</span>
          </div>
          <div className="flex items-center justify-between py-4 border-b border-outline-variant/30">
            <span className="font-bold text-on-surface font-body">Sulfur & Clarifiers</span>
            <span className="text-error font-headline italic font-bold">0%</span>
          </div>
          <div className="flex items-center justify-between py-4 border-b border-outline-variant/30">
            <span className="font-bold text-on-surface font-body">Artificial Colors</span>
            <span className="text-error font-headline italic font-bold">None</span>
          </div>
        </div>
        <div className="bg-primary/5 p-6 rounded-2xl border-l-[4px] border-primary flex items-start gap-4">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
          <span className="italic text-primary font-body text-sm leading-relaxed">
            "Our traditional clarification process uses vegetable-based extracts rather than chemical bleaching agents, preserving the deep amber hue and nutritional profile."
          </span>
        </div>
      </div>
      
      <div className="bg-surface-container-highest p-8 rounded-[2.5rem] shadow-sm">
        <h4 className="font-headline text-2xl font-bold text-primary mb-6">Nutrition Facts</h4>
        <div className="text-xs text-on-surface-variant uppercase tracking-widest mb-4 font-bold">Per 100g Serving</div>
        <div className="space-y-4 font-label text-sm">
          <div className="flex justify-between border-b border-outline-variant/40 pb-3">
            <span className="font-bold text-on-surface">Energy</span>
            <span>383 kcal</span>
          </div>
          <div className="flex justify-between border-b border-outline-variant/40 pb-3">
            <span className="font-bold text-on-surface">Carbohydrates</span>
            <span>98g</span>
          </div>
          <div className="flex justify-between border-b border-outline-variant/40 pb-3">
            <span className="font-bold text-on-surface">Iron</span>
            <span>11mg (61% DV)</span>
          </div>
          <div className="flex justify-between border-b border-outline-variant/40 pb-3">
            <span className="font-bold text-on-surface">Magnesium</span>
            <span>160mg (40% DV)</span>
          </div>
          <div className="flex justify-between border-b border-outline-variant/40 pb-3">
            <span className="font-bold text-on-surface">Potassium</span>
            <span>1050mg (22% DV)</span>
          </div>
          <div className="mt-6 text-[10px] text-on-surface-variant italic font-body">
            *Daily Value (DV) based on a 2000 calorie diet.
          </div>
        </div>
      </div>
    </section>
  );
}
