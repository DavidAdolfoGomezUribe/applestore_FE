// src/api/products.ts
import { http } from "../lib/http";
import type { Product, ProductsListResponse } from "../types/product";

/**
 * GET /products
 * Soporta query params opcionales (page, page_size, search, category).
 * Devuelve { products, total, ... } tipado.
 */
export function getProducts(params?: {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
}) {
  return http<ProductsListResponse>("products", { query: params });
}

/**
 * GET /products/:id
 * Devuelve el detalle de un producto.
 */
export function getProductById(id: number) {
  return http<Product>(`products/${id}`);
}

/**
 * (Opcionales, si tu backend los expone)
 * POST /products
 */
// export function createProduct(payload: Partial<Product>) {
//   return http<Product>("products", {
//     method: "POST",
//     body: JSON.stringify(payload),
//   });
// }

/**
 * PUT/PATCH /products/:id
 */
// export function updateProduct(id: number, payload: Partial<Product>) {
//   return http<Product>(`products/${id}`, {
//     method: "PUT", // o "PATCH" según tu API
//     body: JSON.stringify(payload),
//   });
// }

/**
 * DELETE /products/:id
 */
// export function deleteProduct(id: number) {
//   return http<void>(`products/${id}`, { method: "DELETE" });
// }
