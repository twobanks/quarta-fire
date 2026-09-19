'use client'

export default function CavernaHeroAvancado() {
  // AGENDA DO MÊS
  const agenda = [
    { data: "04/10", titulo: "TREINO DE BASE", destaque: false },
    { data: "11/10", titulo: "TRILHA NOTURNA", destaque: true },
    { data: "18/10", titulo: "LONGÃO URBANO", destaque: false },
    { data: "25/10", titulo: "DESAFIO DO MORRO", destaque: false },
  ];

  const AgendaMarquee = () => (
    <div className="flex items-center gap-8 px-4">
      {agenda.map((treino, idx) => (
        <div key={idx} className="flex items-center gap-3 whitespace-nowrap">
          <span className="text-[#333]">✶</span>
          {treino.destaque ? (
            <div className="flex items-center gap-2 bg-orange-600/20 px-3 py-1 rounded-full border border-orange-500/30">
              <span className="text-orange-500 font-black text-xs animate-pulse">🔥 PRÓXIMO:</span>
              <span className="text-orange-100 font-bold text-sm tracking-widest">{treino.data} - {treino.titulo}</span>
            </div>
          ) : (
            <span className="text-[#888] font-bold text-sm tracking-widest">{treino.data} - {treino.titulo}</span>
          )}
        </div>
      ))}
    </div>
  );

  return (
    // FIX DO SCROLL AQUI: Usando 'fixed inset-0' e 'h-[100dvh]'
    <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-[#0a0a0a] font-sans flex flex-col select-none">
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
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

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-6deg); }
          50% { transform: translateY(-10px) rotate(-6deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
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

      {/* BACKGROUND: FUMAÇA */}
      <div className="absolute inset-0 z-0 pointer-events-none smoke-overlay mix-blend-screen opacity-30">
        <div className="w-full h-full bg-gradient-to-t from-orange-900/40 via-neutral-600/20 to-transparent" style={{ filter: 'url(#smoke-effect)' }} />
      </div>

      {/* MARQUEE: AGENDA DO MÊS */}
      <div className="absolute top-0 left-0 w-full bg-[#111] overflow-hidden py-3 z-50 shadow-[0_5px_20px_rgba(0,0,0,0.8)] border-b border-[#222]">
        <div className="animate-marquee">
          <AgendaMarquee />
          <AgendaMarquee />
          <AgendaMarquee />
          <AgendaMarquee />
        </div>
      </div>

      {/* CONTEÚDO CENTRAL: TÍTULO */}
      <div className="relative flex-1 flex flex-col items-center justify-center w-full z-10 pt-12">
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative z-10 flex flex-col items-center text-center -ml-4">
            <h1 className="text-white text-[14vw] sm:text-[9rem] font-bebas tracking-wider drop-shadow-xl text-orange-500">
              QUARTA-FIRE
            </h1>
            <p className="text-neutral-400 font-sans tracking-[0.3em] uppercase text-xs sm:text-sm mt-2">
              A luz está no asfalto.
            </p>
          </div>
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