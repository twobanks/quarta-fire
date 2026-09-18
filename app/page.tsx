import { getProximosTreinos } from '@/lib/api'
import Link from 'next/link'

function formatarData(dataString: string) {
  const data = new Date(dataString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC'
  }).format(data)
}

export default async function Home() {
  const treinos = await getProximosTreinos()
  const proximoTreino = treinos[0]
  const treinosFuturos = treinos.slice(1)

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex justify-end -mb-4">
        <Link 
          href="/admin/novo-treino"
          className="bg-neutral-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow hover:bg-orange-600 transition flex items-center gap-1"
        >
          <span>➕ Novo Treino</span>
        </Link>
      </div>

      <section>
        <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-3">
          Próximo Treino
        </h2>
        
        {proximoTreino ? (
          <Link href={`/treino/${proximoTreino.slug}`} className="block">
            <div className="bg-orange-600 rounded-2xl p-6 text-white shadow-lg transform transition active:scale-95">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                  {formatarData(proximoTreino.data_treino)}
                </div>
                <span className="text-3xl" aria-hidden="true">🔥</span>
              </div>
              
              <h3 className="text-2xl font-black italic tracking-tight mb-1">
                {proximoTreino.titulo || "Treino QUARTA-FIRE"}
              </h3>
              
              <div className="flex flex-col gap-1 text-orange-100 text-sm mt-4">
                <p className="flex items-center gap-2">
                  📍 {proximoTreino.local_encontro}
                </p>
                <p className="flex items-center gap-2">
                  ⏰ Concentração: {proximoTreino.hora_concentracao?.substring(0, 5)}
                </p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-orange-500/50 flex justify-between items-center font-semibold">
                <span>Ver detalhes e confirmar presença</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-neutral-100 border-2 border-dashed border-neutral-300 rounded-2xl p-6 text-center text-neutral-500">
            Nenhum treino agendado no momento.
          </div>
        )}
      </section>

      {/* SEÇÃO 2: CALENDÁRIO DO MÊS */}
      {treinosFuturos.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-3">
            Agenda do Mês
          </h2>
          
          <div className="flex flex-col gap-3">
            {treinosFuturos.map((treino) => (
              <Link key={treino.id} href={`/treino/${treino.slug}`}>
                <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center justify-between shadow-sm active:bg-neutral-50 transition">
                  <div>
                    <p className="font-bold text-neutral-900">
                      {formatarData(treino.data_treino)}
                    </p>
                    <p className="text-sm text-neutral-500 truncate max-w-[200px]">
                      {treino.titulo || treino.local_encontro}
                    </p>
                  </div>
                  <div className="text-orange-600 font-bold">
                    Ver →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}