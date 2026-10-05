'use client'

import { useState, useTransition } from 'react';

interface AccordionInscricaoProps {
  // A action retorna um objeto indicando erro ou sucesso
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean }>
}

export default function AccordionInscricao({ action }: AccordionInscricaoProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    setErro(null)
    
    startTransition(async () => {
      const response = await action(formData)

      if (response?.error) {
        setErro(response.error)
        return
      }

      if (response?.success) {
        setSucesso(true)
        setTimeout(() => {
          setSucesso(false)
          setIsOpen(false)
        }, 10000)
      }
    })
  }

  return (
    <div className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col shrink-0">
      
      {/* BOTÃO DO ACCORDION */}
      <button 
        type="button"
        onClick={() => {
          if (!sucesso) setIsOpen(!isOpen)
        }}
        className="w-full p-5 flex items-center justify-between bg-neutral-950/40 hover:bg-neutral-900/60 transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-lg font-black text-orange-500 uppercase tracking-wide">
              Confirme sua Presença 
            </h3>
          </div>
        </div>
        <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-neutral-900 border border-white/10 text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-500 border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : ''}`}>
          🔥
        </div>
      </button>

      {/* CONTEÚDO DO FORMULÁRIO */}
      {isOpen && (
        <div className="p-5 border-t border-white/10 bg-neutral-950/60">
          {sucesso ? (
            <div className="py-8 flex flex-col items-center justify-center text-center gap-3 animate-in fade-in zoom-in duration-300">
              <span className="text-5xl animate-bounce">🔥🐺🔥</span>
              <h4 className="text-3xl lg:text-4xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-red-500 to-amber-400 drop-shadow-[0_0_25px_rgba(249,115,22,0.8)] uppercase">
                AAAAAAAAAUUUUUUUU!!
              </h4>
              <p className="text-xs text-neutral-300 mt-2 font-medium">
                Presença confirmada! Nos vemos no asfalto/trilha.
              </p>
            </div>
          ) : (
            <form action={handleSubmit} className="flex flex-col gap-4">
              
              {erro && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs font-bold p-3 rounded-xl text-center shadow-md">
                  {erro}
                </div>
              )}

              {/* DADOS PESSOAIS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">Seu Nome</label>
                  <input 
                    name="nome" 
                    type="text" 
                    required 
                    placeholder="Ex: Thiago Gonçalves"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">WhatsApp (Chave Única)</label>
                  <input 
                    name="whatsapp" 
                    type="tel" 
                    required 
                    placeholder="Ex: 11999999999"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">Seu Instagram</label>
                  <input 
                    name="instagram" 
                    type="text" 
                    required 
                    placeholder="Ex: twobanks"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">Gênero (Para Brindes)</label>
                  <select 
                    name="genero" 
                    required
                    defaultValue=""
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition appearance-none shadow-inner"
                  >
                    <option value="" disabled className="text-neutral-500">Selecione...</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Outro">Prefiro não informar</option>
                  </select>
                </div>
              </div>

              {/* SEGURANÇA E EMERGÊNCIA */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">Contato de Emergência</label>
                <input 
                  name="contato_emergencia" 
                  type="text" 
                  required 
                  placeholder="Nome e telefone. Ex: Maria (11) 9999-9999"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition shadow-inner"
                />
              </div>

              {/* TERMO DE RESPONSABILIDADE */}
              <div className="mt-1 bg-neutral-900/60 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                <input 
                  type="checkbox" 
                  name="termo_responsabilidade" 
                  id="termo" 
                  required 
                  className="mt-0.5 w-4 h-4 shrink-0 accent-orange-500 bg-[#0a0a0a] border-white/20 rounded cursor-pointer"
                />
                <label htmlFor="termo" className="text-[10px] sm:text-xs text-neutral-300 leading-relaxed cursor-pointer select-none">
                  Declaro estar apto física e mentalmente para a prática esportiva, incluindo <strong className="text-white font-semibold">treinos noturnos em zona rural e trilhas de difícil acesso</strong>. Autorizo o uso da minha imagem em fotos e vídeos nas redes oficiais da organização.
                </label>
              </div>

              {/* BOTÃO DE AÇÃO PRINCIPAL COM DESTAQUE MÁXIMO (CTA) */}
              <button 
                type="submit"
                disabled={isPending}
                className="mt-2 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 text-white font-black uppercase tracking-wider py-4 px-6 rounded-xl hover:from-orange-400 hover:to-red-500 transition-all shadow-[0_0_25px_rgba(249,115,22,0.4)] text-sm disabled:opacity-50 flex justify-center items-center gap-2 border border-orange-400/30 cursor-pointer"
              >
                {isPending ? 'Confirmando presença...' : 'BORA MEEEEEEN 🚀'}
              </button>
            </form>
          )}
        </div>
      )}
      
    </div>
  )
}