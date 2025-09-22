// src/components/landing/Hero.tsx
import React from "react";
import BgImg from "../../assets/landing/hero-bg.png"; // reemplaza si usas otro nombre

type Props = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
};

export default function Hero({
  title = "Apple Shopping Event",
  subtitle = "From November 25 to 28, get an Apple Gift Card when you buy an eligible product.",
  ctaLabel = "Get an early look",
  onCtaClick,
}: Props): React.ReactElement {
  return (
    <section className="relative w-full bg-black min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh]">
      {/* Fondo que SIEMPRE ocupa todo el contenedor */}
      <img
        src={BgImg}
        alt="Apple products background"
        className="absolute inset-0 h-full w-full object-cover object-bottom"
        loading="eager"
      />
      {/* Degradado para legibilidad arriba */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/85 via-black/50 to-transparent" />
      
      {/* Contenido */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-16 sm:pt-20 md:pt-24 text-center text-gray-200">
        <h1 className="font-semibold tracking-tight text-4xl sm:text-5xl md:text-6xl text-white">
          {title}
        </h1>
        <p className="mt-3 text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          {subtitle}
          <sup className="align-super text-xs text-gray-400">1</sup>
        </p>
        <div className="mt-4">
          <button
            onClick={onCtaClick}
            className="text-sky-400 hover:underline decoration-2 underline-offset-2 text-sm sm:text-base"
            aria-label={ctaLabel}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
