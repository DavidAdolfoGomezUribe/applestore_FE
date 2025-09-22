// src/api/login.ts
import { http } from "../lib/http";
import type {
  User,
  LoginCredentials,
  LoginResponse,
  AuthState,
  RegisterPayload,
  RegisterResponse,
} from "../types/auth";

const LS_TOKEN_KEY = "access_token";
const LS_TOKEN_TYPE_KEY = "token_type";
const LS_USER_KEY = "user";

/** ====== REGISTER ====== */
export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const user = await http<User>("users/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return user;
}
/** ====== /REGISTER ====== */

/** ====== LOGIN ====== */
export async function login(
  credentials: LoginCredentials,
  opts?: { persist?: boolean }
): Promise<LoginResponse> {
  const persist = opts?.persist ?? true;

  const resp = await http<LoginResponse>("users/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (persist && typeof window !== "undefined") {
    try {
      localStorage.setItem(LS_TOKEN_KEY, resp.access_token);
      localStorage.setItem(LS_TOKEN_TYPE_KEY, resp.token_type ?? "bearer");
      localStorage.setItem(LS_USER_KEY, JSON.stringify(resp.user));
    } catch {
      // no-op
    }
  }

  return resp;
}
/** ====== /LOGIN ====== */

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

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LS_TOKEN_KEY);
  localStorage.removeItem(LS_TOKEN_TYPE_KEY);
  localStorage.removeItem(LS_USER_KEY);
}

export function authHeader(): Record<string, string> {
  const { token, token_type } = getStoredAuth();
  if (!token) return {};
  const scheme =
    token_type && /^bearer$/i.test(token_type) ? "Bearer" : token_type ?? "Bearer";
  return { Authorization: `${scheme} ${token}` };
}
