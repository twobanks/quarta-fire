import LayoutCaverna from '@/components/LayoutCaverna';
import { cadastrarRota, deletarRota, getRotas } from '@/lib/api';
import { processarArquivoGpx } from '@/lib/gpxParser';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function AdminRotasPage() {
  const rotas = await getRotas() || [];

  async function handleCriarRota(formData: FormData) {
    'use server'
    const titulo = formData.get('titulo') as string
    const arquivoGpx = formData.get('gpx') as File

    if (!titulo || !arquivoGpx || arquivoGpx.size === 0) {
      console.error('Preencha o título e envie um arquivo GPX válido.')
      return;
    }

    try {
      const gpxUrlMock = "URL_DO_SUPABASE_STORAGE_AQUI"; 
      const dadosGpx = await processarArquivoGpx(gpxUrlMock);

      await cadastrarRota({
        titulo,
        gpx_url: gpxUrlMock,
        distancia_km: dadosGpx?.distanciaKm || '0 km',
        altimetria_m: dadosGpx?.altimetriaM || '0 m',
        perda_m: dadosGpx?.perdaM || '0 m',
        nivel_dificuldade: dadosGpx?.nivelDificuldade || 'Moderado'
      });

      revalidatePath('/admin/rotas');
    } catch (err) {
      console.error('Erro ao cadastrar rota:', err);
    }
  }

  async function handleDeletarRota(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await deletarRota(id);
    revalidatePath('/admin/rotas');
  }

  return (
    <LayoutCaverna>
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 py-12 flex-1 flex flex-col gap-8 pb-32">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col gap-2">
          <Link href="/admin" className="text-sm font-semibold text-neutral-400 hover:text-orange-500 transition flex items-center gap-1">
            ← Voltar para o Painel
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black italic tracking-tight text-white uppercase mt-2">
            GERENCIAR <span className="text-orange-500">ROTAS</span>
          </h1>
          <p className="text-neutral-400 text-xs">
            Catálogo oficial de percursos do Quarta-Fire.
          </p>
        </div>

        {/* FORMULÁRIO DE CADASTRO */}
        <div className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
          <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-4">
            Adicionar Nova Rota 🗺️
          </h2>

          <form action={handleCriarRota} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1">Título da Rota</label>
              <input 
                name="titulo" 
                type="text" 
                required 
                placeholder="Ex: Casinha do Lago"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1">Arquivo GPX</label>
              <input 
                name="gpx" 
                type="file" 
                accept=".gpx"
                required 
                className="block w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-500/10 file:text-orange-500 hover:file:bg-orange-500/20 cursor-pointer"
              />
            </div>

            <div className="md:col-span-2 mt-2">
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black py-3 rounded-xl transition text-sm uppercase tracking-wider shadow-md"
              >
                Salvar Rota 🚀
              </button>
            </div>
          </form>
        </div>

        {/* LISTAGEM NO PADRÃO DE BARRAS HORIZONTAIS */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-black uppercase tracking-tight text-white px-1">
            Rotas Cadastradas ({rotas.length})
          </h2>

          <div className="flex flex-col gap-3">
            {rotas.map((rota: any, index: number) => {
              // Exemplo: Destaca a primeira rota com a borda laranja brilhante (igual ao "Próximo Treino")
              const ehDestaque = index === 0;

              return (
                <div 
                  key={rota.id} 
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:px-6 sm:py-4 rounded-2xl backdrop-blur-md transition-all gap-4 shadow-xl ${
                    ehDestaque 
                      ? 'bg-[#141414]/90 border-2 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)]' 
                      : 'bg-[#111]/80 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Selo de Destaque no topo direito (opcional para a primeira rota) */}
                  {ehDestaque && (
                    <div className="absolute -top-3 right-6 bg-gradient-to-r from-orange-600 to-red-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full shadow-md">
                      ROTA PRINCIPAL 🔥
                    </div>
                  )}

                  {/* Lado Esquerdo: Distância, Altimetria e Nome */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 w-full sm:w-auto">
                    
                    {/* Bloco Distância / Altimetria */}
                    <div className="flex items-center gap-4 text-xs font-bold text-orange-500">
                      <div className="flex items-center gap-1.5">
                        <span>📏</span>
                        <span>{rota.distancia_km || '0 km'}</span>
                      </div>
                      <div className="w-[1px] h-4 bg-white/10"></div>
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <span>⛰</span>
                        <span>{rota.altimetria_m || '0 m'}</span>
                      </div>
                    </div>

                    {/* Nome da Rota */}
                    <h3 className="font-black text-white text-base sm:text-lg uppercase tracking-wide">
                      {rota.titulo}
                    </h3>

                  </div>

                  {/* Lado Direito: Ações e Tag de Dificuldade / Baixar GPX */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    
                    <a 
                      href={rota.gpx_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/5 text-[11px] font-bold text-neutral-300 hover:text-white hover:border-orange-500/50 transition flex items-center gap-1"
                    >
                      <span>🏁</span> GPX
                    </a>

                    <span className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] font-bold text-neutral-400 uppercase">
                      {rota.nivel_dificuldade || 'Trail'}
                    </span>

                    <form action={handleDeletarRota}>
                      <input type="hidden" name="id" value={rota.id} />
                      <button 
                        type="submit"
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[11px] font-bold transition"
                        title="Excluir rota"
                      >
                        Excluir
                      </button>
                    </form>

                  </div>
                </div>
              );
            })}

            {rotas.length === 0 && (
              <p className="text-xs text-neutral-400 italic py-6 text-center bg-[#111]/80 border border-white/10 rounded-2xl">
                Nenhuma rota cadastrada no sistema ainda.
              </p>
            )}
          </div>
        </div>

      </main>
    </LayoutCaverna>
  );
}