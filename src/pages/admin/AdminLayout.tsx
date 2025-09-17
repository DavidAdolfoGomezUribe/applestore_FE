// src/pages/admin/AdminLayout.tsx
import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout, getStoredAuth } from "../../api/login";
import type { User } from "../../types/auth";

export default function AdminLayout(): React.ReactElement {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<User | null>(null);

  useEffect(() => {
    const { user } = getStoredAuth();
    if (user) setAdmin(user);
  }, []);

  function handleLogout() {
    logout(); // limpia localStorage
    navigate("/", { replace: true }); // redirige al home
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r bg-white">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold">Admin</h1>
          <p className="text-xs text-gray-500">Panel de administración</p>
        </div>

        <nav className="p-2 space-y-1">
          <AdminItem to="/admin" end>
            Dashboard
          </AdminItem>
          <AdminItem to="/admin/chats">Chats</AdminItem>
          <AdminItem to="/admin/productos">Productos</AdminItem>
          <AdminItem to="/admin/usuarios">Usuarios</AdminItem>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Topbar con nombre del admin y logout */}
        <div className="h-14 border-b bg-white px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold">Panel</span>
            {admin && (
              <span className="text-sm text-gray-600">
                Bienvenido, <span className="font-medium">{admin.name}</span>
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

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function AdminItem({
  to,
  end,
  children,
}: {
  to: string;
  end?: boolean;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "block rounded-lg px-3 py-2 text-sm",
          isActive
            ? "bg-black text-white"
            : "text-gray-700 hover:bg-gray-100",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}
