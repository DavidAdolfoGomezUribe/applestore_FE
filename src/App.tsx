// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import Header from './components/header.tsx'
import Main from './components/main.tsx'
import Footer from './components/footer.tsx'


function App() {
  

  return (
    <>
      <div> 
        <Header />
        <Main />
        <Footer />

        <h1 className="bg-blue-500 px-4 text-black py-2 rounded " >Chat</h1>
      </div>
      
    </>
  )
}

export default App
