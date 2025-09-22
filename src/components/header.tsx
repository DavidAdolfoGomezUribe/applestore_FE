// src/components/header.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getStoredAuth, logout } from "../api/login";
import type { User } from "../types/auth";

import AppleIcon from "../assets/apple.svg";
import SearchIcon from "../assets/search.svg";
import BagIcon from "../assets/bag.svg";
import MenuIcon from "../assets/menu.svg";

const navItems = [
  { label: "Store", to: "/store" }, // <- redirige a la nueva página
  { label: "Mac", to: "/" },
  { label: "iPad", to: "/" },
  { label: "iPhone", to: "/" },
  { label: "Watch", to: "/" },
  { label: "AirPods", to: "/" },
  { label: "TV & Home", to: "/" },
  { label: "Only on Apple", to: "/" },
  { label: "Accessories", to: "/" },
  { label: "Support", to: "/" },
];

export default function Header(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(() => getStoredAuth().user);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setUser(getStoredAuth().user); }, [location.key]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60 text-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-12 items-center justify-between">
          <Link to="/" className="shrink-0 flex items-center p-1 hover:opacity-80">
            <img src={AppleIcon} alt="Apple" className="h-4 w-4" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((it) => (
              <Link key={it.label} to={it.to} className="hover:text-white transition-colors">
                {it.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              aria-label="Buscar"
              className="hidden md:inline-flex p-2 rounded hover:bg-white/10 transition"
              onClick={() => navigate("/")}
            >
              <img src={SearchIcon} className="h-4 w-4" />
            </button>
            <button
              aria-label="Bolsa / Panel"
              className="hidden md:inline-flex p-2 rounded hover:bg-white/10 transition"
              onClick={() => navigate(user ? "/admin" : "/login")}
              title={user ? "Panel" : "Login"}
            >
              <img src={BagIcon} className="h-4 w-4" />
            </button>

            <button
              className="md:hidden inline-flex p-2 rounded hover:bg-white/10"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Abrir menú"
            >
              <img src={MenuIcon} className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={menuRef}
          className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${menuOpen ? "max-h-96" : "max-h-0"}`}
        >
          <nav className="py-2 border-t border-white/10">
            {navItems.map((it) => (
              <Link
                key={it.label}
                to={it.to}
                className="block px-2 py-2 text-sm hover:bg-white/5"
                onClick={() => setMenuOpen(false)}
              >
                {it.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-white/10">
              {user ? (
                <>
                  <Link
                    to="/admin"
                    className="block px-2 py-2 text-sm hover:bg-white/5"
                    onClick={() => setMenuOpen(false)}
                  >
                    Panel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-2 py-2 text-sm text-red-300 hover:bg-white/5"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-2 py-2 text-sm hover:bg-white/5"
                  onClick={() => setMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
