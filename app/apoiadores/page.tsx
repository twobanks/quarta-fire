import LayoutCaverna from "@/components/LayoutCaverna";
import { getApoiadores } from "@/lib/api";

export default async function ApoiadoresPage() {
  const parceiros = await getApoiadores() || [];

  return (
    <LayoutCaverna>
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 py-12 flex-1 flex flex-col gap-10 ">
        <div className="flex flex-col gap-4 text-center items-center mt-4">
          <h1 className="sm:text-[5rem] text-5xl font-bebas uppercase tracking-tight text-white drop-shadow-xl leading-none">
            NOSSOS <span className="text-orange-500">APOIADORES</span>
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {parceiros.map((parceiro: any) => (
            <div 
              key={parceiro.id} 
              className="group bg-[#111]/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-6 hover:border-orange-500/50 hover:bg-white/5 transition-all duration-300 shadow-lg"
            >
              <div className="w-16 h-16 bg-neutral-900/80 border border-white/5 rounded-full flex-shrink-0 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                {parceiro.logo_url ? (
                  <img src={parceiro.logo_url} alt={parceiro.nome} className="w-full h-full object-cover" />
                ) : (
                  <span>🤝</span>
                )}
              </div> 
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg uppercase tracking-wide group-hover:text-orange-400 transition-colors truncate">
                  {parceiro.nome}
                </h3>
                <p className="text-orange-500/80 text-sm mt-1 font-medium">
                  {parceiro.instagram}
                </p>
              </div>
            </div>
          ))}

          {parceiros.length === 0 && (
             <div className="col-span-1 sm:col-span-2 text-center text-neutral-500 py-16 bg-[#111]/60 rounded-2xl border border-dashed border-white/10">
               <span className="text-4xl block mb-3">🕸️</span>
               Nenhum apoiador cadastrado ainda.
             </div>
          )}
        </div>
      </main>
    </LayoutCaverna>
  )
}