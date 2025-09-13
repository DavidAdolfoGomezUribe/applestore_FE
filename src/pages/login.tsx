// src/pages/Login.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login, getStoredAuth, register } from "../api/login";

type LocationState = { from?: { pathname?: string } } | null;

export default function Login(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || null;
  const redirectTo = state?.from?.pathname || "/";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState(""); // solo para registro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // 👇 rol por defecto para registro (tu backend espera el campo "rol")
  const DEFAULT_ROLE = "user"; // ← dejamos el rol fijo como "user" (placeholder configurable)

  // Si ya hay sesión, evita mostrar el login/registro
  useEffect(() => {
    const { token } = getStoredAuth();
    if (token) navigate(redirectTo, { replace: true });
  }, [navigate, redirectTo]);

  function parseBackendError(err: unknown): string {
    if (err instanceof Error) {
      const parts = err.message.split(" - ");
      const tail = parts[parts.length - 1];
      try {
        const json = JSON.parse(tail);
        if (json?.detail) {
          return typeof json.detail === "string"
            ? json.detail
            : JSON.stringify(json.detail);
        }
      } catch {
        /* no-op */
      }
      return err.message;
    }
    return "Ocurrió un error";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      if (mode === "login") {
        // Backend espera JSON: { email, password }
        await login({ email, password }, { persist: true });
        navigate(redirectTo, { replace: true });
      } else {
        // Registro: { name, email, password, rol: "user" }
        await register({ name, email, password, rol: DEFAULT_ROLE });
        // No auto-logueamos: mostramos aviso y cambiamos a modo login
        setInfo("Registro exitoso. Ahora puedes iniciar sesión.");
        setMode("login");
      }
    } catch (err) {
      setError(parseBackendError(err));
    } finally {
      setLoading(false);
    }
  }

  const isRegister = mode === "register";
  const title = isRegister ? "Crear cuenta" : "Iniciar sesión";
  const cta = isRegister ? "Crear cuenta" : "Ingresar";

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-1">{title}</h1>
        <p className="text-sm text-gray-600 mb-6">
          {isRegister
            ? "Regístrate para continuar."
            : "Ingresa tus credenciales para continuar."}
        </p>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {info && (
          <div
            role="status"
            className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700"
          >
            {info}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {isRegister && (
            <label className="block">
              <span className="block text-sm font-medium">Nombre</span>
              <input
                type="text"
                name="name"
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                placeholder="Tu nombre"
                required
              />
            </label>
          )}

          {!isRegister && (
            <label className="block">
              <span className="block text-sm font-medium">Correo</span>
              <input
                type="email"
                name="email"
                value={email}
                autoFocus
                autoComplete="email"
                autoCapitalize="none"
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </label>
          )}

          {isRegister && (
            <label className="block">
              <span className="block text-sm font-medium">Correo</span>
              <input
                type="email"
                name="email"
                value={email}
                autoComplete="email"
                autoCapitalize="none"
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </label>
          )}

          <label className="block">
            <span className="block text-sm font-medium">Contraseña</span>
            <div className="mt-1 flex rounded-lg border overflow-hidden">
              <input
                type={show ? "text" : "password"}
                name="password"
                value={password}
                autoComplete={isRegister ? "new-password" : "current-password"}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-pressed={show}
                title={show ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="px-3 text-sm text-gray-600 hover:text-black"
              >
                {show ? "Ocultar" : "Ver"}
              </button>
            </div>
          </label>

          {/* rol fijo como "user" (no se muestra en el formulario) */}
          {/* Se envía en el payload del registro: { rol: DEFAULT_ROLE } */}

          <button
            type="submit"
            disabled={
              loading ||
              !email ||
              !password ||
              (isRegister && !name)
            }
            className="w-full rounded-full bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (isRegister ? "Creando..." : "Ingresando...") : cta}
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-700">
          {isRegister ? (
            <>
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setInfo(null);
                }}
                className="underline hover:opacity-80"
              >
                Inicia sesión
              </button>
            </>
          ) : (
            <>
              ¿No estás registrado?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                  setInfo(null);
                }}
                className="underline hover:opacity-80"
              >
                Regístrate
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
