import LayoutCaverna from "@/components/LayoutCaverna";
import { getProximosTreinos } from "@/lib/api";
import Link from "next/link";

export default async function TreinosPage() {
  const treinos = await getProximosTreinos() || [];

  return (
    <LayoutCaverna>
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 py-12 flex-1 pb-32">
        
        <div className="mb-10 text-center sm:text-left">
          <h1 className="sm:text-[5rem] text-5xl font-bebas uppercase tracking-tight text-white drop-shadow-xl leading-none">
            PRÓXIMOS <span className="text-orange-500">TREINOS</span>
          </h1>
        </div>

        {treinos.length === 0 ? (
          <div className="bg-[#111]/80 backdrop-blur-md border border-white/5 rounded-2xl p-8 text-center shadow-lg">
            <p className="text-neutral-400 uppercase tracking-widest text-sm">Nenhum treino agendado no momento.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {treinos.map((treino: any, index: number) => {
              const partesData = treino.data_treino ? treino.data_treino.split('T')[0].split('-') : [];
              const dataFormatada = partesData.length === 3 ? `${partesData[2]}/${partesData[1]}` : '01/01';

              const horaLargada = treino.hora_largada ? treino.hora_largada.substring(0, 5) : null;
              const isProximo = index === 0; 

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
                  {isProximo && (
                    <span className="absolute -top-2.5 right-4 bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-md">
                      Próximo Treino 🔥
                    </span>
                  )}

                  <div className="flex items-center gap-6 sm:min-w-[220px]">
                    
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-orange-500 font-bold text-base tracking-tight">
                        {dataFormatada}
                      </span>
                    </div>

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

                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-white font-bold text-base uppercase tracking-wide group-hover:text-orange-400 transition-colors line-clamp-1">
                      {treino.titulo}
                    </h3>
                    
                    <div className="flex items-center gap-2 shrink-0">
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
    </LayoutCaverna>
  );
}