'use client'

import { useState, useTransition } from 'react'

interface AccordionInscricaoProps {
  action: (formData: FormData) => Promise<void>
}

export default function AccordionInscricao({ action }: AccordionInscricaoProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      // 1. Executa a ação do servidor para salvar a presença no banco
      await action(formData)

      // 2. Ativa o estado de sucesso (some o form, aparece o grito de guerra)
      setSucesso(true)

      // 3. Após 10 segundos, limpa o estado de sucesso e fecha o accordion
      setTimeout(() => {
        setSucesso(false)
        setIsOpen(false)
      }, 10000)
    })
  }

  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl flex flex-col shrink-0">
      
      {/* BOTÃO GATILHO */}
      <button 
        type="button"
        onClick={() => {
          if (!sucesso) setIsOpen(!isOpen)
        }}
        className="w-full p-5 flex items-center justify-between bg-neutral-900/40 hover:bg-neutral-900 transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">🔥</span>
          <div>
            <h3 className="text-lg font-black italic text-orange-500 uppercase tracking-wide">
              Confirme sua Presença
            </h3>
          </div>
        </div>
        
        {/* ÍCONE DA SETA */}
        <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-neutral-950 border border-neutral-800 text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-500 border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.2)]' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </div>
      </button>

      {/* CONTEÚDO EXPANSÍVEL */}
      {isOpen && (
        <div className="p-5 border-t border-neutral-800 bg-neutral-950/50">
          {sucesso ? (
            /* GRITO DE GUERRA COM EFEITO DE FOGO */
            <div className="py-8 flex flex-col items-center justify-center text-center gap-3 animate-in fade-in zoom-in duration-300">
              <h4 className="text-3xl lg:text-4xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-red-500 to-amber-400 drop-shadow-[0_0_25px_rgba(249,115,22,0.8)] uppercase">
                AAAAAAAAAAUUUUUUUU!!
              </h4>
              <p className="text-xs text-neutral-400 mt-2 font-medium">
                Presença confirmada SEEEEEEEEEEEER!
              </p>
            </div>
          ) : (
            /* FORMULÁRIO PADRÃO */
            <form action={handleSubmit} className="flex flex-col gap-4">
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
                <label className="block text-xs font-bold text-neutral-400 mb-1.5">Seu Instagram</label>
                <input 
                  name="instagram" 
                  type="text" 
                  required 
                  placeholder="Ex: twobanks"
                  className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <button 
                type="submit"
                disabled={isPending}
                className="mt-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-3.5 rounded-xl hover:from-orange-500 hover:to-red-500 transition shadow-[0_0_20px_rgba(249,115,22,0.2)] text-sm disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isPending ? 'Confirmando...' : 'Confirmar Presença 🚀'}
              </button>
            </form>
          )}
        </div>
      )}
      
    </div>
  )
}