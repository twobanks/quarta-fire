'use client'

import { useState, useTransition } from 'react';

interface AccordionInscricaoProps {
  // Agora a action retorna um objeto indicando erro ou sucesso
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
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl flex flex-col shrink-0">
      
      <button 
        type="button"
        onClick={() => {
          if (!sucesso) setIsOpen(!isOpen)
        }}
        className="w-full p-5 flex items-center justify-between bg-neutral-900/40 hover:bg-neutral-900 transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-lg font-black text-orange-500 uppercase tracking-wide">
              Confirme sua Presença 
            </h3>
          </div>
        </div>
        <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-neutral-950 border border-neutral-800 text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-500 border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.2)]' : ''}`}>
          🔥
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-neutral-800 bg-neutral-950/50">
          {sucesso ? (
            <div className="py-8 flex flex-col items-center justify-center text-center gap-3 animate-in fade-in zoom-in duration-300">
              <span className="text-5xl animate-bounce">🔥🐺🔥</span>
              <h4 className="text-3xl lg:text-4xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-red-500 to-amber-400 drop-shadow-[0_0_25px_rgba(249,115,22,0.8)] uppercase">
                AAAAAAAAAAUUUUUUUU!!
              </h4>
              <p className="text-xs text-neutral-400 mt-2 font-medium">
                Presença confirmada! Nos vemos no asfalto/trilha.
              </p>
            </div>
          ) : (
            <form action={handleSubmit} className="flex flex-col gap-4">
              
              {erro && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs font-bold p-3 rounded-xl text-center">
                  {erro}
                </div>
              )}

              {/* DADOS PESSOAIS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1.5">Seu Nome</label>
                  <input 
                    name="nome" 
                    type="text" 
                    required 
                    placeholder="Ex: Thiago Gonçalves"
                    className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1.5">WhatsApp (Chave Única)</label>
                  <input 
                    name="whatsapp" 
                    type="tel" 
                    required 
                    placeholder="Ex: 11999999999"
                    className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1.5">Seu Instagram</label>
                  <input 
                    name="instagram" 
                    type="text" 
                    required 
                    placeholder="Ex: twobanks"
                    className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1.5">Gênero (Para Brindes)</label>
                  <select 
                    name="genero" 
                    required
                    defaultValue=""
                    className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 transition appearance-none"
                  >
                    <option value="" disabled className="text-neutral-600">Selecione...</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Outro">Prefiro não informar</option>
                  </select>
                </div>
              </div>

              {/* SEGURANÇA E EMERGÊNCIA */}
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1.5">Contato de Emergência</label>
                <input 
                  name="contato_emergencia" 
                  type="text" 
                  required 
                  placeholder="Nome e telefone. Ex: Maria (11) 9999-9999"
                  className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              {/* TERMO DE RESPONSABILIDADE */}
              <div className="mt-2 bg-neutral-900/50 p-4 rounded-xl border border-neutral-800/80 flex items-start gap-3">
                <input 
                  type="checkbox" 
                  name="termo_responsabilidade" 
                  id="termo" 
                  required 
                  className="mt-0.5 w-4 h-4 shrink-0 accent-orange-500 bg-[#0a0a0a] border-neutral-800 rounded cursor-pointer"
                />
                <label htmlFor="termo" className="text-[10px] sm:text-xs text-neutral-400 leading-relaxed cursor-pointer select-none">
                  Declaro estar apto física e mentalmente para a prática esportiva, incluindo <strong className="text-neutral-200">treinos noturnos em zona rural e trilhas de difícil acesso</strong>. Autorizo o uso da minha imagem em fotos e vídeos nas redes oficiais da organização.
                </label>
              </div>

              <button 
                type="submit"
                disabled={isPending}
                className="mt-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-4 rounded-xl hover:from-orange-500 hover:to-red-500 transition shadow-[0_0_20px_rgba(249,115,22,0.2)] text-sm disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isPending ? 'Confirmando...' : 'BORA MEEEEEEN 🚀'}
              </button>
            </form>
          )}
        </div>
      )}
      
    </div>
  )
}