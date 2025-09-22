// src/routes/AdminRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function getStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export default function AdminRoute({ children }: { children: React.ReactElement }) {
  const location = useLocation();
  const user = getStoredUser();
  const role = (user?.role ?? user?.rol ?? "").toLowerCase();
  const isAdmin = role === "admin";
  if (!isAdmin) return <Navigate to="/" replace state={{ from: location }} />;
  return children;
}
