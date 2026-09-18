import { NextResponse } from 'next/server'

function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  const action = searchParams.get('action')

  if (!url) return NextResponse.json({ error: 'URL ausente' }, { status: 400 })

  try {
    const response = await fetch(url)
    if (!response.ok) return NextResponse.json({ error: 'Erro ao baixar GPX' }, { status: response.status })

    const gpxText = await response.text()
    if (action === 'raw') {
      return new NextResponse(gpxText, { headers: { 'Content-Type': 'application/gpx+xml', 'Access-Control-Allow-Origin': '*' } })
    }

    const latRegex = /lat="([^"]+)"/g
    const lonRegex = /lon="([^"]+)"/g
    const eleRegex = /<ele>([^<]+)<\/ele>/g

    const lats: number[] = [], lons: number[] = [], eles: number[] = []
    let match
    while ((match = latRegex.exec(gpxText)) !== null) lats.push(parseFloat(match[1]))
    while ((match = lonRegex.exec(gpxText)) !== null) lons.push(parseFloat(match[1]))
    while ((match = eleRegex.exec(gpxText)) !== null) eles.push(parseFloat(match[1]))

    let distanciaTotalMetros = 0
    let ganhoAltimetria = 0
    let perdaAltimetria = 0
    let elevacaoMaxima = -Infinity
    let inclinacaoMaxima = 0
    const pontosGrafico: { distancia: number; elevacao: number; inclinacao: number }[] = []

    for (let i = 0; i < lats.length; i++) {
      const lat = lats[i], lon = lons[i], ele = eles[i] || 0

      if (ele > elevacaoMaxima) elevacaoMaxima = ele

      if (i > 0) {
        const distanciaTrecho = calcularDistancia(lats[i - 1], lons[i - 1], lat, lon)
        distanciaTotalMetros += distanciaTrecho

        const eleAnterior = eles[i - 1] || 0
        if (ele > eleAnterior) ganhoAltimetria += (ele - eleAnterior)
        else if (ele < eleAnterior) perdaAltimetria += (eleAnterior - ele)

        let inclinacao = 0
        if (distanciaTrecho > 0) {
          inclinacao = Number((((ele - eleAnterior) / distanciaTrecho) * 100).toFixed(1))
          if (inclinacao > inclinacaoMaxima) inclinacaoMaxima = inclinacao
        }

        const distanciaKmAtual = Number((distanciaTotalMetros / 1000).toFixed(2))

        if (i % 3 === 0 || i === lats.length - 1) {
          pontosGrafico.push({ distancia: distanciaKmAtual, elevacao: Math.round(ele), inclinacao })
        }
      } else {
        pontosGrafico.push({ distancia: 0, elevacao: Math.round(ele), inclinacao: 0 })
      }
    }

    const distanciaKmNum = distanciaTotalMetros / 1000
    const distanciaKm = distanciaKmNum.toFixed(2) + ' km'
    const altimetriaM = Math.round(ganhoAltimetria) + ' m'
    const perdaM = '-' + Math.round(perdaAltimetria) + ' m'
    const picoM = Math.round(elevacaoMaxima === -Infinity ? 0 : elevacaoMaxima) + ' m'
    const inclMax = inclinacaoMaxima.toFixed(1) + '%'
    const score = distanciaKmNum + (ganhoAltimetria / 100)

    const minutosTotais = score * 8.5
    const horas = Math.floor(minutosTotais / 60)
    const minutos = Math.round(minutosTotais % 60)
    const tempoEstimado = horas > 0 ? `${horas}h ${minutos}min` : `${minutos} min`

    let tipoRota = 'Desconhecido'
    if (lats.length > 0) {
      const distInicioFim = calcularDistancia(lats[0], lons[0], lats[lats.length - 1], lons[lons.length - 1])
      tipoRota = distInicioFim <= 150 ? '🔄 Circuito' : '➡️ Ponto a Ponto'
    }

    let nivelDificuldade = '🟢 Suave'
    if (score >= 40) nivelDificuldade = '💀 Casca Grossa'      // Ex: 25km com 1500m D+ (Score 40)
    else if (score >= 24) nivelDificuldade = '🔴 Avançado'      // Ex: 16km com 800m D+ (Score 24)
    else if (score >= 12) nivelDificuldade = '🟡 Intermediário' // Ex: 10km com 200m D+ (Score 12)

    return NextResponse.json({
      distanciaKm, altimetriaM, perdaM, picoM, inclMax, tempoEstimado, tipoRota, nivelDificuldade, pontosGrafico
    })

  } catch (error) {
    return NextResponse.json({ error: 'Erro ao processar' }, { status: 500 })
  }
}