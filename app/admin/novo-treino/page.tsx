import { cadastrarTreinoComGpx } from '@/lib/api'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default function NovoTreinoPage() {

  async function handleAction(formData: FormData) {
    'use server'
    const resultado = await cadastrarTreinoComGpx(formData)
    
    if (resultado.error) {
      console.error(resultado.error)
      return
    }

    // Redireciona para a home após cadastrar com sucesso
    redirect('/')
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div>
        <Link href="/" className="text-sm font-semibold text-neutral-500 hover:text-orange-600 transition flex items-center gap-1">
          ← Voltar para o site
        </Link>
      </div>

      <div className="bg-neutral-900 text-white rounded-2xl p-6 shadow-md">
        <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Painel Secreto
        </span>
        <h1 className="text-2xl font-black italic tracking-tight mt-2 mb-1">
          Cadastrar Novo Treino 🔥
        </h1>
        <p className="text-neutral-400 text-xs">
          Preencha os dados e suba o arquivo GPX gerado pelo Strava.
        </p>
      </div>

      <form action={handleAction} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Número do Treino</label>
            <input 
              name="numero" 
              type="number" 
              required 
              placeholder="Ex: 1"
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-600"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-neutral-700 mb-1">Data da Quarta-feira</label>
            <input 
              name="data_treino" 
              type="date" 
              required 
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-1">Título do Treino</label>
          <input 
            name="titulo" 
            type="text" 
            required 
            placeholder="Ex: Treino Inauguração"
            className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-1">Local de Encontro</label>
          <input 
            name="local_encontro" 
            type="text" 
            required 
            placeholder="Ex: Praça Central"
            className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-1">Link do Google Maps</label>
          <input 
            name="link_maps" 
            type="url" 
            placeholder="Ex: https://maps.app.goo.gl/..."
            className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Concentração</label>
            <input 
              name="hora_concentracao" 
              type="time" 
              required 
              defaultValue="19:00"
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Largada</label>
            <input 
              name="hora_largada" 
              type="time" 
              required 
              defaultValue="19:15"
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Distância (Ex: 5km)</label>
            <input 
              name="distancia" 
              type="text" 
              required 
              placeholder="Ex: 6.5km"
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Brindes e Apoio</label>
            <input 
              name="brindes_parceiros" 
              type="text" 
              placeholder="Ex: Sorteio de gel de carboidrato"
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-600"
            />
          </div>
        </div>

        {/* CAMPO DE UPLOAD DO GPX */}
        <div className="border-2 border-dashed border-neutral-300 rounded-xl p-4 bg-neutral-50 text-center">
          <label className="block text-xs font-bold text-neutral-700 mb-1">Arquivo GPX da Rota (Strava)</label>
          <input 
            name="gpx" 
            type="file" 
            accept=".gpx"
            required 
            className="text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
          />
        </div>

        <button 
          type="submit"
          className="mt-2 bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition active:scale-98 shadow-md"
        >
          Salvar e Publicar Treino 🚀
        </button>

      </form>
    </div>
  )
}