// src/lib/http.ts

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

export type HttpOptions = RequestInit & {
  query?: Record<string, string | number | boolean | undefined>;
};

/**
 * Construye la URL completa con query params
 */
function buildUrl(path: string, query?: HttpOptions["query"]) {
  const base = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;
  const url = new URL(path.replace(/^\//, ""), base);

  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        url.searchParams.set(k, String(v));
      }
    });
  }

  return url.toString();
}

/**
 * Cliente HTTP genérico
 */
export async function http<T>(path: string, opts: HttpOptions = {}): Promise<T> {
  const url = buildUrl(path, opts.query);

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
    ...opts,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text || url}`);
  }

  // Si el endpoint devuelve 204 (sin contenido)
  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}
