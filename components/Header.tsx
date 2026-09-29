'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const [saudacao, setSaudacao] = useState("OLÁ, SERES!");
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 shrink-0 h-16">
      <div className=" mx-auto px-4 h-full flex items-center justify-between">
        
        {/* LOGO E SAUDAÇÃO */}
        <div className="flex items-end gap-2">
          <Link href="/" className="font-flamezinna text-3xl sm:text-2xl leading-none tracking-widest uppercase flex items-center gap-2 text-white pt-1">
            🔥
          </Link>
          <h2 className='font-black text-xl tracking-tight text-white uppercase'>{saudacao}</h2>
        </div>

        {/* NAVEGAÇÃO COM ESTADO ATIVO AUTOMÁTICO */}
        <nav className="flex items-center gap-6">
          <Link 
            href="/sobre" 
            className={`font-bold text-xs uppercase tracking-widest transition-colors ${
              pathname === '/sobre' 
                ? 'text-orange-500' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sobre
          </Link>

          <Link 
            href="/treinos" 
            className={`font-bold text-xs uppercase tracking-widest transition-colors ${
              pathname === '/treinos' || pathname.startsWith('/treino/') 
                ? 'text-orange-500' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Treinos
          </Link>

          <Link 
            href="/apoiadores" 
            className={`font-bold text-xs uppercase tracking-widest transition-colors ${
              pathname === '/apoiadores' 
                ? 'text-orange-500' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Apoiadores
          </Link>
        </nav>

      </div>
    </header>
  );
}