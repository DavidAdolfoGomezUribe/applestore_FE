// src/components/landing/Iphone14.tsx
import React from "react";
import BgImg from "../../assets/landing/iphone14-bg.png";

type Props = {
  title?: string;
  subtitle?: string;
  learnHref?: string;
  buyHref?: string;
};

export default function Iphone14({
  title = "iPhone 14",
  subtitle = "Big and bigger.",
  learnHref = "#",
  buyHref = "#",
}: Props): React.ReactElement {
  return (
    <section className="relative w-full bg-[#fbfbfd] text-black overflow-hidden min-h-[80vh] sm:min-h-[82vh] md:min-h-[84vh]">
      {/* Texto centrado */}
      <div className="relative z-10 text-center pt-16 sm:pt-20 md:pt-24 px-4">
        <h2 className="mt-12 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight"> 
          {title}
        </h2>
        <p className="mt-20 text-lg sm:text-xl md:text-2xl text-gray-700">{subtitle}</p>
        <div className="mt-4 flex items-center justify-center gap-6">
          <a href={learnHref} className="text-[color:#2997FF] hover:underline text-sm sm:text-base font-medium">
            Learn more
          </a>
          <a href={buyHref} className="text-[color:#2997FF] hover:underline text-sm sm:text-base font-medium">
            Buy
          </a>
        </div>
      </div>

      {/* Imagen centrada, ajustada al fondo sin recortar */}
      <img
        src={BgImg}
        alt="iPhone 14"
        className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 bottom-0 w-[1100px] max-w-[92vw] h-[54vh] sm:h-[58vh] md:h-[62vh] object-contain"
        loading="lazy"
      />
    </section>
  );
}
