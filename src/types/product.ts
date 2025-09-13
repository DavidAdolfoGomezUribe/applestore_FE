// src/types/product.ts

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
  page?: number;
  page_size?: number;
  total_pages?: number;
};
