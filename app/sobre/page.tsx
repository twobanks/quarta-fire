'use client'

import Header from '@/components/Header';

export default function Sobre() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden mt-16 bg-[#0a0a0a] font-sans flex flex-col selection:bg-orange-500 selection:text-black [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#0a0a0a] [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full">
      
      {/* 1. DEFINIÇÕES DE ANIMAÇÕES (Copiado da Home) */}
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

      {/* 3. BACKGROUND: ESTRELAS (Fixo no fundo) */}
      <div 
        className="fixed inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 90px 40px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 160px 120px, #ffffff, rgba(0,0,0,0))',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px'
        }}
      />

      {/* 4. BACKGROUND: FUMAÇA (Fixo no fundo) */}
      <div className="fixed inset-0 z-0 pointer-events-none smoke-overlay mix-blend-screen opacity-30">
        <div className="w-full h-full bg-gradient-to-t from-orange-900/40 via-neutral-600/20 to-transparent" style={{ filter: 'url(#smoke-effect)' }} />
      </div>

      {/* HEADER SIMPLES DE NAVEGAÇÃO */}
      <Header  />

      {/* CONTEÚDO PRINCIPAL (Z-10 para ficar acima do fundo) */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 flex flex-col gap-12 pb-32">
        
        {/* TÍTULO PRINCIPAL */}
        <div className="flex flex-col gap-4 text-center items-center mt-4">
          <h1 className="sm:text-[5rem] text-5xl font-bebas uppercase tracking-tight text-white drop-shadow-xl leading-none">
            A TROPA DO <br className="sm:hidden" />
            <span className="text-orange-500">QUARTA-FIRE</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mt-4 bg-[#111]/80 backdrop-blur-md px-6 py-4 border border-white/5 rounded-2xl shadow-lg">
            Mais do que corrida, uma comunidade. Um coletivo sem fins lucrativos feito por corredores, para corredores.
          </p>
        </div>

        {/* SEÇÃO 1: Quem somos */}
        <section className="flex flex-col md:flex-row gap-8 items-start bg-[#111]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-orange-500/30 transition-colors shadow-lg">
          <div className="md:w-1/3">
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider drop-shadow-md">Quem Somos</h2>
            <div className="w-12 h-1 bg-orange-600 mt-2 rounded"></div>
          </div>
          <div className="md:w-2/3 flex flex-col gap-4 text-neutral-300 leading-relaxed">
            <p>
              O Quarta-Fire nasceu nas ruas com um propósito simples: <strong className="text-white">democratizar a corrida</strong> e criar um ambiente acolhedor para todos, independente do pace (ritmo) ou da experiência. 
            </p>
            <p>
              Somos um coletivo esportivo totalmente <strong className="text-white">gratuito e sem fins lucrativos</strong>. Não cobramos mensalidade, não exigimos uniforme. A única regra é calçar o tênis, trazer sua energia e respeitar a galera. 
            </p>
          </div>
        </section>

        {/* SEÇÃO 2: Como Funciona */}
        <section className="flex flex-col md:flex-row gap-8 items-start bg-[#111]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-orange-500/30 transition-colors shadow-lg">
          <div className="md:w-1/3">
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider drop-shadow-md">Como Funciona</h2>
            <div className="w-12 h-1 bg-orange-600 mt-2 rounded"></div>
          </div>
          <div className="md:w-2/3 flex flex-col gap-4 text-neutral-300 leading-relaxed">
            <p>
              Toda semana liberamos um novo percurso aqui na plataforma. Você confere a altimetria, baixa o arquivo GPX para o seu relógio, vê o ponto de encontro e confirma sua presença.
            </p>
            <p>
              Uai, Seer! E não é só sofrimento não. Graças aos nossos incríveis apoiadores locais, nossos treinos frequentemente contam com <strong className="text-orange-500">sorteios de brindes</strong> para a galera que cola junto e fortalece a tropa.
            </p>
          </div>
        </section>

        {/* SEÇÃO 3: Nossos Valores (Cards) */}
        <section className="flex flex-col gap-8">
          <div className="text-center mb-2">
            <h2 className="text-3xl font-bebas text-white uppercase tracking-wider drop-shadow-xl">NOSSOS PILARES</h2>
            <div className="w-16 h-1 bg-orange-600 mt-2 mx-auto rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111]/80 backdrop-blur-md p-6 rounded-2xl border border-white/5 flex flex-col gap-3 items-center text-center hover:border-orange-500/50 hover:bg-white/5 transition-all shadow-lg group">
              <span className="text-4xl group-hover:scale-110 transition-transform">🤝</span>
              <h3 className="text-lg font-bold text-white uppercase">Inclusão</h3>
              <p className="text-sm text-neutral-400">Do iniciante que intercala caminhada e corrida ao maratonista sub-3h. Ninguém fica pra trás.</p>
            </div>
            
            <div className="bg-[#111]/80 backdrop-blur-md p-6 rounded-2xl border border-white/5 flex flex-col gap-3 items-center text-center hover:border-orange-500/50 hover:bg-white/5 transition-all shadow-lg group">
              <span className="text-4xl group-hover:scale-110 transition-transform">❤️</span>
              <h3 className="text-lg font-bold text-white uppercase">Saúde Mental</h3>
              <p className="text-sm text-neutral-400">Correr em grupo alivia o estresse e cria laços reais em um mundo cada vez mais digital.</p>
            </div>

            <div className="bg-[#111]/80 backdrop-blur-md p-6 rounded-2xl border border-white/5 flex flex-col gap-3 items-center text-center hover:border-orange-500/50 hover:bg-white/5 transition-all shadow-lg group">
              <span className="text-4xl group-hover:scale-110 transition-transform">🏙️</span>
              <h3 className="text-lg font-bold text-white uppercase">Apropriação Urbana</h3>
              <p className="text-sm text-neutral-400">Desbravar nossas ruas, subidas e bairros, trazendo vida e esporte para a cidade.</p>
            </div>
          </div>
        </section>

      </main>
      <div className="fixed bottom-0 left-0 w-[30vw] min-w-[200px] max-w-[400px] z-0 pointer-events-none -scale-x-100 origin-bottom opacity-50 mix-blend-screen">
        <svg className="w-full h-auto fire-anim" viewBox="0 0 609 387" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M90.5226 266.04C41.1228 279.679 13.591 368.917 6 395H627V88.119L591.089 190.85C577.951 215.913 546.857 241.647 527.587 144.075C508.318 46.5021 443.065 8.703 412.847 2C437.956 30.7063 476.173 95.2009 428.175 123.528C380.177 151.856 357.958 204.11 352.849 226.696C341.609 211.105 322.193 205.276 312.559 166.806C306.825 143.913 294.019 103.565 300.296 88.119C289.056 101.234 265.524 137.954 261.319 179.921C257.115 221.888 191.833 260.94 159.717 275.22C178.987 251.089 169.206 208.919 161.907 190.85C158.695 210.23 139.922 252.401 90.5226 266.04Z" fill="#FDBC24"></path>
          <path d="M71.961 322.713C50.9687 337.07 48.0531 378.592 49.2194 397.559L630.005 405L644 215.916L612.074 261.874C597.205 259.685 558.282 255.308 521.545 255.308C484.809 255.308 484.955 167.769 489.619 124C481.747 141.8 459.268 182.301 432.328 201.91C405.388 221.518 395.446 260.561 393.842 277.631C380.139 270.19 346.172 253.82 319.932 247.868C293.692 241.915 292.088 198.408 294.566 177.399C288.444 197.095 273.574 238.764 263.078 247.868C249.958 259.248 169.05 309.583 147.621 310.458C130.477 311.158 140.478 273.983 147.621 255.308C131.148 271.795 92.9532 308.357 71.961 322.713Z" fill="#FF9C40"></path>
        </svg>
      </div>

      <div className="fixed bottom-0 right-0 w-[30vw] min-w-[200px] max-w-[400px] z-0 pointer-events-none origin-bottom opacity-50 mix-blend-screen">
        <svg className="w-full h-auto fire-anim" viewBox="0 0 609 387" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M90.5226 266.04C41.1228 279.679 13.591 368.917 6 395H627V88.119L591.089 190.85C577.951 215.913 546.857 241.647 527.587 144.075C508.318 46.5021 443.065 8.703 412.847 2C437.956 30.7063 476.173 95.2009 428.175 123.528C380.177 151.856 357.958 204.11 352.849 226.696C341.609 211.105 322.193 205.276 312.559 166.806C306.825 143.913 294.019 103.565 300.296 88.119C289.056 101.234 265.524 137.954 261.319 179.921C257.115 221.888 191.833 260.94 159.717 275.22C178.987 251.089 169.206 208.919 161.907 190.85C158.695 210.23 139.922 252.401 90.5226 266.04Z" fill="#FDBC24"></path>
          <path d="M71.961 322.713C50.9687 337.07 48.0531 378.592 49.2194 397.559L630.005 405L644 215.916L612.074 261.874C597.205 259.685 558.282 255.308 521.545 255.308C484.809 255.308 484.955 167.769 489.619 124C481.747 141.8 459.268 182.301 432.328 201.91C405.388 221.518 395.446 260.561 393.842 277.631C380.139 270.19 346.172 253.82 319.932 247.868C293.692 241.915 292.088 198.408 294.566 177.399C288.444 197.095 273.574 238.764 263.078 247.868C249.958 259.248 169.05 309.583 147.621 310.458C130.477 311.158 140.478 273.983 147.621 255.308C131.148 271.795 92.9532 308.357 71.961 322.713Z" fill="#FF9C40"></path>
        </svg>
      </div>
      
    </div>
  )
}