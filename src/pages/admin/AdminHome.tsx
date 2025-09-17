// src/pages/admin/AdminHome.tsx
import React from "react";

export default function AdminHome(): React.ReactElement {
  return (
    <div>
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p className="mt-2 text-gray-600">
        Bienvenido al panel de administración. Selecciona una opción del menú.
      </p>
    </div>
  );
}
