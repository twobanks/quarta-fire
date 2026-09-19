import AccordionInscricao from '@/components/AccordionInscricao';
import GraficoAltimetria from '@/components/GraficoAltimetria';
import LogoFire from '@/components/LogoFire';
import MapaGpx from '@/components/MapaGpx';
import { getInscritos, getSemanasParticipadas, getTreinoBySlug, inscreverCorredor } from '@/lib/api';
import { processarArquivoGpx } from '@/lib/gpxParser';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';

function formatarData(dataString: string) {
  const data = new Date(dataString)
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
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
    const instagram = formData.get('instagram') as string

    if (!nome || !instagram) {
      return { error: 'Preencha todos os campos, por favor.' }
    }

    const instaLimpo = instagram.trim().replace('@', '').toLowerCase()
    const instaFormatado = `@${instaLimpo}`

    const jaInscrito = inscritos.some(
      (participante: any) => participante.instagram.toLowerCase() === instaFormatado
    )

    if (jaInscrito) {
      return { error: 'Uai, Seer! Você já confirmou presença neste treino.' }
    }

    try {
      await inscreverCorredor(treino.id, nome.trim(), instaFormatado)
      revalidatePath(`/treino/${slug}`)
      return { success: true }
    } catch (err) {
      return { error: 'Ocorreu um erro ao salvar. Tente novamente.' }
    }
  }

  return (
    <div className="h-screen bg-neutral-950 text-neutral-100 selection:bg-orange-500/30 font-sans flex flex-col overflow-hidden">
      
      {/* HEADER FIXO NO TOPO */}
      <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-900 shrink-0 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoFire className="w-80 mx-auto" />
          </div>
          <Link href="/" className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors">
            ← Voltar
          </Link>
        </div>
      </header>

      {/* CONTAINER PRINCIPAL: Ocupa exatamente a altura restante da tela */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 w-full h-[calc(100vh-4rem)] overflow-hidden">
        
        {/* COLUNA ESQUERDA: Com rolagem própria independente */}
        <div className="lg:col-span-5 px-4 lg:pl-8 lg:pr-6 py-8 flex flex-col gap-8 overflow-y-auto h-full">
          
          {/* Cabeçalho & Logística */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-orange-500 font-bold tracking-wider text-xs uppercase mb-1">
                {formatarData(treino.data_treino)}
              </p>
              <h2 className="text-4xl lg:text-5xl font-black italic tracking-tight text-white uppercase">
                {treino.titulo || "Treino Coletivo QUARTA-FIRE"}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2 border-t border-neutral-900">
              <div className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Encontro</p>
                  <p className="font-bold text-neutral-200">{treino.local_encontro}</p>
                  {treino.link_maps && (
                    <a 
                      href={treino.link_maps} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-orange-500 font-bold text-xs inline-block mt-1 hover:underline"
                    >
                      Abrir no Maps →
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">⏰</span>
                <div>
                  <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Largada</p>
                  <p className="font-bold text-neutral-200">{treino.hora_largada?.substring(0, 5) || '19:00'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dados do Percurso & Gráfico */}
          {treino.gpx_url && dadosGpx && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                  Dados do Percurso
                </h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-bold text-orange-400 shadow-sm">
                    {nivelDificuldade}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-neutral-900/60 p-3.5 rounded-xl border border-neutral-900">
                  <p className="text-xs text-neutral-500 font-medium">Distância</p>
                  <p className="text-lg font-black text-white">{distanciaKm}</p>
                </div>
                <div className="bg-neutral-900/60 p-3.5 rounded-xl border border-neutral-900">
                  <p className="text-xs text-neutral-500 font-medium">Tempo Médio</p>
                  <p className="text-lg font-black text-white">{tempoEstimado}</p>
                </div>
                <div className="bg-neutral-900/60 p-3.5 rounded-xl border border-neutral-900">
                  <p className="text-xs text-neutral-500 font-medium">Subida Acumulada</p>
                  <p className="text-lg font-black text-orange-500">+{altimetriaM}</p>
                </div>
                <div className="bg-neutral-900/60 p-3.5 rounded-xl border border-neutral-900">
                  <p className="text-xs text-neutral-500 font-medium">Descida Acumulada</p>
                  <p className="text-lg font-black text-blue-400">{perdaM}</p>
                </div>
              </div>

              {pontosGrafico.length > 0 && (
                <div className="pt-4 pb-1">
                  <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                    Perfil de Elevação
                  </h4>
                  <GraficoAltimetria dados={pontosGrafico} />
                </div>
              )}

              <a 
                href={treino.gpx_url} 
                download={`Rota-${treino.slug || 'QuartaFire'}.gpx`}
                className="flex items-center justify-center w-full gap-2 py-3.5 mt-1 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold hover:from-orange-500 hover:to-red-500 transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)] text-sm"
              >
                Baixar Percurso (GPX)
              </a>
            </div>
          )}

          <AccordionInscricao action={handleInscricaoAction} />

          {/* Lista de Confirmados */}
          <div className="flex flex-col gap-3 pb-8">
            <h3 className="font-bold text-neutral-400 uppercase tracking-widest text-xs flex items-center justify-between">
              <span>Galera Confirmada</span>
              <span className="bg-neutral-900 text-neutral-300 text-xs px-2.5 py-1 rounded-full border border-neutral-800">
                {inscritos.length} {inscritos.length === 1 ? 'corredor' : 'corredores'}
              </span>
            </h3>
            
            {inscritos.length > 0 ? (
              <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1">
                {await Promise.all(
                  inscritos.map(async (item: any, index: number) => {
                    const inicial = item.nome ? item.nome.charAt(0).toUpperCase() : 'C'
                    const anoMes = treino.data_treino.substring(0, 7)
                    const semanasAtivas = await getSemanasParticipadas(item.instagram, anoMes)

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

        {/* COLUNA DIREITA: Mapa perfeitamente grudado sem bordas e sem scroll global */}
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