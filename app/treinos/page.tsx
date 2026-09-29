'use client'

import Header from "@/components/Header";
import { getProximosTreinos } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TreinosPage() {
  const [treinos, setTreinos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarTreinos() {
      const dados = await getProximosTreinos();
      setTreinos(dados || []);
      setCarregando(false);
    }
    carregarTreinos();
  }, []);

  return (
    <div className="relative min-h-screen w-full mt-16 overflow-x-hidden bg-[#0a0a0a] font-sans flex flex-col selection:bg-orange-500 selection:text-black [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#0a0a0a] [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full">
      
      {/* 1. DEFINIÇÕES DE ANIMAÇÕES */}
      <style>{`
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

      {/* 2. SVG FILTER PARA A FUMAÇA */}
      <svg className="hidden">
        <filter id="smoke-effect">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3 -1" in="noise" result="coloredNoise" />
          <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
          <feGaussianBlur stdDeviation="15" />
        </filter>
      </svg>

      {/* 3. BACKGROUND: ESTRELAS */}
      <div 
        className="fixed inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 90px 40px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 160px 120px, #ffffff, rgba(0,0,0,0))',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px'
        }}
      />

      {/* 4. BACKGROUND: FUMAÇA */}
      <div className="fixed inset-0 z-0 pointer-events-none smoke-overlay mix-blend-screen opacity-30">
        <div className="w-full h-full bg-gradient-to-t from-orange-900/40 via-neutral-600/20 to-transparent" style={{ filter: 'url(#smoke-effect)' }} />
      </div>

      {/* 5. HEADER SIMPLES DE NAVEGAÇÃO */}
      <Header />

      {/* 6. CONTEÚDO DA LISTAGEM (Z-10 para ficar acima do fundo) */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 py-12 flex-1 pb-32">
        
        <div className="mb-10 text-center sm:text-left">
          <h1 className="sm:text-[5rem] text-5xl font-bebas uppercase tracking-tight text-white drop-shadow-xl leading-none">
            PRÓXIMOS <span className="text-orange-500">TREINOS</span>
          </h1>
        </div>

        {carregando ? (
          <div className="flex justify-center items-center py-20 bg-[#111]/60 backdrop-blur-md border border-white/5 rounded-2xl shadow-lg">
            <span className="text-orange-500 font-bold animate-pulse tracking-widest uppercase text-sm">Carregando a fogueira...</span>
          </div>
        ) : treinos.length === 0 ? (
          <div className="bg-[#111]/80 backdrop-blur-md border border-white/5 rounded-2xl p-8 text-center shadow-lg">
            <p className="text-neutral-400 uppercase tracking-widest text-sm">Nenhum treino agendado no momento.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {treinos.map((treino, index) => {
              // Correção segura para extrair DD/MM a partir de YYYY-MM-DD
              const partesData = treino.data_treino ? treino.data_treino.split('T')[0].split('-') : [];
              const dataFormatada = partesData.length === 3 ? `${partesData[2]}/${partesData[1]}` : '01/01';

              const horaLargada = treino.hora_largada ? treino.hora_largada.substring(0, 5) : null;
              const isProximo = index === 0; // O primeiro item da lista é o próximo treino

              return (
                <Link 
                  href={`/treino/${treino.slug}`}
                  key={treino.id} 
                  className={`group relative backdrop-blur-md rounded-xl p-4 sm:px-6 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 shadow-lg ${
                    isProximo 
                      ? 'bg-gradient-to-r from-orange-500/15 via-[#111]/80 to-[#111]/80 border-2 border-orange-500/70 shadow-[0_0_25px_rgba(249,115,22,0.15)]' 
                      : 'bg-[#111]/60 border border-white/10 hover:border-orange-500/50 hover:bg-white/5'
                  }`}
                >
                  {/* Badge de Próximo Treino */}
                  {isProximo && (
                    <span className="absolute -top-2.5 right-4 bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-md">
                      Próximo Treino 🔥
                    </span>
                  )}

                  {/* Bloco de Data e Horário em formato de Tabela */}
                  <div className="flex items-center gap-6 sm:min-w-[220px]">
                    
                    {/* Data (Laranja + Ícone de Calendário) */}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-orange-500 font-bold text-base tracking-tight">
                        {dataFormatada}
                      </span>
                    </div>

                    {/* Horário (Branco + Ícone de Relógio) */}
                    {horaLargada && (
                      <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                        <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-white font-semibold text-sm font-mono">
                          {horaLargada}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Título e Tags compactas */}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-white font-bold text-base uppercase tracking-wide group-hover:text-orange-400 transition-colors line-clamp-1">
                      {treino.titulo}
                    </h3>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-bold text-neutral-300 bg-white/5 px-2.5 py-0.5 rounded border border-white/5 whitespace-nowrap">
                        📍 {treino.distancia} km
                      </span>
                      
                      {treino.local_encontro && (
                        <span className="text-[11px] font-bold text-neutral-400 bg-white/5 px-2.5 py-0.5 rounded border border-white/5 whitespace-nowrap truncate max-w-[150px] sm:max-w-[200px]">
                          🏁 {treino.local_encontro}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 w-[30vw] min-w-[200px] max-w-[400px] z-0 pointer-events-none -scale-x-100 origin-bottom opacity-50 mix-blend-screen">
        <svg className="w-full h-auto fire-anim" viewBox="0 0 609 387" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M90.5226 266.04C41.1228 279.679 13.591 368.917 6 395H627V88.119L591.089 190.85C577.951 215.913 546.857 241.647 527.587 144.075C508.318 46.5021 443.065 8.703 412.847 2C437.956 30.7063 476.173 95.2009 428.175 123.528C380.177 151.856 357.958 204.11 352.849 226.696C341.609 211.105 322.193 205.276 312.559 166.806C306.825 143.913 294.019 103.565 300.296 88.119C289.056 101.234 265.524 137.954 261.319 179.921C257.115 221.888 191.833 260.94 159.717 275.22C178.987 251.089 169.206 208.919 161.907 190.85C158.695 210.23 139.922 252.401 90.5226 266.04Z" fill="#FDBC24"></path>
          <path d="M71.961 322.713C50.9687 337.07 48.0531 378.592 49.2194 397.559L630.005 405L644 215.916L612.074 261.874C597.205 259.685 558.282 255.308 521.545 255.308C484.809 255.308 484.955 167.769 489.619 124C481.747 141.8 459.268 182.301 432.328 201.91C405.388 221.518 395.446 260.561 393.842 277.631C380.139 270.19 346.172 253.82 319.932 247.868C293.692 241.915 292.088 198.408 294.566 177.399C288.444 197.095 273.574 238.764 263.078 247.868C249.958 259.248 169.05 309.583 147.621 310.458C130.477 311.158 140.478 273.983 147.621 255.308C131.148 271.795 92.9532 308.357 71.961 322.713Z" fill="#FF9C40"></path>
        </svg>
      </div>

      {/* 8. FOGO LADO DIREITO */}
      <div className="fixed bottom-0 right-0 w-[30vw] min-w-[200px] max-w-[400px] z-0 pointer-events-none origin-bottom opacity-50 mix-blend-screen">
        <svg className="w-full h-auto fire-anim" viewBox="0 0 609 387" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M90.5226 266.04C41.1228 279.679 13.591 368.917 6 395H627V88.119L591.089 190.85C577.951 215.913 546.857 241.647 527.587 144.075C508.318 46.5021 443.065 8.703 412.847 2C437.956 30.7063 476.173 95.2009 428.175 123.528C380.177 151.856 357.958 204.11 352.849 226.696C341.609 211.105 322.193 205.276 312.559 166.806C306.825 143.913 294.019 103.565 300.296 88.119C289.056 101.234 265.524 137.954 261.319 179.921C257.115 221.888 191.833 260.94 159.717 275.22C178.987 251.089 169.206 208.919 161.907 190.85C158.695 210.23 139.922 252.401 90.5226 266.04Z" fill="#FDBC24"></path>
          <path d="M71.961 322.713C50.9687 337.07 48.0531 378.592 49.2194 397.559L630.005 405L644 215.916L612.074 261.874C597.205 259.685 558.282 255.308 521.545 255.308C484.809 255.308 484.955 167.769 489.619 124C481.747 141.8 459.268 182.301 432.328 201.91C405.388 221.518 395.446 260.561 393.842 277.631C380.139 270.19 346.172 253.82 319.932 247.868C293.692 241.915 292.088 198.408 294.566 177.399C288.444 197.095 273.574 238.764 263.078 247.868C249.958 259.248 169.05 309.583 147.621 310.458C130.477 311.158 140.478 273.983 147.621 255.308C131.148 271.795 92.9532 308.357 71.961 322.713Z" fill="#FF9C40"></path>
        </svg>
      </div>

    </div>
  );
}