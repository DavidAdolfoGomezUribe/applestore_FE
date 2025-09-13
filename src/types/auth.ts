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

// Estado de autenticación en el front (opcional)
export type AuthState = {
  token: string | null;
  token_type: string | null;
  user: User | null;
};

// ===== Registro =====
// OJO: el backend espera "rol" (una sola L)
export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  rol: string; // "admin" | "user" | ...
};

// La respuesta de /users/register es el usuario creado
export type RegisterResponse = User;
