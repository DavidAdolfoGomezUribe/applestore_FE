// src/api/login.ts
import { http } from "../lib/http";
import type {
  User,
  LoginCredentials,
  LoginResponse,
  AuthState,
} from "../types/auth";

const LS_TOKEN_KEY = "access_token";
const LS_TOKEN_TYPE_KEY = "token_type";
const LS_USER_KEY = "user";

/**
 * POST /users/login
 * Guarda access_token, token_type y user en localStorage (si persist === true).
 * Usa asForm=true si tu backend espera form-url-encoded (p.ej. OAuth2PasswordRequestForm de FastAPI).
 */
export async function login(
  credentials: LoginCredentials,
  opts?: { asForm?: boolean; persist?: boolean }
): Promise<LoginResponse> {
  const asForm = opts?.asForm ?? false;
  const persist = opts?.persist ?? true;

  const body = asForm
    ? new URLSearchParams({
        email: credentials.email,
        password: credentials.password,
      })
    : JSON.stringify(credentials);

  const headers = asForm
    ? { "Content-Type": "application/x-www-form-urlencoded" }
    : undefined; // http() ya pone application/json por defecto

  const resp = await http<LoginResponse>("users/login", {
    method: "POST",
    body: body as string | URLSearchParams,
    headers,
  });

  if (persist && typeof window !== "undefined") {
    try {
      localStorage.setItem(LS_TOKEN_KEY, resp.access_token);
      localStorage.setItem(LS_TOKEN_TYPE_KEY, resp.token_type ?? "bearer");
      localStorage.setItem(LS_USER_KEY, JSON.stringify(resp.user));
    } catch {
      // almacenamiento puede fallar (modo privado, quota, etc.)
    }
  }

  return resp;
}

/** Lee token, tipo y usuario guardados localmente. */
export function getStoredAuth(): AuthState {
  if (typeof window === "undefined") {
    return { token: null, token_type: null, user: null };
  }
  const token = localStorage.getItem(LS_TOKEN_KEY);
  const token_type = localStorage.getItem(LS_TOKEN_TYPE_KEY);

  let user: User | null = null;
  const userStr = localStorage.getItem(LS_USER_KEY);
  if (userStr) {
    try {
      user = JSON.parse(userStr) as User;
    } catch {
      user = null;
    }
  }

  return { token, token_type, user };
}

/** Elimina credenciales del storage. */
export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LS_TOKEN_KEY);
  localStorage.removeItem(LS_TOKEN_TYPE_KEY);
  localStorage.removeItem(LS_USER_KEY);
}

/** Header Authorization listo para usar en peticiones autenticadas. */
export function authHeader(): Record<string, string> {
  const { token, token_type } = getStoredAuth();
  if (!token) return {};
  const scheme =
    token_type && /^bearer$/i.test(token_type) ? "Bearer" : token_type ?? "Bearer";
  return { Authorization: `${scheme} ${token}` };
}
