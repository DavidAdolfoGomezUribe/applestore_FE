// src/components/main.tsx
import React from "react";
import Hero from "./landing/Hero";
import TvBanner from "./landing/TvBanner";
import Iphone14 from "./landing/Iphone14";

export default function Main(): React.ReactElement {
  return (
    <main className="w-full bg-black">
      <Hero />
      <TvBanner />
      <Iphone14 />
      {/* Próximas secciones:
          <FeaturedGrid />
          <PromoBanner />
          <CategoryStrips />
      */}
    </main>
  );
}
