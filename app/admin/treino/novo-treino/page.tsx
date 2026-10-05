import LayoutCaverna from '@/components/LayoutCaverna';
import { cadastrarTreinoComGpx, getApoiadores, getRotas } from '@/lib/api';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function NovoTreinoPage() {
  const rotasCadastradas = await getRotas() || [];
  const listaApoiadores = await getApoiadores() || [];

  async function handleAction(formData: FormData) {
    'use server'
    const resultado = await cadastrarTreinoComGpx(formData);
    if (resultado?.error) {
      console.error(resultado.error);
      return;
    }
    redirect('/admin/treinos');
  }

  return (
    <LayoutCaverna>
      <main className="relative z-10 w-full max-w-3xl mx-auto px-4 py-12 flex-1 flex flex-col gap-6 pb-32">
        <div>
          <Link href="/admin/treinos" className="text-sm font-semibold text-neutral-400 hover:text-orange-500 transition flex items-center gap-1">
            ← Voltar
          </Link>
        </div>

        <div className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex justify-between items-center">
          <div>
            <span className="bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Painel Secreto
            </span>
            <h1 className="text-2xl font-black italic tracking-tight mt-2 mb-1 text-white">
              Cadastrar Novo Treino 🔥
            </h1>
            <p className="text-neutral-400 text-xs">
              Vincule uma rota já cadastrada e publique o próximo coletivo.
            </p>
          </div>
          <Link 
            href="/admin/rotas" 
            className="text-xs bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-orange-500 font-bold px-4 py-2.5 rounded-xl transition"
          >
            🗺️ Gerenciar Rotas
          </Link>
        </div>

        <form action={handleAction} className="flex flex-col gap-6">
          
          {/* BLOCO 1: IDENTIFICAÇÃO */}
          <div className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest border-b border-white/5 pb-2">1. Identificação</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">Número</label>
                <input name="numero" type="number" required placeholder="Ex: 42" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition shadow-inner" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-400 mb-1">Data do Treino</label>
                <input name="data_treino" type="date" required className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition shadow-inner [color-scheme:dark]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1">Título do Treino</label>
              <input name="titulo" type="text" required placeholder="Ex: Treino Noturno no Morro" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition shadow-inner" />
            </div>
          </div>

          {/* BLOCO 2: LOGÍSTICA */}
          <div className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest border-b border-white/5 pb-2">2. Logística</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">Local de Encontro</label>
                <input name="local_encontro" type="text" required placeholder="Ex: IFTM" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition shadow-inner" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">Horário da Largada</label>
                <input name="hora_largada" type="time" required defaultValue="19:15" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition shadow-inner [color-scheme:dark]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1">Link do Google Maps</label>
              <input name="link_maps" type="url" placeholder="Ex: https://maps.app.goo.gl/..." className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition shadow-inner" />
            </div>
          </div>

          {/* BLOCO 3: ESCOLHA DA ROTA */}
          <div className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest border-b border-white/5 pb-2">3. Selecionar Rota</h2>
            
            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1">Escolha a Rota Oficial</label>
              <select name="rota_id" required className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition shadow-inner">
                <option value="">-- Selecione uma rota cadastrada --</option>
                {rotasCadastradas.map((rota: any) => (
                  <option key={rota.id} value={rota.id}>
                    🗺️ {rota.titulo} ({rota.distancia_km})
                  </option>
                ))}
              </select>
              {rotasCadastradas.length === 0 && (
                <p className="text-xs text-orange-400 mt-2">
                  Nenhuma rota cadastrada. <Link href="/admin/rotas" className="underline font-bold">Cadastre uma rota aqui</Link> primeiro.
                </p>
              )}
            </div>
          </div>

          {/* BLOCO 4: APOIADORES */}
          <div className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest border-b border-white/5 pb-2">4. Parcerias</h2>
            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1">Apoiadores do Treino</label>
              <select name="apoiadores" multiple className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition shadow-inner h-28">
                {listaApoiadores.map((apoiador: any) => (
                  <option key={apoiador.id} value={apoiador.id} className="py-1 px-2">🤝 {apoiador.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="mt-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-black py-4 rounded-xl hover:from-orange-500 hover:to-red-500 transition active:scale-98 shadow-[0_0_20px_rgba(249,115,22,0.3)] uppercase tracking-widest text-lg">
            Salvar e Publicar 🚀
          </button>

        </form>
      </main>
    </LayoutCaverna>
  );
}