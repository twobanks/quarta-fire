import { atualizarTreinoComGpx, getApoiadores, getTreinoById } from '@/lib/api'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function EditarTreinoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = resolvedParams.id
  
  const treino = await getTreinoById(id)
  
  if (!treino) {
    redirect('/admin/treinos')
  }

  const listaApoiadores = await getApoiadores() || [];

  async function handleAction(formData: FormData) {
    'use server'
    
    const resultado = await atualizarTreinoComGpx(id, formData)
    
    if (resultado?.error) {
      console.error('Erro retornado pela action:', resultado.error)
      return
    }

    const slugAtualizado = resultado?.data?.[0]?.slug || treino.slug;
    revalidatePath(`/treino/${slugAtualizado}`);
    revalidatePath('/admin/treinos');
    redirect(`/treino/${slugAtualizado}`)
  }

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-3xl mx-auto mt-8 px-4 h-full bg-[#0a0a0a] text-white">
      <div className="flex justify-between items-center">
        <Link href="/admin/treinos" className="text-sm font-semibold text-neutral-400 hover:text-orange-500 transition flex items-center gap-1">
          ← Voltar
        </Link>
        <Link href={`/admin/treino/novo-treino?baseId=${treino.id}`} className="bg-neutral-900 border border-white/10 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-neutral-800 transition">
          ♻️ Reaproveitar esta Rota
        </Link>
      </div>

      <div className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
        <span className="bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Modo Edição
        </span>
        <h1 className="text-2xl font-black italic tracking-tight mt-2 mb-1">
          Editar Treino #{treino.numero} 🔥
        </h1>
        <p className="text-neutral-400 text-xs">
          Altere as informações divididas por etapas. Para manter a rota atual, deixe o campo de arquivo GPX vazio.
        </p>
      </div>

      <form action={handleAction} className="flex flex-col gap-6">
        
        {/* BLOCO 1: IDENTIFICAÇÃO */}
        <div className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest border-b border-white/5 pb-2">1. Identificação</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1">Número</label>
              <input 
                name="numero" 
                type="number" 
                required 
                defaultValue={treino.numero}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition shadow-inner"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-neutral-400 mb-1">Data</label>
              <input 
                name="data_treino" 
                type="date" 
                required 
                defaultValue={treino.data_treino ? treino.data_treino.split('T')[0] : ''}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition shadow-inner [color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1">Título do Treino</label>
            <input 
              name="titulo" 
              type="text" 
              required 
              defaultValue={treino.titulo}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition shadow-inner"
            />
          </div>
        </div>

        {/* BLOCO 2: LOGÍSTICA */}
        <div className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest border-b border-white/5 pb-2">2. Logística</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1">Local de Encontro</label>
              <input 
                name="local_encontro" 
                type="text" 
                required 
                defaultValue={treino.local_encontro}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition shadow-inner"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1">Largada</label>
              <input 
                name="hora_largada" 
                type="time" 
                required 
                defaultValue={treino.hora_largada ? treino.hora_largada.substring(0,5) : ''}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition shadow-inner [color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1">Link do Google Maps</label>
            <input 
              name="link_maps" 
              type="url" 
              defaultValue={treino.link_maps}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition shadow-inner"
            />
          </div>
        </div>

        {/* BLOCO 3: PARCERIAS E BRINDES */}
        <div className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest border-b border-white/5 pb-2">3. Parcerias</h2>
          
          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1">Brindes e Apoio (Texto Livre)</label>
            <input 
              name="brindes_parceiros" 
              type="text" 
              defaultValue={treino.brindes_parceiros}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition shadow-inner"
            />
          </div>

          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="block text-xs font-bold text-neutral-400">Apoiadores Oficiais do Treino</label>
              <span className="text-[10px] text-neutral-500">Segure CTRL/CMD para selecionar vários</span>
            </div>
            <select 
              name="apoiadores" 
              multiple
              defaultValue={treino.apoiadores || []}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition shadow-inner h-32 custom-scrollbar"
            >
              {listaApoiadores.map((apoiador) => (
                <option 
                  key={apoiador.id} 
                  value={apoiador.id}
                  className="py-2 px-2 hover:bg-neutral-800 rounded-lg cursor-pointer mb-1"
                >
                  🤝 {apoiador.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* BLOCO 4: ROTA */}
        <div className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
          <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest border-b border-white/5 pb-4 mb-4">4. Arquivo de Rota</h2>
          
          <div className="border-2 border-dashed border-white/10 rounded-xl p-6 bg-neutral-900/60 text-center">
            <label className="block text-sm font-bold text-neutral-300 mb-2">Atualizar GPX (Opcional)</label>
            {treino.gpx_url && (
              <p className="text-xs text-orange-500 mb-4 font-bold bg-orange-500/10 py-2 rounded-lg inline-block px-4">
                ✔ Rota atual já cadastrada em memória.
              </p>
            )}
            <input 
              name="gpx" 
              type="file" 
              accept=".gpx"
              className="block w-full max-w-sm mx-auto text-xs text-neutral-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-500/10 file:text-orange-500 hover:file:bg-orange-500/20 cursor-pointer"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="mt-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-black py-4 rounded-xl hover:from-orange-500 hover:to-red-500 transition active:scale-98 shadow-[0_0_20px_rgba(249,115,22,0.3)] uppercase tracking-widest text-lg"
        >
          Salvar Alterações 💾
        </button>
      </form>
    </div>
  )
}