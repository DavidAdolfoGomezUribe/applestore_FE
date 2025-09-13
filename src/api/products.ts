// src/api/products.ts

// 👉 Temporalmente definimos los tipos aquí. Luego los moveremos a src/types/product.ts
export type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image_primary_url: string | null;
  image_secondary_url: string | null;
  image_tertiary_url: string | null;
  release_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductsListResponse = {
  products: Product[];
  total: number;
  // Si luego tu API expone paginación, aquí añadimos page, page_size, total_pages
};

// 👇 Usamos la base desde .env (Vite expone variables que empiecen por VITE_)
const BASE_URL=(import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";
console.log(BASE_URL)

// Pequeño helper para construir URLs (permite query params opcionales)
function buildUrl(path: string, query?: Record<string, string | number | boolean | undefined>) {
  const base = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;
  const url = new URL(path.replace(/^\//, ""), base);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

/**
 * GET /products
 * Devuelve { products: Product[], total: number }
 * Puedes pasar query params en el futuro (page, page_size, search, category, etc.)
 */
export async function getProducts(params?: {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
}) {
  const url = buildUrl("products", params);
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text || url}`);
  }
  const data = (await res.json()) as ProductsListResponse;
  // Aseguramos forma mínima para evitar undefined en el front
  return {
    products: Array.isArray(data.products) ? data.products : [],
    total: typeof data.total === "number" ? data.total : 0,
  } satisfies ProductsListResponse;
}

/**
 * GET /products/:id
 * Si tu backend expone este endpoint, úsalo para obtener detalle.
 */
export async function getProductById(id: number) {
  const url = buildUrl(`products/${id}`);
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text || url}`);
  }
  return (await res.json()) as Product;
}
