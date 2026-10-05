'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const [saudacao, setSaudacao] = useState("OLÁ, SERES!");
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const horaAtual = new Date().getHours();
    if (horaAtual >= 5 && horaAtual < 12) {
      setSaudacao("BOOOM DIA, SERES!");
    } else if (horaAtual >= 12 && horaAtual < 18) {
      setSaudacao("BOOOA TARDE, SERES!");
    } else {
      setSaudacao("BOOOA NOITE, SERES!");
    }
  }, []);

  // Fecha o menu mobile ao trocar de página
  useEffect(() => {
    setMenuMobileAberto(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 shrink-0 h-16">
      <div className="mx-auto px-4 h-full flex items-center justify-between">
        
        {/* LOGO E SAUDAÇÃO RESPONSIVA */}
        <div className="flex items-end gap-2 overflow-hidden">
          <Link href="/" className="font-flamezinna text-3xl leading-none tracking-widest uppercase flex items-center gap-2 text-white pt-1 shrink-0">
            🔥
          </Link>
          <h2 className="font-bold text-md tracking-tight text-white uppercase truncate">
            {saudacao}
          </h2>
        </div>

        {/* NAVEGAÇÃO DESKTOP */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/sobre" 
            className={`font-bold text-xs uppercase tracking-widest transition-colors ${
              pathname === '/sobre' ? 'text-orange-500' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sobre
          </Link>

          <Link 
            href="/treinos" 
            className={`font-bold text-xs uppercase tracking-widest transition-colors ${
              pathname === '/treinos' || pathname.startsWith('/treino/') ? 'text-orange-500' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Treinos
          </Link>

          <Link 
            href="/apoiadores" 
            className={`font-bold text-xs uppercase tracking-widest transition-colors ${
              pathname === '/apoiadores' ? 'text-orange-500' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Apoiadores
          </Link>
          <Link 
            href="/admin" 
            className={`font-bold text-xs uppercase tracking-widest transition-colors ${
              pathname === '/admin' ? 'text-orange-500' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Admin
          </Link>
        </nav>

        {/* BOTÃO DO MENU MOBILE */}
        <button 
          onClick={() => setMenuMobileAberto(!menuMobileAberto)}
          className="md:hidden text-white p-2 focus:outline-none flex items-center justify-center"
          aria-label="Abrir Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {menuMobileAberto ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

      </div>

      {/* DROPDOWN MENU MOBILE */}
      {menuMobileAberto && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <Link 
            href="/sobre" 
            className={`font-bold text-sm uppercase tracking-widest transition-colors py-2 border-b border-white/5 ${
              pathname === '/sobre' ? 'text-orange-500' : 'text-neutral-400'
            }`}
          >
            Sobre
          </Link>

          <Link 
            href="/treinos" 
            className={`font-bold text-sm uppercase tracking-widest transition-colors py-2 border-b border-white/5 ${
              pathname === '/treinos' || pathname.startsWith('/treino/') ? 'text-orange-500' : 'text-neutral-400'
            }`}
          >
            Treinos
          </Link>

          <Link 
            href="/apoiadores" 
            className={`font-bold text-sm uppercase tracking-widest transition-colors py-2 ${
              pathname === '/apoiadores' ? 'text-orange-500' : 'text-neutral-400'
            }`}
          >
            Apoiadores
          </Link>
        </div>
      )}
    </header>
  );
}