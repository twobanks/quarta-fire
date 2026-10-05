import LayoutCaverna from "@/components/LayoutCaverna";

export default function Sobre() {
  return (
    <LayoutCaverna>
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 flex flex-col gap-12 pb-32">
        <div className="flex flex-col gap-4 text-center items-center mt-4">
          <h1 className="sm:text-[5rem] text-5xl font-bebas uppercase tracking-tight text-white drop-shadow-xl leading-none">
            A TROPA DO <br className="sm:hidden" />
            <span className="text-orange-500">QUARTA-FIRE</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mt-4 bg-[#111]/80 backdrop-blur-md px-6 py-4 border border-white/5 rounded-2xl shadow-lg">
            Mais do que corrida, uma comunidade. Um coletivo sem fins lucrativos feito por corredores, para corredores.
          </p>
        </div>

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
    </LayoutCaverna>
  );
}