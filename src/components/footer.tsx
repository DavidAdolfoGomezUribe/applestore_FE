import React from 'react';

export default function Footer(): React.ReactElement {{
  return (
    <footer className="border-t mt-10">
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-3">
        <p>© ${new Date().getFullYear()} Apple Store (demo). Todos los derechos reservados.</p>
        <nav className="flex items-center gap-4">
          <a href="#" className="hover:text-black/70">Términos</a>
          <a href="#" className="hover:text-black/70">Privacidad</a>
          <a href="#" className="hover:text-black/70">Soporte</a>
        </nav>
      </div>
    </footer>
  );
}}
