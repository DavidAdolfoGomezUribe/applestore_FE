// src/components/landing/TvBanner.tsx
import React from "react";
import BgImg from "../../assets/landing/tv-spirited-bg.png";
import AppleIcon from "../../assets/apple.svg";

type Props = {
  leftActor?: string;
  rightActor?: string;
  title?: string;
  subtitle?: string;
  status?: string;
};

export default function TvBanner({
  leftActor = "Will Ferrell",
  rightActor = "Ryan Reynolds",
  title = "Spirited",
  subtitle = "A new musical comedy based on a holiday classic.",
  status = "Now streaming",
}: Props): React.ReactElement {
  return (
    <section className="relative w-full bg-black min-h-[70vh] sm:min-h-[75vh] md:min-h-[80vh]">
      {/* Background */}
      <img
        src={BgImg}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="lazy"
      />

      {/* Nombres arriba */}
      <div className="absolute left-0 right-0 top-6 sm:top-8 md:top-10 mx-auto max-w-6xl px-4 text-white">
        <div className="flex items-center justify-between text-[12px] sm:text-sm md:text-base font-semibold tracking-wide">
          <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] text-4xl">{leftActor}</span>
          <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] text-4xl">{rightActor}</span>
        </div>
      </div>

      {/* Contenido centrado */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4">
          {/* Apple TV+ */}
          <div className="inline-flex items-center justify-center gap-2 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]">
            <img src={AppleIcon} alt="Apple" className="h-5 w-5 sm:h-6 sm:w-6" />
            
          </div>

          {/* Título en beige */}
          <h2
            className="mt-3 md:mt-4 font-serif font-semibold leading-[0.9] drop-shadow-[0_4px_16px_rgba(0,0,0,0.65)]"
            style={{ color: "#EDE3CD", fontSize: "clamp(40px, 12vw, 120px)" }}
          >
            
          </h2>

          {/* Subtítulo y estado */}
          <p className="mt-135 text-white text-[13px] sm:text-base md:text-lg drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            {subtitle}
          </p>
          <p className="mt-2 text-white/90 text-xs sm:text-sm md:text-base drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            {status}
          </p>
        </div>
      </div>
    </section>
  );
}
