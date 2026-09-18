import { supabase } from './supabaseClient'

export async function getProximosTreinos() {
  const hoje = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('treinos')
    .select('*')
    .gte('data_treino', hoje)
    .order('data_treino', { ascending: true })

  if (error) {
    console.error('Erro ao buscar treinos:', error)
    return []
  }
  return data
}

export async function getTreinoBySlug(slug: string) {
  const { data, error } = await supabase
    .from('treinos')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Erro ao buscar treino por slug:', error)
    return null
  }
  return data
}

export async function getInscritos(treino_id: string) {
  const { data, error } = await supabase
    .from('inscricoes')
    .select('nome, instagram, status')
    .eq('treino_id', treino_id)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Erro ao buscar inscritos:', error)
    return []
  }
  return data
}

export async function inscreverCorredor(treino_id: string, nome: string, instagram: string) {
  const { data, error } = await supabase
    .from('inscricoes')
    .insert([
      { treino_id, nome, instagram }
    ])
    .select()

  return { data, error }
}

export async function cadastrarTreinoComGpx(formData: FormData) {
  const numero = Number(formData.get('numero'))
  const titulo = formData.get('titulo') as string
  const data_treino = formData.get('data_treino') as string
  const local_encontro = formData.get('local_encontro') as string
  const link_maps = formData.get('link_maps') as string
  const hora_concentracao = formData.get('hora_concentracao') as string
  const hora_largada = formData.get('hora_largada') as string
  const distancia = formData.get('distancia') as string
  const brindes_parceiros = formData.get('brindes_parceiros') as string
  const arquivoGpx = formData.get('gpx') as File

  if (!arquivoGpx || arquivoGpx.size === 0) {
    return { error: 'O arquivo GPX é obrigatório.' }
  }

  const slugBase = titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
  
  const slug = `${numero}-${slugBase}`

  const nomeArquivo = `${Date.now()}-${arquivoGpx.name}`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('rotas_gpx')
    .upload(nomeArquivo, arquivoGpx)

  if (uploadError) {
    console.error('Erro no upload do GPX:', uploadError)
    return { error: 'Erro ao fazer upload do arquivo GPX.' }
  }

  const { data: urlData } = supabase.storage
    .from('rotas_gpx')
    .getPublicUrl(uploadData.path)

  const gpx_url = urlData.publicUrl

  const { data, error } = await supabase
    .from('treinos')
    .insert([
      {
        numero,
        titulo,
        slug,
        data_treino,
        local_encontro,
        link_maps,
        hora_concentracao,
        hora_largada,
        distancia,
        brindes_parceiros,
        gpx_url,
        inscricoes_abertas: true
      }
    ])
    .select()

  if (error) {
    console.error('Erro ao salvar treino no banco:', error)
    return { error: error.message }
  }

  return { data }
}

export async function getHistoricoParticipacoes(instagram: string) {
  const { count, error } = await supabase
    .from('inscricoes')
    .select('*', { count: 'exact', head: true })
    .eq('instagram', instagram)

  if (error) {
    console.error('Erro ao buscar histórico:', error)
    return 0
  }
  
  return count || 0
}

export async function getSemanasParticipadas(instagram: string, anoMes: string) {
  const [ano, mes] = anoMes.split('-')
  
  const primeiroDia = `${ano}-${mes}-01`
  const ultimoDia = new Date(Number(ano), Number(mes), 0).toISOString().split('T')[0]

  const { data: treinosDoMes, error: erroTreinos } = await supabase
    .from('treinos')
    .select('id, data_treino')
    .gte('data_treino', primeiroDia)
    .lte('data_treino', ultimoDia)
    .order('data_treino', { ascending: true })

  if (erroTreinos || !treinosDoMes || treinosDoMes.length === 0) return []

  const ordemTreinos: { [key: string]: number } = {}
  treinosDoMes.forEach((t, index) => {
    ordemTreinos[t.id] = index + 1
  })

  const { data: minhasInscricoes, error: erroInscricoes } = await supabase
    .from('inscricoes')
    .select('treino_id, instagram')
    .eq('instagram', instagram)

  if (erroInscricoes || !minhasInscricoes || minhasInscricoes.length === 0) return []

  const posicoesAtivas: number[] = []
  minhasInscricoes.forEach((inscricao) => {
    const posicao = ordemTreinos[inscricao.treino_id]
    if (posicao && !posicoesAtivas.includes(posicao)) {
      posicoesAtivas.push(posicao)
    }
  })

  return posicoesAtivas
}