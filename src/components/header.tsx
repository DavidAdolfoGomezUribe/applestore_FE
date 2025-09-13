// src/components/header.tsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getStoredAuth, logout } from "../api/login";
import type { User } from "../types/auth";

// export type Props = {};

export default function Header(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<User | null>(() => getStoredAuth().user);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Refresca usuario cuando cambia la URL (después de login/logout)
  useEffect(() => {
    setUser(getStoredAuth().user);
  }, [location.key]);

  // Escucha cambios de storage (login/logout en otra pestaña)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === "user" || e.key === "access_token" || e.key === "token_type") {
        setUser(getStoredAuth().user);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setMenuOpen(false);
    navigate("/", { replace: true });
  };

  const firstName = user?.name?.split(" ")[0] ?? "";
  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .map((n) => n[0]?.toUpperCase())
        .slice(0, 2)
        .join("")
    : "👤";

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur bg-white/70 border-b">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white font-bold">
            
          </span>
          <span className="text-lg font-semibold">Apple Store</span>
        </div>

        {/* Nav (placeholder) */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#" className="hover:text-black/70">iPhone</a>
          <a href="#" className="hover:text-black/70">iPad</a>
          <a href="#" className="hover:text-black/70">Mac</a>
          <a href="#" className="hover:text-black/70">Watch</a>
          <a href="#" className="hover:text-black/70">Accessories</a>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 relative" ref={menuRef}>
          <input
            className="hidden sm:block w-40 rounded-xl border px-3 py-1.5 text-sm"
            placeholder="Buscar productos..."
          />

          {!user ? (
            // Botón "Ingresar"
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-full border px-4 py-1.5 text-sm hover:bg-black hover:text-white transition"
            >
              Ingresar
            </button>
          ) : (
            // Usuario + menú
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-black hover:text-white transition"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-white text-xs">
                  {initials.length >= 2 ? initials : "👤"}
                </span>
                <span className="max-w-[120px] truncate">{firstName || "Usuario"}</span>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-44 rounded-xl border bg-white shadow-lg overflow-hidden"
                >
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => {
                      setMenuOpen(false);
                      // Placeholder: más adelante lo implementamos
                      // Por ahora, puede ser un modal o solo navegar a una ruta futura:
                      // navigate("/account");
                      alert("Info: próximamente 😉");
                    }}
                  >
                    Info
                  </button>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
