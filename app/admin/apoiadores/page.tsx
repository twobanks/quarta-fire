import Header from '@/components/Header';
import { cadastrarApoiador, getApoiadores } from '@/lib/api';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AdminApoiadoresPage() {
  const apoiadores = await getApoiadores() || [];
  
  async function handleAddApoiador(formData: FormData) {
    'use server'
    
    const resultado = await cadastrarApoiador(formData);

    if (resultado?.error) {
      console.error(resultado.error);
      return;
    }
    
    revalidatePath('/admin/apoiadores');
    redirect('/admin/apoiadores');
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 flex flex-col font-sans pb-12">
      <Header />
      
      <main className="flex-1 mt-16 px-4 py-8 max-w-5xl mx-auto w-full flex flex-col md:flex-row gap-8">
        
        {/* COLUNA ESQUERDA: FORMULÁRIO */}
        <div className="w-full md:w-5/12 flex flex-col gap-6">
          <div>
            <Link href="/admin/treinos" className="text-sm font-semibold text-neutral-400 hover:text-orange-500 transition flex items-center gap-1 mb-4">
              ← Voltar aos Treinos
            </Link>
            <h1 className="text-3xl font-black uppercase text-white tracking-tight">
              Apoiadores 🔥
            </h1>
            <p className="text-xs text-neutral-400 mt-1">Cadastre as marcas e os brindes oferecidos.</p>
          </div>

          <form action={handleAddApoiador} className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
            
            {/* INFORMAÇÕES BÁSICAS */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">Nome do Parceiro / Marca *</label>
                <input 
                  name="nome" 
                  type="text" 
                  required 
                  placeholder="Ex: Suplementos Pro"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition shadow-inner"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">Instagram (Opcional)</label>
                <input 
                  name="instagram" 
                  type="text" 
                  placeholder="Ex: @suplementospro"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">Brinde Oferecido (Opcional)</label>
                <input 
                  name="brinde" 
                  type="text" 
                  placeholder="Ex: 15% de desconto no site"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition shadow-inner"
                />
              </div>
            </div>

            {/* UPLOAD DE LOGO */}
            <div className="border-2 border-dashed border-white/10 rounded-xl p-4 bg-neutral-900/60 text-center mt-2">
              <label className="block text-xs font-bold text-neutral-400 mb-2">Logo da Marca (Opcional)</label>
              <input 
                name="logo" 
                type="file" 
                accept="image/png, image/jpeg, image/webp"
                className="w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-500/10 file:text-orange-500 hover:file:bg-orange-500/20 cursor-pointer"
              />
            </div>

            <button 
              type="submit"
              className="mt-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-3.5 rounded-xl hover:from-orange-500 hover:to-red-500 transition active:scale-98 shadow-[0_0_15px_rgba(249,115,22,0.2)] text-sm uppercase tracking-wider"
            >
              Salvar Parceiro 🤝
            </button>
          </form>
        </div>

        {/* COLUNA DIREITA: LISTAGEM */}
        <div className="w-full md:w-7/12 flex flex-col gap-4">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Parceiros Cadastrados</h2>
            <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-1 rounded-md font-bold">{apoiadores.length} ativos</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {apoiadores.map((apoiador) => (
              <div key={apoiador.id} className="bg-[#111]/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4 hover:border-orange-500/30 transition-colors">
                
                {/* AVATAR / LOGO */}
                <div className="w-14 h-14 bg-[#0a0a0a] rounded-full flex-shrink-0 overflow-hidden border border-white/10 flex items-center justify-center">
                  {apoiador.logo_url ? (
                    <img src={apoiador.logo_url} alt={apoiador.nome} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">🏢</span>
                  )}
                </div>

                {/* INFO DO PARCEIRO */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-white text-base truncate">{apoiador.nome}</h3>
                    <button className="text-[10px] bg-red-500/10 text-red-500 hover:bg-red-500/20 px-2 py-1 rounded font-bold uppercase tracking-wider transition shrink-0">
                      Excluir
                    </button>
                  </div>
                  
                  {apoiador.instagram && (
                    <p className="text-xs text-orange-500 font-medium mt-0.5">{apoiador.instagram}</p>
                  )}
                  
                  {apoiador.brinde ? (
                    <div className="mt-2 bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                      <p className="text-xs text-neutral-300 flex items-center gap-2">
                        <span className="text-orange-500">🎁</span>
                        <span className="truncate">{apoiador.brinde}</span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-neutral-600 mt-2 font-medium uppercase tracking-wider">Nenhum brinde fixo</p>
                  )}
                </div>
              </div>
            ))}

            {apoiadores.length === 0 && (
              <div className="text-center text-neutral-500 py-16 bg-[#111]/60 rounded-2xl border border-dashed border-white/10">
                <span className="text-4xl block mb-3">🕸️</span>
                Nenhum parceiro cadastrado ainda.
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}