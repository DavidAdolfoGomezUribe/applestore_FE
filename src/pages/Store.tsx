// src/pages/Store.tsx
import React, { useEffect, useMemo, useState } from "react";
import { getProducts } from "../api/products";
import type { Product, ProductsListResponse } from "../types/product";

// Extensión opcional del tipo Product para campos frecuentes del catálogo.
// (Si tu Product ya define alguno, se unifica sin problemas.)
type ProductExt = Product & {
  price?: number;
  currency?: string;
  stock?: number;
  sku?: string;
  brand?: string;
};

// Componente de icono por categoría (fallback: caja)
function CategoryIcon({ category }: { category?: string | null }) {
  const cat = (category || "").toLowerCase();
  const common = "h-10 w-10";
  if (cat.includes("mac") || cat.includes("laptop")) {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden>
        <path fill="currentColor" d="M3 5h18v11H3zM1 18h22v1H1z" />
      </svg>
    );
  }
  if (cat.includes("iphone") || cat.includes("phone")) {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden>
        <path fill="currentColor" d="M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2zm0 2v16h10V4H7z" />
      </svg>
    );
  }
  if (cat.includes("watch")) {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden>
        <path fill="currentColor" d="M7 7h10v10H7zM9 2h6v3H9zM9 19h6v3H9z" />
      </svg>
    );
  }
  if (cat.includes("airpod") || cat.includes("audio") || cat.includes("head")) {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden>
        <path fill="currentColor" d="M7 7a4 4 0 118 0v7a3 3 0 01-3 3h-1v-2h1a1 1 0 001-1V7a2 2 0 10-4 0v8H7V7z" />
      </svg>
    );
  }
  if (cat.includes("tv") || cat.includes("home")) {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden>
        <path fill="currentColor" d="M3 5h18v10H3zM8 17h8v2H8z" />
      </svg>
    );
  }
  // fallback: caja
  return (
    <svg viewBox="0 0 24 24" className={common} aria-hidden>
      <path fill="currentColor" d="M3 7l9-5 9 5-9 5-9-5zm0 3l9 5 9-5v7l-9 5-9-5V10z" />
    </svg>
  );
}

function formatMoney(value?: number | null, currency?: string | null) {
  const val = typeof value === "number" ? value : 0;
  const cur = (currency || "USD").toUpperCase();
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: cur }).format(val);
  } catch {
    return `$${val.toFixed(2)} ${cur}`;
  }
}

type Query = {
  page: number;
  page_size: number;
  search: string;
  category: string;
};

export default function Store(): React.ReactElement {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<ProductsListResponse | null>(null);

  const [query, setQuery] = useState<Query>({
    page: 1,
    page_size: 12,
    search: "",
    category: "",
  });

  useEffect(() => {
    let cancel = false;
    async function run() {
      try {
        setLoading(true);
        setErr(null);
        const res = await getProducts({
          page: query.page,
          page_size: query.page_size,
          search: query.search || undefined,
          category: query.category || undefined,
        });
        if (!cancel) setData(res);
      } catch (e) {
        if (!cancel) setErr(e instanceof Error ? e.message : "Error cargando productos");
      } finally {
        if (!cancel) setLoading(false);
      }
    }
    void run();
    return () => { cancel = true; };
  }, [query.page, query.page_size, query.search, query.category]);

  const total = data?.total ?? 0;
  const products = data?.products ?? [];
  const totalPages = Math.max(1, Math.ceil(total / query.page_size));

  const canPrev = query.page > 1;
  const canNext = query.page < totalPages;

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) if ((p as ProductExt).category) set.add((p as ProductExt).category as string);
    return Array.from(set).sort();
  }, [products]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Store</h1>
          <p className="text-sm text-gray-600">
            Catálogo de productos ({total.toLocaleString()} en total)
          </p>
        </div>
        <div className="flex gap-2">
          <input
            value={query.search}
            onChange={(e) => setQuery((q) => ({ ...q, page: 1, search: e.target.value }))}
            placeholder="Buscar por nombre, descripción…"
            className="w-64 max-w-[60vw] rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
          />
          <select
            value={query.category}
            onChange={(e) => setQuery((q) => ({ ...q, page: 1, category: e.target.value }))}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </header>

      <section className="mt-6">
        {err && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        )}
        {loading && (
          <div className="text-sm text-gray-600">Cargando productos…</div>
        )}

        {/* Grid de tarjetas */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p: Product) => {
            const pe = p as ProductExt;
            return (
              <article
                key={p.id}
                className="group rounded-2xl border bg-white/90 backdrop-blur transition hover:shadow-md"
              >
                <div className="flex items-start gap-3 p-4">
                  <div className="shrink-0 rounded-xl bg-gray-100 p-3 text-gray-700 group-hover:text-black">
                    <CategoryIcon category={pe.category ?? null} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-snug truncate">{p.name}</h3>
                      <span className="whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatMoney(pe.price, pe.currency)}
                      </span>
                    </div>
                    {pe.category && (
                      <div className="mt-0.5 text-xs text-gray-500">{pe.category}</div>
                    )}
                    {"description" in p && p.description && (
                      <p className="mt-2 line-clamp-3 text-sm text-gray-700">{p.description}</p>
                    )}
                    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
                      {typeof pe.stock === "number" && (
                        <>
                          <dt className="opacity-70">Stock</dt>
                          <dd>{String(pe.stock)}</dd>
                        </>
                      )}
                      {pe.sku && (
                        <>
                          <dt className="opacity-70">SKU</dt>
                          <dd className="truncate">{pe.sku}</dd>
                        </>
                      )}
                      {pe.brand && (
                        <>
                          <dt className="opacity-70">Marca</dt>
                          <dd className="truncate">{pe.brand}</dd>
                        </>
                      )}
                    </dl>
                  </div>
                </div>
                {/* Actions (placeholder) */}
                <div className="flex items-center justify-end gap-2 p-3 border-t bg-gray-50/60">
                  <button className="rounded-md border px-3 py-1.5 text-xs hover:bg-gray-100">
                    Ver detalle
                  </button>
                  <button className="rounded-md bg-black px-3 py-1.5 text-xs text-white hover:opacity-90">
                    Agregar
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Paginación */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Página {query.page} de {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={!canPrev}
              onClick={() => setQuery((q) => ({ ...q, page: q.page - 1 }))}
              className={`rounded-md border px-3 py-1.5 text-sm ${canPrev ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"}`}
            >
              Anterior
            </button>
            <button
              disabled={!canNext}
              onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}
              className={`rounded-md border px-3 py-1.5 text-sm ${canNext ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"}`}
            >
              Siguiente
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
