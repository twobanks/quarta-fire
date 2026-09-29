import AccordionInscricao from '@/components/AccordionInscricao';
import GraficoAltimetria from '@/components/GraficoAltimetria';
import Header from '@/components/Header';
import MapaGpx from '@/components/MapaGpx';
import { getInscritos, getSemanasParticipadas, getTreinoBySlug, inscreverCorredor } from '@/lib/api';
import { processarArquivoGpx } from '@/lib/gpxParser';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';

function formatarData(dataString: string) {
  const data = new Date(dataString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(data)
}

export default async function DetalhesTreino({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  const treino = await getTreinoBySlug(slug)

  if (!treino) {
    notFound() 
  }

  const inscritos = await getInscritos(treino.id)
  const dadosGpx = treino.gpx_url ? await processarArquivoGpx(treino.gpx_url) : null
  const distanciaKm = dadosGpx?.distanciaKm || '0 km'
  const altimetriaM = dadosGpx?.altimetriaM || '0 m'
  const perdaM = dadosGpx?.perdaM || '0 m'
  const nivelDificuldade = dadosGpx?.nivelDificuldade || ''
  const pontosGrafico = dadosGpx?.pontosGrafico || []
  const tempoEstimado = dadosGpx?.tempoEstimado || '0 min'

  async function handleInscricaoAction(formData: FormData) {
    'use server'
    const nome = formData.get('nome') as string
    const whatsapp = formData.get('whatsapp') as string
    const instagram = formData.get('instagram') as string
    const genero = formData.get('genero') as string
    const contato_emergencia = formData.get('contato_emergencia') as string

    if (!nome || !whatsapp || !instagram || !genero || !contato_emergencia) {
      return { error: 'Preencha todos os campos obrigatórios, por favor.' }
    }

    const instaLimpo = instagram.trim().replace('@', '').toLowerCase()
    const instaFormatado = `@${instaLimpo}`

    // Verifica se já está inscrito pelo WhatsApp ou Instagram
    const jaInscrito = inscritos.some(
      (participante: any) => 
        participante.whatsapp === whatsapp.trim() || 
        participante.instagram.toLowerCase() === instaFormatado
    )

    if (jaInscrito) {
      return { error: 'Uai, Seer! Você já confirmou presença neste treino.' }
    }

    try {
      await inscreverCorredor({
        treino_id: treino.id,
        nome: nome.trim(),
        whatsapp: whatsapp.trim(),
        instagram: instaFormatado,
        genero,
        contato_emergencia: contato_emergencia.trim()
      })
      
      revalidatePath(`/treino/${slug}`)
      return { success: true }
    } catch (err) {
      console.error("Erro ao inscrever:", err)
      return { error: 'Ocorreu um erro ao salvar. Tente novamente.' }
    }
  }

  return (
    <div className="h-screen bg-neutral-950 text-neutral-100 selection:bg-orange-500/30 font-sans flex flex-col overflow-hidden ">
      <Header />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 w-full h-[calc(100vh-4rem)] overflow-hidden">
        <div className="lg:col-span-5 mt-12 px-4 lg:pl-4 lg:pr-4 py-8 flex flex-col gap-4 overflow-y-auto h-full [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-neutral-900/40 [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Link href="/treinos" className="font-flamezinna text-3xl sm:text-2xl leading-none tracking-widest uppercase flex items-center gap-2 text-white pt-1">
                ← 
              </Link>
              <h2 className="text-4xl lg:text-4xl font-black tracking-tight text-white uppercase">
                {treino.titulo || "Treino Coletivo QUARTA-FIRE"}
              </h2>
            </div>

            <div className="bg-[#111]/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                {/* Data */}
                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                  <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="capitalize text-white font-medium">{formatarData(treino.data_treino)}</span>
                </div>

                {/* Horário */}
                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                  <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white font-mono font-bold text-sm">
                    {treino.hora_largada?.substring(0, 5) || '19:15'}
                  </span>
                </div>
              </div>

              {/* LINHA 2: PONTO DE ENCONTRO */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {treino.link_maps ? (
                    <a 
                      href={treino.link_maps} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white-500 font-bold text-sm inline-flex items-center gap-1 hover:text-orange-500 transition-colors"
                    >
                      📍 {treino.local_encontro || 'Abrir no Maps'}
                    </a>
                  ) : (
                    <p className="text-sm font-bold text-white">
                      📍 {treino.local_encontro || 'IFTM'}
                    </p>
                  )}
                </div>
              </div>

              {/* LINHA 3: DOWNLOAD DO GPX */}
              {treino.gpx_url && (
                <div className="pt-2 border-t border-white/10">
                  <a 
                    href={treino.gpx_url} 
                    download={`Rota-${treino.slug || 'QuartaFire'}.gpx`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-neutral-900/80 hover:bg-neutral-800 border border-white/5 text-neutral-200 hover:text-white rounded-xl text-sm font-semibold transition-all shadow-md group"
                  >
                    <svg className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Baixar Percurso (GPX)
                  </a>
                </div>
              )}
              <AccordionInscricao action={handleInscricaoAction} />
            </div>
          </div>
          {/* <hr className="border-neutral-700" /> */}
          {/* SEÇÕES DEPENDENTES DE GPX */}
          {treino.gpx_url && dadosGpx && (
            <>
              {/* SEÇÃO 2: Dados do Percurso */}
              <div className="flex flex-col gap-4 ">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4">
                  <h3 className="text-lg font-black tracking-tight text-white uppercase">
                    Dados do Percurso
                  </h3>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-300 shadow-sm">
                      {nivelDificuldade}
                    </span>
                  </div>
                </div>
                <div className='bg-neutral-900/60 border border-neutral-800 rounded-2xl shadow-xl'>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-center py-6">
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-neutral-300 font-normal">Distância</p>
                      <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{distanciaKm}</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-neutral-300 font-normal">Tempo Estimado</p>
                      <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{tempoEstimado}</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-neutral-300 font-normal">Ganho de Elevação</p>
                      <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{altimetriaM}</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-neutral-300 font-normal">Perda de Elevação</p>
                      <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{perdaM}</p>
                    </div>
                  </div>
                  <hr className="border-neutral-900" />
                  {pontosGrafico.length > 0 && (
                    <GraficoAltimetria dados={pontosGrafico} />
                  )}
                </div>
              </div>

            </>
          )}

          {/* SEÇÃO 5: Brindes */}
          <div className="flex flex-col gap-4">
            <h3 className="p-4 text-lg font-black tracking-tight text-white uppercase">
              Sorteio de Brindes
            </h3>
            <div className="grid grid-cols-3 gap-3 bg-neutral-900/60 border border-neutral-800 rounded-2xl shadow-xl">
              {[1, 2, 3].map((i) => (
                <div key={`brinde-${i}`} className="bg-neutral-900/40 p-4 rounded-xl border border-neutral-900 flex flex-col items-center justify-center gap-2 text-center">
                  <span className="text-3xl">🎁</span>
                  <span className="text-xs font-bold text-neutral-300">Brinde {i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SEÇÃO 6: Apoiadores */}
          <div className="flex flex-col gap-4 ">
            <h3 className="p-4 text-lg font-black tracking-tight text-white uppercase">
              Apoiadores do Treino
            </h3>
            <div className="grid grid-cols-3 gap-3 bg-neutral-900/60 border border-neutral-800 rounded-2xl shadow-xl">
              {[1, 2, 3].map((i) => (
                <div key={`apoiador-${i}`} className="bg-neutral-900/40 p-4 rounded-xl border border-neutral-900 flex flex-col items-center justify-center gap-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-lg">
                    🤝
                  </div>
                  <span className="text-xs font-bold text-neutral-300">Apoiador {i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SEÇÃO 4: Galera Confirmada */}
          <div className="flex flex-col gap-4 pb-8">
            <h3 className="text-lg font-black tracking-tight text-white uppercase flex items-center justify-between px-4">
              <span>Tropa Confirmada</span>
              <span className="bg-neutral-900 text-neutral-300 text-xs px-2.5 py-1 rounded-full border border-neutral-800">
                {inscritos.length} {inscritos.length === 1 ? 'corredor' : 'corredores'}
              </span>
            </h3>
            
            {inscritos.length > 0 ? (
              /* Scroll interno da lista cinza/sutil */
              <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-neutral-900/40 [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                {await Promise.all(
                  inscritos.map(async (item: any, index: number) => {
                    const inicial = item.nome ? item.nome.charAt(0).toUpperCase() : 'C'
                    const anoMes = treino.data_treino.substring(0, 7)
                    const semanasAtivas = await getSemanasParticipadas(item.whatsapp, anoMes)

                    return (
                      <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/40 border border-neutral-900">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-600 to-red-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                            {inicial}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-white">{item.nome}</p>
                            <p className="text-xs text-neutral-500">{item.instagram}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-900 px-2.5 py-1.5 rounded-full">
                          {[1, 2, 3, 4].map((semana) => {
                            const participou = semanasAtivas.includes(semana)
                            return (
                              <span 
                                key={semana} 
                                title={`Semana ${semana}`}
                                className={`text-base transition-all ${
                                  participou ? 'opacity-100 scale-110 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'opacity-20 grayscale'
                                }`}
                              >
                                🔥
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            ) : (
              <p className="text-xs text-neutral-500 italic py-2">
                Ainda não há confirmações. Seja o primeiro a confirmar!
              </p>
            )}
          </div>

        </div>

        {/* COLUNA DIREITA: Mapa perfeitamente grudado */}
        <div className="lg:col-span-7 relative h-[400px] lg:h-full w-full">
          {treino.gpx_url ? (
            <div className="absolute inset-0 w-full h-full">
              <MapaGpx gpxUrl={treino.gpx_url} />
            </div>
          ) : (
            <div className="absolute inset-0 bg-neutral-900/40 p-12 text-center text-neutral-500 flex items-center justify-center">
              <p>Nenhum arquivo GPX anexado a este treino ainda.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}