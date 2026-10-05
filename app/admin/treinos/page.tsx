import Header from '@/components/Header';
import { getAllTreinos } from '@/lib/api';
import Link from 'next/link';

export default async function PainelTreinosPage() {
  // Busca TODOS os treinos cadastrados (passados e futuros)
  const treinos = await getAllTreinos();

  return (
    <div className="h-screen bg-[#0a0a0a] text-neutral-100 flex flex-col overflow-hidden font-sans">
      <Header />
      
      <main className="flex-1 mt-16 px-4 py-8 max-w-4xl mx-auto w-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-neutral-900/40 [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full">
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <span className="bg-orange-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
              Área Restrita
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight mt-2">
              Meus <span className="text-orange-500">Treinos</span>
            </h1>
          </div>
          
          <Link 
            href="/admin/treino/novo-treino" 
            className="bg-orange-600 hover:bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] text-white text-sm font-bold px-6 py-3 rounded-xl transition flex justify-center items-center gap-2"
          >
            🔥 Novo Treino
          </Link>
        </div>

        <div className="flex flex-col gap-4 pb-12">
          {treinos.map(treino => {
            // Formatar data de YYYY-MM-DD para DD/MM/YYYY
            const dataFormatada = treino.data_treino 
              ? treino.data_treino.split('T')[0].split('-').reverse().join('/')
              : '';

            return (
              <div 
                key={treino.id} 
                className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg hover:border-orange-500/30 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-neutral-800 border border-neutral-700 text-neutral-300 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                      #{treino.numero}
                    </span>
                    <span className="text-orange-500 text-xs font-bold flex items-center gap-1">
                      📅 {dataFormatada}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                    {treino.titulo}
                  </h3>
                  <p className="text-neutral-400 text-xs mt-1 flex items-center gap-1">
                    📍 {treino.local_encontro} <span className="mx-1">•</span> 🏃 {treino.distancia}
                  </p>
                </div>

                <div className="flex flex-row items-center gap-2 shrink-0">
                  {/* Botão de Editar (Atualiza o MESMO treino) */}
                  <Link 
                    href={`/admin/treino/${treino.id}/editar`}
                    className="flex-1 sm:flex-none bg-neutral-800 hover:bg-neutral-700 border border-white/5 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition text-center flex items-center justify-center gap-2"
                  >
                    ✏️ Editar
                  </Link>
                  
                  {/* Botão de Reaproveitar (Cria um NOVO treino baseado neste) */}
                  <Link 
                    href={`/admin/treino/novo-treino?baseId=${treino.id}`}
                    className="flex-1 sm:flex-none bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-500 hover:text-orange-400 text-xs font-bold px-4 py-2.5 rounded-xl transition text-center flex items-center justify-center gap-2"
                  >
                    ♻️ Clonar Rota
                  </Link>
                </div>
              </div>
            );
          })}

          {treinos.length === 0 && (
            <div className="text-center text-neutral-500 py-16 bg-[#111]/60 rounded-2xl border border-white/5">
              <span className="text-4xl mb-3 block">🕸️</span>
              Nenhum treino cadastrado no banco de dados.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}