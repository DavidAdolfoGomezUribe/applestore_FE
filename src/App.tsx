// src/App.tsx
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import FloatingChat from "./components/FloatingChat";
import Main from "./components/main";
import Login from "./pages/login";
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import ChatsPage from "./pages/admin/ChatsPage";
import ProductsPage from "./pages/admin/ProductsPage";
import UsersPage from "./pages/admin/UsersPage";

// 👇 NUEVA PÁGINA STORE
import Store from "./pages/Store";

// Layout SOLO para páginas públicas del sitio (Home, etc.)
function SiteLayout() {
  return (
    <div>
      <Header />
      <Outlet /> {/* aquí se renderiza cada página dentro del layout */}
      <Footer />
      <FloatingChat />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route element={<SiteLayout />}>
          <Route index element={<Main />} />
          {/* 👇 RUTA A LA TIENDA */}
          <Route path="store" element={<Store />} />
        </Route>

        {/* Rutas Admin (sin header/footer) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="chats" element={<ChatsPage />} />
          <Route path="productos" element={<ProductsPage />} />
          <Route path="usuarios" element={<UsersPage />} />
        </Route>

        <Route path="*" element={<div style={{ padding: 24 }}>404</div>} />
      </Routes>
    </BrowserRouter>
  );
}
