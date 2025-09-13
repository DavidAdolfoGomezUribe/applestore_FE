// src/components/main.tsx
import React, { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import type { Product } from "../types/product";

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "USD",
});

export default function Main(): React.ReactElement {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setError(null);
        setLoading(true);
        const res = await getProducts({ page: 1, page_size: 20 });
        if (!alive) return;
        setProducts(res.products);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Error desconocido");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <section className="rounded-3xl bg-gradient-to-br from-gray-100 to-white border p-8 mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          Descubre tu próximo dispositivo
        </h1>
        <p className="text-gray-600 mb-6">
          Compra productos Apple con envíos rápidos y garantía.
        </p>
        <a
          href="#catalogo"
          className="inline-block rounded-full bg-black text-white px-5 py-2 text-sm hover:opacity-90"
        >
          Ver catálogo
        </a>
      </section>

      <section id="catalogo" className="min-h-[200px]">
        {loading && <p>Cargando productos...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <p>No hay productos disponibles.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <article
                    key={p.id}
                    className="group rounded-3xl border p-5 hover:shadow-lg transition bg-white"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-white">
                      <img
                        src={
                          p.image_primary_url ||
                          "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                        }
                        alt={p.name}
                        className="h-full w-full object-contain p-6 group-hover:scale-105 transition"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{p.name}</h3>
                    <p className="text-sm text-gray-600">{p.category}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-700">
                        {currency.format(p.price)}
                      </span>
                      <button className="rounded-full bg-black text-white px-4 py-1.5 text-sm hover:opacity-90">
                        Agregar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
