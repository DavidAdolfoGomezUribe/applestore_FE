import React from 'react';
export type Props = {};

export default function Header(): React.ReactElement {{
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur bg-white/70 border-b">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white font-bold"></span>
          <span className="text-lg font-semibold">Apple Store</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#" className="hover:text-black/70">iPhone</a>
          <a href="#" className="hover:text-black/70">iPad</a>
          <a href="#" className="hover:text-black/70">Mac</a>
          <a href="#" className="hover:text-black/70">Watch</a>
          <a href="#" className="hover:text-black/70">Accessories</a>
        </nav>
        <div className="flex items-center gap-3">
          <input className="hidden sm:block w-40 rounded-xl border px-3 py-1.5 text-sm" placeholder="Buscar productos..." />
          <button className="rounded-full border px-3 py-1.5 text-sm hover:bg-black hover:text-white transition">Ingresar</button>
        </div>
      </div>
    </header>
  );
}}
