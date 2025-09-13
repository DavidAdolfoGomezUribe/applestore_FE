import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import FloatingChat from "./components/FloatingChat";
import Main from "./components/main";
import Login from "./pages/login";

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

        <Route path="/login" element={<Login />} />
        <Route element={<SiteLayout />}>
          <Route index element={<Main />} />
        </Route>
        <Route path="*" element={<div style={{ padding: 24 }}>404</div>} />


      </Routes>
    </BrowserRouter>
  );
}
