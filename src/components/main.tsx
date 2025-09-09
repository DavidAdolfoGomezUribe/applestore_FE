import React from 'react';

const products = [
  { id: 'iphone-15', name: 'iPhone 15 Pro', price: 1199, img: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/IPhone_15_Pro_Vector.svg' },
  { id: 'ipad-pro', name: 'iPad Pro (M4)', price: 1299, img: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Wikipedia_on_iPad_Pro.jpg' },
  { id: 'macbook-air', name: 'MacBook Air (M3)', price: 1499, img: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Macbook_Air_15_inch_-_2_%28blurred%29.jpg' },
  { id: 'apple-watch', name: 'Apple Watch Series 9', price: 399, img: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/AppleWatchAppleStore.jpg' },
  { id: 'airpods-pro', name: 'AirPods Pro', price: 249, img: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/AirPods_Pro_%282nd_generation%29.jpg' },
  { id: 'imac', name: 'iMac 24” (M3)', price: 1599, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/IMac_M4_2024_2_%28cropped%29.jpg/1015px-IMac_M4_2024_2_%28cropped%29.jpg' },
];

export default function Main(): React.ReactElement {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <section className="rounded-3xl bg-gradient-to-br from-gray-100 to-white border p-8 mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">Descubre tu próximo dispositivo</h1>
        <p className="text-gray-600 mb-6">Compra productos Apple con envíos rápidos y garantía.</p>
        <a href="#catalogo" className="inline-block rounded-full bg-black text-white px-5 py-2 text-sm hover:opacity-90">Ver catálogo</a>
      </section>

      <section id="catalogo" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <article key={p.id} className="group rounded-3xl border p-5 hover:shadow-lg transition bg-white">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-white">
              <img src={p.img} alt={p.name} className="h-full w-full object-contain p-6 group-hover:scale-105 transition" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{p.name}</h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-700">${p.price.toLocaleString()}</span>
              <button className="rounded-full bg-black text-white px-4 py-1.5 text-sm hover:opacity-90">Agregar</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
