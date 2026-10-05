'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
// Importe a sua função real da API
import { getProximosTreinos } from "@/lib/api";

interface TreinoAgenda {
  date: string;
  title: string;
  isNext: boolean;
  slug: string;
}

export default function CavernaHeroAvancado() {
  const [agendaTreinos, setAgendaTreinos] = useState<TreinoAgenda[]>([]);

  useEffect(() => {
    async function fetchAgenda() {
      // 1. Busca os treinos reais do banco de dados
      const treinosDB = await getProximosTreinos();

      if (treinosDB && treinosDB.length > 0) {
        // Pega o ano e mês atual (ex: "2026-10")
        const hoje = new Date();
        const anoAtual = hoje.getFullYear();
        const mesAtual = String(hoje.getMonth() + 1).padStart(2, '0');
        const anoMesAtual = `${anoAtual}-${mesAtual}`;

        // 2. Filtra APENAS os treinos que acontecem no MÊS ATUAL
        const treinosDoMes = treinosDB.filter((treino: any) => {
          if (!treino.data_treino) return false;
          return treino.data_treino.startsWith(anoMesAtual);
        });

        // Se não houver treinos no mês atual, podemos usar a lista geral para o marquee não ficar vazio
        const listaParaExibir = treinosDoMes.length > 0 ? treinosDoMes : treinosDB;

        // 3. Formata os treinos para o Marquee
        const treinosFormatados = listaParaExibir.map((treino: any, index: number) => {
          const partes = treino.data_treino.split('T')[0].split('-');
          const ano = partes[0];
          const mes = partes[1];
          const dia = partes[2];

          return {
            date: `${dia}/${mes}`,
            title: treino.titulo,
            // O primeiro item da lista filtrada ganha o selo de PRÓXIMO 🔥
            isNext: index === 0,
            slug: treino.slug
          };
        });
        
        setAgendaTreinos(treinosFormatados);
      }
    }

    fetchAgenda();
  }, []);

  const AgendaMarquee = () => (
    <div className="flex items-center gap-8 px-4">
      {agendaTreinos.map((treino, idx) => (
        <Link href={`/treino/${treino.slug}`} key={idx} className="flex items-center gap-3 whitespace-nowrap group">
          <span className="text-[#333]">✶</span>
          {treino.isNext ? (
            <div className="flex items-center gap-2 bg-orange-600/20 px-3.5 py-1 rounded-full border border-orange-500/40 group-hover:border-orange-500 transition shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              <span className="text-orange-500 font-black text-xs animate-pulse tracking-wider">🔥 PRÓXIMO TREINO:</span>
              <span className="text-orange-100 font-extrabold text-sm tracking-widest uppercase">{treino.date} - {treino.title}</span>
            </div>
          ) : (
            <span className="text-[#888] group-hover:text-neutral-300 font-bold text-sm tracking-widest uppercase transition-colors">
              {treino.date} - {treino.title}
            </span>
          )}
        </Link>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-[#0a0a0a] font-sans flex flex-col select-none">
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes fire {
          0% { transform: scaleY(0.95) scaleX(0.98) skew(-1deg); }
          100% { transform: scaleY(1.05) scaleX(1.02) skew(1deg); }
        }
        .fire-anim {
          animation: fire 1.4s cubic-bezier(.455, .03, .515, .955) infinite alternate;
          transform-origin: bottom center;
          will-change: transform;
        }

        @keyframes smokeDrift {
          0% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { opacity: 0.4; }
          100% { transform: translateY(-100px) scale(1.1); opacity: 0.1; }
        }
        .smoke-overlay {
          animation: smokeDrift 15s infinite alternate ease-in-out;
        }
      `}</style>

      {/* SVG FILTER PARA A FUMAÇA */}
      <svg className="hidden">
        <filter id="smoke-effect">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3 -1" in="noise" result="coloredNoise" />
          <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
          <feGaussianBlur stdDeviation="15" />
        </filter>
      </svg>

      {/* BACKGROUND: ESTRELAS */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 90px 40px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 160px 120px, #ffffff, rgba(0,0,0,0))',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px'
        }}
      />

      <div className="absolute inset-0 z-0 pointer-events-none smoke-overlay mix-blend-screen opacity-30">
        <div className="w-full h-full bg-gradient-to-t from-orange-900/40 via-neutral-600/20 to-transparent" style={{ filter: 'url(#smoke-effect)' }} />
      </div>

      {agendaTreinos.length > 0 && (
        <div className="absolute top-0 left-0 w-full bg-[#111]/90 backdrop-blur-md overflow-hidden py-3 z-50 shadow-[0_5px_20px_rgba(0,0,0,0.8)] border-b border-white/10">
          <div className="animate-marquee">
            <AgendaMarquee />
            <AgendaMarquee />
            <AgendaMarquee />
            <AgendaMarquee />
          </div>
        </div>
      )}

      <div className="relative flex-1 flex flex-col items-center justify-center w-full z-10 pb-[10vh] sm:pb-[15vh]">
        <div className="relative flex flex-col items-center justify-center w-full px-4">
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 
              className="text-transparent bg-clip-text text-[16vw] sm:text-[10rem] lg:text-[12rem] leading-none font-flamezinna tracking-wider "
              style={{
                backgroundImage: 'linear-gradient(to top, #b45309 0%, #f97316 45%, #fbbf24 85%, #fef08a 100%)'
              }}
            >
              QUARTA-FIRE
            </h1>
          </div>

         <nav className="flex items-center gap-5 sm:gap-8 mt-4">
          <Link href="/sobre" className="text-neutral-300 hover:text-orange-400 font-bold text-xs sm:text-sm uppercase tracking-widest transition-colors">
            Sobre
          </Link>
          <Link href="/treinos" className="text-neutral-300 hover:text-orange-400 font-bold text-xs sm:text-sm uppercase tracking-widest transition-colors">
            Treinos
          </Link>
          <Link href="/apoiadores" className="text-neutral-300 hover:text-orange-400 font-bold text-xs sm:text-sm uppercase tracking-widest transition-colors">
            Apoiadores
          </Link>
        </nav>

        </div>
      </div>

      {/* FOGO LADO ESQUERDO */}
      <div className="absolute bottom-0 left-0 w-[45vw] min-w-[320px] max-w-[650px] z-20 pointer-events-none -scale-x-100 origin-bottom">
        <svg className="w-full h-auto fire-anim drop-shadow-[0_0_20px_rgba(253,188,36,0.3)]" viewBox="0 0 609 387" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M90.5226 266.04C41.1228 279.679 13.591 368.917 6 395H627V88.119L591.089 190.85C577.951 215.913 546.857 241.647 527.587 144.075C508.318 46.5021 443.065 8.703 412.847 2C437.956 30.7063 476.173 95.2009 428.175 123.528C380.177 151.856 357.958 204.11 352.849 226.696C341.609 211.105 322.193 205.276 312.559 166.806C306.825 143.913 294.019 103.565 300.296 88.119C289.056 101.234 265.524 137.954 261.319 179.921C257.115 221.888 191.833 260.94 159.717 275.22C178.987 251.089 169.206 208.919 161.907 190.85C158.695 210.23 139.922 252.401 90.5226 266.04Z" fill="#FDBC24"></path>
          <path d="M71.961 322.713C50.9687 337.07 48.0531 378.592 49.2194 397.559L630.005 405L644 215.916L612.074 261.874C597.205 259.685 558.282 255.308 521.545 255.308C484.809 255.308 484.955 167.769 489.619 124C481.747 141.8 459.268 182.301 432.328 201.91C405.388 221.518 395.446 260.561 393.842 277.631C380.139 270.19 346.172 253.82 319.932 247.868C293.692 241.915 292.088 198.408 294.566 177.399C288.444 197.095 273.574 238.764 263.078 247.868C249.958 259.248 169.05 309.583 147.621 310.458C130.477 311.158 140.478 273.983 147.621 255.308C131.148 271.795 92.9532 308.357 71.961 322.713Z" fill="#FF9C40"></path>
        </svg>
      </div>

      {/* FOGO LADO DIREITO */}
      <div className="absolute bottom-0 right-0 w-[45vw] min-w-[320px] max-w-[650px] z-20 pointer-events-none origin-bottom">
        <svg className="w-full h-auto fire-anim drop-shadow-[0_0_20px_rgba(253,188,36,0.3)]" viewBox="0 0 609 387" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M90.5226 266.04C41.1228 279.679 13.591 368.917 6 395H627V88.119L591.089 190.85C577.951 215.913 546.857 241.647 527.587 144.075C508.318 46.5021 443.065 8.703 412.847 2C437.956 30.7063 476.173 95.2009 428.175 123.528C380.177 151.856 357.958 204.11 352.849 226.696C341.609 211.105 322.193 205.276 312.559 166.806C306.825 143.913 294.019 103.565 300.296 88.119C289.056 101.234 265.524 137.954 261.319 179.921C257.115 221.888 191.833 260.94 159.717 275.22C178.987 251.089 169.206 208.919 161.907 190.85C158.695 210.23 139.922 252.401 90.5226 266.04Z" fill="#FDBC24"></path>
          <path d="M71.961 322.713C50.9687 337.07 48.0531 378.592 49.2194 397.559L630.005 405L644 215.916L612.074 261.874C597.205 259.685 558.282 255.308 521.545 255.308C484.809 255.308 484.955 167.769 489.619 124C481.747 141.8 459.268 182.301 432.328 201.91C405.388 221.518 395.446 260.561 393.842 277.631C380.139 270.19 346.172 253.82 319.932 247.868C293.692 241.915 292.088 198.408 294.566 177.399C288.444 197.095 273.574 238.764 263.078 247.868C249.958 259.248 169.05 309.583 147.621 310.458C130.477 311.158 140.478 273.983 147.621 255.308C131.148 271.795 92.9532 308.357 71.961 322.713Z" fill="#FF9C40"></path>
        </svg>
      </div>

    </div>
  );
}