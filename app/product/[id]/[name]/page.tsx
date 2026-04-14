import React from "react";
import ProductPageClient from "./components/ProductPageClient";

export default async function ProductPage({ params }: { params: Promise<{ id: string; name?: string }> }) {
  const resolvedParams = await params;
  return <ProductPageClient id={resolvedParams.id} name={resolvedParams.name} />;
}