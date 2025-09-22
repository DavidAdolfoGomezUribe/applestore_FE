// src/pages/admin/AdminLayout.tsx
import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout, getStoredAuth } from "../../api/login";
import type { User } from "../../types/auth";

// FONDO DEL PANEL: cambia esta ruta para usar otro fondo en el futuro
import AdminBg from "../../assets/admin/panel-bg.jpg";

export default function AdminLayout(): React.ReactElement {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<User | null>(null);

  useEffect(() => {
    const { user } = getStoredAuth();
    if (user) setAdmin(user);
  }, []);

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    // Fondo aplicado al panel completo
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${AdminBg})` }}
    >
      <div className="min-h-screen flex">
        {/* LATERAL: azul #1261A0 */}
        <aside className="w-64 shrink-0 border-r border-white/20 bg-[#1261A0] text-white">
          <div className="p-4 border-b border-white/20">
            <h1 className="text-lg font-bold">Admin</h1>
            <p className="text-xs text-white/80">Panel de administración</p>
          </div>
          <nav className="p-2 space-y-1">
            <AdminItem to="/admin" end>Dashboard</AdminItem>
            <AdminItem to="/admin/chats">Chats</AdminItem>
            <AdminItem to="/admin/productos">Productos</AdminItem>
            <AdminItem to="/admin/usuarios">Usuarios</AdminItem>
          </nav>
        </aside>

        {/* AREA PRINCIPAL en columna para permitir scroll interno */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* HEADER: azul #072F5F */}
          <div className="h-14 bg-[#072F5F] text-white border-b border-white/10 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {admin && (
                <span className="text-sm text-white/80">
                  Bienvenido, <span className="font-medium text-white">{admin.name}</span>
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          {/* CONTENEDOR CON SCROLL INTERNO PARA LAS PÁGINAS DEL ADMIN (incluye Chats) */}
          <div className="flex-1 min-h-0 overflow-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function AdminItem({ to, end, children }: { to: string; end?: boolean; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "block rounded-lg px-3 py-2 text-sm",
          isActive
            ? "bg-white/20 text-white"
            : "text-white/90 hover:bg-white/10 hover:text-white",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}
