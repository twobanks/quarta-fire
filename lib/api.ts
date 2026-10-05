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
    .select('nome, instagram, status, whatsapp')
    .eq('treino_id', treino_id)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Erro ao buscar inscritos:', error)
    return []
  }
  return data
}

export async function inscreverCorredor(dados: {
  treino_id: string;
  nome: string;
  whatsapp: string;
  instagram: string;
  genero: string;
  contato_emergencia: string;
}) {
  const { data, error } = await supabase
    .from('inscricoes')
    .insert([
      {
        treino_id: dados.treino_id,
        nome: dados.nome,
        whatsapp: dados.whatsapp,
        instagram: dados.instagram,
        genero: dados.genero,
        contato_emergencia: dados.contato_emergencia,
      }
    ]);

  if (error) {
    throw new Error(error.message);
  }

  return data;
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
  
  // Captura todos os IDs dos apoiadores selecionados no campo de seleção múltipla
  const apoiadores = formData.getAll('apoiadores') as string[]
  
  const arquivoGpx = formData.get('gpx') as File | null
  const gpxUrlBase = formData.get('gpx_url_base') as string | null

  let gpx_url = ''

  // Verifica se temos um arquivo NOVO ou se estamos reaproveitando uma URL base
  if (arquivoGpx && arquivoGpx.size > 0) {
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

    gpx_url = urlData.publicUrl
  } else if (gpxUrlBase) {
    // Se não mandou arquivo, mas tem base, usa a base
    gpx_url = gpxUrlBase
  } else {
    // Se não tem nem um nem outro, dá erro
    return { error: 'O arquivo GPX é obrigatório para novos treinos.' }
  }

  const slugBase = titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
  
  const slug = `${numero}-${slugBase}`

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
        apoiadores, // O array com os IDs dos apoiadores é enviado para o banco
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

export async function getSemanasParticipadas(whatsapp: string, anoMes: string) {
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
    .select('treino_id, whatsapp')
    .eq('whatsapp', whatsapp)

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

// ----------------------------------------------------------------------
// FUNÇÕES PARA EDIÇÃO E REAPROVEITAMENTO DE TREINOS
// ----------------------------------------------------------------------

export async function getTreinoById(id: string) {
  const { data, error } = await supabase
    .from('treinos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erro ao buscar treino por ID:', error)
    return null
  }
  return data
}

export async function atualizarTreinoComGpx(id: string, formData: FormData) {
  // Função auxiliar para buscar o campo ignorando prefixos do Next.js
  const getField = (key: string) => {
    for (const [k, v] of formData.entries()) {
      if (k === key || k.endsWith(`_${key}`)) return v;
    }
    return null;
  };

  const numero = Number(getField('numero'))
  const titulo = getField('titulo') as string
  const data_treino = getField('data_treino') as string
  const local_encontro = getField('local_encontro') as string
  const link_maps = getField('link_maps') as string
  const hora_largada = getField('hora_largada') as string
  const brindes_parceiros = getField('brindes_parceiros') as string
  const arquivoGpx = getField('gpx') as File | null
  
  // Captura o array de apoiadores
  const apoiadores = formData.getAll('apoiadores') as string[]

  if (!id) return { error: 'ID do treino não fornecido.' };

  const slugBase = titulo ? titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') : 'treino';
  const slug = `${numero}-${slugBase}`;

  const dadosAtualizacao: any = {
    numero,
    titulo,
    slug,
    data_treino,
    local_encontro,
    link_maps,
    hora_largada,
    brindes_parceiros,
    apoiadores // Inserindo a nova coluna no update
  };

  if (arquivoGpx && typeof arquivoGpx === 'object' && 'size' in arquivoGpx && arquivoGpx.size > 0) {
    const nomeArquivo = `${Date.now()}-${arquivoGpx.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage.from('rotas_gpx').upload(nomeArquivo, arquivoGpx)
    if (uploadError) return { error: 'Erro ao fazer upload do novo arquivo GPX.' }
    const { data: urlData } = supabase.storage.from('rotas_gpx').getPublicUrl(uploadData.path)
    dadosAtualizacao.gpx_url = urlData.publicUrl
  }

  const { data, error } = await supabase.from('treinos').update(dadosAtualizacao).eq('id', id).select()
  if (error) return { error: error.message }
  return { data }
}

export async function getAllTreinos() {
  const { data, error } = await supabase
    .from('treinos')
    .select('*')
    .order('data_treino', { ascending: false }) // Mais recentes primeiro, antigos no final

  if (error) {
    console.error('Erro ao buscar todos os treinos:', error)
    return []
  }
  return data
}

// BUSCAR TODOS OS APOIADORES
export async function getApoiadores() {
  const { data, error } = await supabase
    .from('apoiadores')
    .select('*')
    .order('nome', { ascending: true })

  if (error) {
    console.error('Erro ao buscar apoiadores:', error)
    return []
  }
  return data
}

// CADASTRAR NOVO APOIADOR COM UPLOAD DE LOGO
export async function cadastrarApoiador(formData: FormData) {
  const nome = formData.get('nome') as string
  const instagram = formData.get('instagram') as string
  const brinde = formData.get('brinde') as string
  const logo = formData.get('logo') as File | null

  let logo_url = null

  // Se o usuário enviou uma imagem, faz o upload pro bucket logos_apoiadores
  if (logo && typeof logo === 'object' && 'size' in logo && logo.size > 0) {
    // Remove espaços e caracteres especiais do nome do arquivo para evitar bugs na URL
    const nomeLimpo = logo.name.replace(/[^a-zA-Z0-9.\-]/g, '_')
    const nomeArquivo = `${Date.now()}-${nomeLimpo}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('logos_apoiadores')
      .upload(nomeArquivo, logo)

    if (uploadError) {
      console.error('Erro no upload do logo:', uploadError)
      return { error: 'Erro ao fazer upload da imagem.' }
    }

    // Pega a URL pública da imagem salva
    const { data: urlData } = supabase.storage
      .from('logos_apoiadores')
      .getPublicUrl(uploadData.path)

    logo_url = urlData.publicUrl
  }

  // Insere os dados na nova tabela
  const { data, error } = await supabase
    .from('apoiadores')
    .insert([
      { 
        nome, 
        instagram, 
        brinde, 
        logo_url 
      }
    ])
    .select()

  if (error) {
    console.error('Erro ao salvar apoiador:', error)
    return { error: error.message }
  }

  return { data }
}

// Buscar todas as rotas cadastradas para popular o <select>
export async function getRotas() {
  const { data, error } = await supabase
    .from('rotas')
    .select('*')
    .order('titulo', { ascending: true });

  if (error) {
    console.error('Erro ao buscar rotas:', error);
    return [];
  }
  return data;
}

// Criar uma nova rota caso o admin suba um GPX inédito
export async function cadastrarRota(dados: {
  titulo: string;
  gpx_url: string;
  distancia_km: string;
  altimetria_m: string;
  perda_m: string;
  nivel_dificuldade: string;
}) {
  const { data, error } = await supabase
    .from('rotas')
    .insert([dados])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletarRota(id: string) {
  const { error } = await supabase.from('rotas').delete().eq('id', id);
  if (error) throw error;
  return true;
}