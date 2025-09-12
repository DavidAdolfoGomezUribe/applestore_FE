import { useEffect, useState } from "react";
import FloatingChat from "./components/FloatingChat";
import Footer from "./components/footer.tsx";
import Main from "./components/main.tsx";
import Header from "./components/header.tsx";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image_primary_url: string | null;
};

type ProductsResponse = {
  products: Product[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
};

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError(null);
        const res = await fetch("http://localhost:8000/products/");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ProductsResponse = await res.json();
        setProducts(data.products);
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div>
        <Header />
        <Main />
        <Footer />

        <h1 className="bg-blue-500 px-4 text-black py-2 rounded">Chat</h1>

        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">Productos</h2>

          {loading && <p>Cargando...</p>}
          {error && <p className="text-red-600">Error: {error}</p>}

          {!loading && !error && (
            <>
              {products.length === 0 ? (
                <p>No hay productos.</p>
              ) : (
                <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {products.map((p) => (
                    <li
                      key={p.id}
                      className="border rounded p-3 flex items-center gap-3"
                    >
                      {p.image_primary_url && (
                        <img
                          src={p.image_primary_url}
                          alt={p.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-sm text-gray-600">{p.category}</p>
                        <p>${p.price.toFixed(2)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>

      <FloatingChat />
    </>
  );
}

export default App;
