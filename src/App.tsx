
import FloatingChat from "./components/FloatingChat";
import Footer from "./components/footer.tsx";
import Main from "./components/main.tsx";
import Header from "./components/header.tsx";

import { getProducts } from "./api/products.ts";
async function logsito() {
  const data = await getProducts()
  console.log( data)
}

logsito()
function App() {
  
return (
    <>
      <div>
        <Header />
        <Main />
        <Footer />

        <h1 className="bg-blue-500 px-4 text-black py-2 rounded">Chat</h1>

        
      </div>

      <FloatingChat />
    </>
  );
}

export default App;
