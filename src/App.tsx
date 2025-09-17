import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import FloatingChat from "./components/FloatingChat";
import Main from "./components/main";
import Login from "./pages/login";
import AdminRoute from "./routes/AdminRoute";

// NUEVO: imports para admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import ChatsPage from "./pages/admin/ChatsPage";
import ProductsPage from "./pages/admin/ProductsPage";
import UsersPage from "./pages/admin/UsersPage";

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
        </Route>

        {/* Rutas de Admin: FUERA del SiteLayout (sin header/footer) */}
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
