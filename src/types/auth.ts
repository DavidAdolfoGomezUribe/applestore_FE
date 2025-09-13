// src/types/auth.ts

export type User = {
  id: number;
  name: string;
  email: string;
  role: string; // "user" | "admin" | etc.
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string; // "bearer"
  user: User;
};

// Útil si quieres tipar el estado de auth en el front (opcional):
export type AuthState = {
  token: string | null;
  token_type: string | null;
  user: User | null;
};
