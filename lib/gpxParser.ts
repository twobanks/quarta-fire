export interface DadosGpxResumo {
  distanciaKm: string;
  altimetriaM: string;
  perdaM: string;            // NOVO
  picoM: string;             // NOVO
  inclMax: string;           // NOVO
  tempoEstimado: string;
  tipoRota: string;          // NOVO
  nivelDificuldade: string;  // NOVO
  pontosGrafico: { distancia: number; elevacao: number; inclinacao: number }[];
}

export async function processarArquivoGpx(gpxUrl: string): Promise<DadosGpxResumo | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/gpx?url=${encodeURIComponent(gpxUrl)}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) return null
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao buscar resumo do GPX:', error)
    return null
  }
}