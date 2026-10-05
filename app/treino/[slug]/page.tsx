import AccordionInscricao from '@/components/AccordionInscricao';
import GraficoAltimetria from '@/components/GraficoAltimetria';
import Header from '@/components/Header';
import MapaGpx from '@/components/MapaGpx';
import { getApoiadores, getInscritos, getSemanasParticipadas, getTreinoBySlug, inscreverCorredor } from '@/lib/api';
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
  
  // Busca todos os apoiadores e filtra apenas os que foram selecionados neste treino
  const todosApoiadores = await getApoiadores() || [];
  const apoiadoresDoTreino = todosApoiadores.filter((apo: any) => 
    treino.apoiadores?.includes(apo.id)
  );

  const dadosGpx = treino.gpx_url ? await processarArquivoGpx(treino.gpx_url) : null
  const distanciaKm = dadosGpx?.distanciaKm || '0 km'
  const altimetriaM = dadosGpx?.altimetriaM || '0 m'
  const perdaM = dadosGpx?.perdaM || '0 m'
  const nivelDificuldade = dadosGpx?.nivelDificuldade || ''
  const pontosGrafico = dadosGpx?.pontosGrafico || []

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

  // Bloco reutilizável do Mapa
  const renderMapa = (alturaMobile = "h-[350px]") => (
    <div className={`w-full ${alturaMobile} lg:h-full relative rounded-2xl lg:rounded-none overflow-hidden border border-white/10 lg:border-none shadow-xl lg:shadow-none bg-neutral-900`}>
      {treino.gpx_url ? (
        <div className="absolute inset-0 w-full h-full">
          <MapaGpx gpxUrl={treino.gpx_url} />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[#111] p-12 text-center text-neutral-400 flex items-center justify-center">
          <p>Nenhum arquivo GPX anexado a este treino ainda.</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="relative h-screen bg-[#0a0a0a] text-neutral-100 selection:bg-orange-500 selection:text-black font-sans flex flex-col overflow-hidden">
      
      {/* ESTILOS E ANIMAÇÕES DE FUNDO (Padrão Caverna) */}
      <style>{`
        @keyframes fire {
          0% { transform: scaleY(0.95) scaleX(0.98) skew(-1deg); }
          100% { transform: scaleY(1.05) scaleX(1.02) skew(1deg); }
        }
        .fire-anim {
          animation: fire 1.4s cubic-bezier(.455, .03, .515, .955) infinite alternate;
          transform-origin: bottom center;
          will-change: transform;
        }
        @keyframes smokeDrift {
          0% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { opacity: 0.4; }
          100% { transform: translateY(-100px) scale(1.1); opacity: 0.1; }
        }
        .smoke-overlay {
          animation: smokeDrift 15s infinite alternate ease-in-out;
        }
      `}</style>

      {/* SVG FILTER PARA A FUMAÇA */}
      <svg className="hidden">
        <filter id="smoke-effect">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3 -1" in="noise" result="coloredNoise" />
          <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
          <feGaussianBlur stdDeviation="15" />
        </filter>
      </svg>

      {/* BACKGROUND: ESTRELAS */}
      <div 
        className="fixed inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 90px 40px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 160px 120px, #ffffff, rgba(0,0,0,0))',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px'
        }}
      />

      {/* BACKGROUND: FUMAÇA */}
      <div className="fixed inset-0 z-0 pointer-events-none smoke-overlay mix-blend-screen opacity-30">
        <div className="w-full h-full bg-gradient-to-t from-orange-900/40 via-neutral-600/20 to-transparent" style={{ filter: 'url(#smoke-effect)' }} />
      </div>

      <Header />
      
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 w-full h-[calc(100vh-4rem)] mt-16 overflow-hidden">
        
        {/* COLUNA ESQUERDA */}
        <div className="lg:col-span-5 px-4 sm:px-6 lg:pl-8 lg:pr-6 py-6 flex flex-col gap-6 overflow-y-auto h-full [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-neutral-900/40 [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full">
          
          {/* TOPO: VOLTAR E TÍTULO */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Link href="/treinos" className="text-neutral-400 hover:text-orange-500 transition-colors text-sm font-bold inline-flex items-center gap-1">
                ← Voltar para Treinos
              </Link>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-white uppercase leading-tight">
              {treino.titulo || "Treino Coletivo QUARTA-FIRE"}
            </h2>
          </div>

          {/* CARD DE INFORMAÇÕES DO TREINO */}
          <div className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
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

            {/* PONTO DE ENCONTRO */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-neutral-400 uppercase tracking-widest font-bold">Ponto de Encontro</span>
              <div className="flex items-center gap-2">
                {treino.link_maps ? (
                  <a 
                    href={treino.link_maps} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-orange-500 font-bold text-sm inline-flex items-center gap-1 hover:underline"
                  >
                    📍 {treino.local_encontro || 'Abrir no Maps'} →
                  </a>
                ) : (
                  <p className="text-sm font-bold text-white">
                    📍 {treino.local_encontro || 'IFTM'}
                  </p>
                )}
              </div>
            </div>

            {/* DOWNLOAD DO GPX */}
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

            <details className="group bg-neutral-950/40 rounded-xl border border-white/10 overflow-hidden shadow-md transition-all duration-300 open:border-orange-500/40">
              <summary className="p-4 flex items-center justify-between cursor-pointer select-none list-none hover:bg-neutral-900/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500/10 border border-orange-500/30 text-orange-500 rounded-lg flex items-center justify-center text-base shrink-0">
                    ⚠️
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-wider text-white leading-tight">
                      Equipamentos Obrigatórios
                    </h4>
                    <p className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">
                      QUARTA-FIRE – TOQUE PARA VER
                    </p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-xs text-neutral-400 transition-transform duration-300 group-open:rotate-180 group-open:text-orange-500">
                  ▼
                </div>
              </summary>

              <div className="p-4 border-t border-white/10 flex flex-col divide-y divide-white/5 text-xs bg-neutral-950/30">
                <div className="py-2.5 flex items-center gap-3">
                  <span className="text-base">🎒</span>
                  <strong className="uppercase text-white font-medium">Mochila de Hidratação / Cinto</strong>
                </div>
                <div className="py-2.5 flex items-center gap-3">
                  <span className="text-base">🫙</span>
                  <strong className="uppercase text-white font-medium">Recipiente com 1L de Água</strong>
                </div>
                <div className="py-2.5 flex items-center gap-3">
                  <span className="text-base">🍫</span>
                  <div>
                    <strong className="block uppercase text-white font-medium">Alimentação para percurso longo</strong>
                    <span className="text-[11px] text-neutral-400">(Média 2h em atividade)</span>
                  </div>
                </div>
                <div className="py-2.5 flex items-center gap-3">
                  <span className="text-base">📱</span>
                  <strong className="uppercase text-white font-medium">Celular Carregado 100%</strong>
                </div>
                <div className="py-2.5 flex items-center gap-3">
                  <span className="text-base">🔦</span>
                  <div>
                    <strong className="block uppercase text-white font-medium">Lanterna Carregada</strong>
                    <span className="text-[11px] text-neutral-400">2h de luz no mínimo</span>
                  </div>
                </div>
                <div className="py-2.5 flex items-center gap-3">
                  <span className="text-base">👟</span>
                  <div>
                    <strong className="block uppercase text-white font-medium">Tênis próprio para Trail Run</strong>
                    <span className="text-[11px] text-neutral-400">(Com bom grip/solado)</span>
                  </div>
                </div>
                <div className="py-2.5 flex items-center gap-3">
                  <span className="text-base">👕</span>
                  <strong className="uppercase text-white font-medium">Roupa para troca pós-treino</strong>
                </div>
                <div className="py-2.5 flex items-center gap-3">
                  <span className="text-base">🥽</span>
                  <div>
                    <strong className="block uppercase text-white font-medium">Óculos de Proteção</strong>
                    <span className="text-[11px] text-neutral-400">(Recomendável)</span>
                  </div>
                </div>
                <div className="pt-2.5 flex items-center gap-3">
                  <span className="text-base">🥤</span>
                  <strong className="uppercase text-white font-medium">Copo</strong>
                </div>
              </div>
            </details>
          </div>

          {treino.gpx_url && dadosGpx && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-lg font-black tracking-tight text-white uppercase flex items-center gap-2">
                  <span>⛰</span> Dados do Percurso
                </h3>
                <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-300 shadow-sm">
                  {nivelDificuldade}
                </span>
              </div>

              <div className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-3 gap-y-4 gap-x-2 text-center py-6 px-4">
                  <div className="flex flex-col items-center">
                    <p className="text-xs text-neutral-400 font-medium">Distância</p>
                    <p className="text-xl sm:text-2xl font-bold text-white mt-1">{distanciaKm}</p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <p className="text-xs text-neutral-400 font-medium">Ganho Elev.</p>
                    <p className="text-xl sm:text-2xl font-bold text-white mt-1">{altimetriaM}</p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <p className="text-xs text-neutral-400 font-medium">Perda Elev.</p>
                    <p className="text-xl sm:text-2xl font-bold text-white mt-1">{perdaM}</p>
                  </div>
                </div>

                {pontosGrafico.length > 0 && (
                  <div className="border-t border-white/10 pt-4 pb-2">
                    <GraficoAltimetria dados={pontosGrafico} />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="block lg:hidden">
            {renderMapa("h-[350px]")}
          </div>

          <AccordionInscricao action={handleInscricaoAction} />

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-black tracking-tight text-white uppercase px-1 flex items-center gap-2">
              <span>🤝</span> Apoiadores do Treino
            </h3>
            
            {apoiadoresDoTreino.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {apoiadoresDoTreino.map((apoiador: any) => (
                  <div key={apoiador.id} className="bg-[#111]/80 backdrop-blur-md border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center gap-2 text-center shadow-lg">
                    <div className="w-12 h-12 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-lg overflow-hidden">
                      {apoiador.logo_url ? (
                        <img src={apoiador.logo_url} alt={apoiador.nome} className="w-full h-full object-cover" />
                      ) : (
                        <span>🤝</span>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block truncate">{apoiador.nome}</span>
                      {apoiador.instagram && (
                        <span className="text-[10px] text-orange-400 block truncate mt-0.5">{apoiador.instagram}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400 italic py-2 px-1">
                Nenhum apoiador vinculado a este treino específico.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 pb-8">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-black tracking-tight text-white uppercase flex items-center gap-2">
                <span>🔥</span> Tropa Confirmada
              </h3>
              <span className="bg-neutral-900 text-neutral-300 text-xs px-2.5 py-1 rounded-full border border-neutral-800">
                {inscritos.length} {inscritos.length === 1 ? 'corredor' : 'corredores'}
              </span>
            </div>
            
            {inscritos.length > 0 ? (
              <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-neutral-900/40 [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                {await Promise.all(
                  inscritos.map(async (item: any, index: number) => {
                    const inicial = item.nome ? item.nome.charAt(0).toUpperCase() : 'C'
                    const anoMes = treino.data_treino.substring(0, 7)
                    const semanasAtivas = await getSemanasParticipadas(item.whatsapp, anoMes)

                    return (
                      <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-[#111]/80 border border-white/10 shadow-md">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-600 to-red-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                            {inicial}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-white">{item.nome}</p>
                            <p className="text-xs text-neutral-400">{item.instagram}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 px-2.5 py-1.5 rounded-full">
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
              <p className="text-xs text-neutral-400 italic py-2 px-1">
                Ainda não há confirmações. Seja o primeiro a confirmar!
              </p>
            )}
          </div>

        </div>

        {/* COLUNA DIREITA: MAPA FIXO (Desktop) */}
        <div className="hidden lg:block lg:col-span-7 h-full w-full border-l border-white/10">
          {renderMapa("h-full")}
        </div>

      </main>
    </div>
  )
}