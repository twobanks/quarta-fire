'use client'

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useRef, useState } from 'react'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

export default function MapaGpx({ gpxUrl }: { gpxUrl: string }) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  
  const [is3D, setIs3D] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (!mapContainer.current || !gpxUrl) return
    if (mapInstance.current) return

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12', // Altera para o estilo Satélite + Ruas
      center: [-43.1729, -22.9068],
      zoom: 13,
      pitch: 0,
      interactive: true,
      attributionControl: false
    })

    map.on('styleimagemissing', (e) => {
      const id = e.id;
      map.addImage(id, new ImageData(1, 1));
    });

    mapInstance.current = map

    async function carregarRotaGpx() {
      try {
        const response = await fetch(`/api/gpx?url=${encodeURIComponent(gpxUrl)}&action=raw`)
        if (!response.ok) return

        const gpxText = await response.text()
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(gpxText, 'text/xml')
        
        let trackPoints = xmlDoc.getElementsByTagName('trkpt')
        if (trackPoints.length === 0) {
          trackPoints = xmlDoc.getElementsByTagName('rtept')
        }

        const coordinates: [number, number][] = []

        for (let i = 0; i < trackPoints.length; i++) {
          const lat = parseFloat(trackPoints[i].getAttribute('lat') || '0')
          const lon = parseFloat(trackPoints[i].getAttribute('lon') || '0')
          if (lat && lon) {
            coordinates.push([lon, lat])
          }
        }

        if (coordinates.length === 0) return

        const desenharMapaBase = () => {
          if (map.getSource('route')) return

          try {
            const layers = map.getStyle().layers;
            layers.forEach((layer) => {
              if (layer.type === 'background') {
                map.setPaintProperty(layer.id, 'background-color', '#0a0a0a');
              }
              if (layer.type === 'fill') {
                map.setPaintProperty(layer.id, 'fill-color', '#0a0a0a');
              }
              
              
            });
          } catch (e) {
            console.error('Erro ao ajustar camadas do mapa:', e);
          }

          map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
          })

          map.addLayer({
            'id': 'sky',
            'type': 'sky',
            'paint': {
              'sky-type': 'atmosphere',
              'sky-atmosphere-sun': [0.0, 0.0],
              'sky-atmosphere-sun-intensity': 15
            }
          })

          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: coordinates
              }
            }
          })

          map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#fc4c02', 
              'line-width': 5
            }
          })

          if (coordinates.length > 0) {
            const elLargada = document.createElement('div')
            elLargada.className = 'flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md'
            const marcadorLargada = new mapboxgl.Marker(elLargada)
              .setLngLat(coordinates[0])
              .addTo(map)
            markersRef.current.push(marcadorLargada)

            const elChegada = document.createElement('div')
            elChegada.className = 'flex items-center justify-center text-lg drop-shadow-[0_0_8px_rgba(249,115,22,0.9)]'
            elChegada.innerHTML = '🔥'
            const ultimaCoord = coordinates[coordinates.length - 1]
            const marcadorChegada = new mapboxgl.Marker(elChegada)
              .setLngLat(ultimaCoord)
              .addTo(map)
            markersRef.current.push(marcadorChegada)
          }

          const bounds = new mapboxgl.LngLatBounds()
          coordinates.forEach(coord => bounds.extend(coord))
          map.fitBounds(bounds, { padding: 40, maxZoom: 15 })
        }

        if (map.loaded()) {
          desenharMapaBase()
        } else {
          map.on('load', desenharMapaBase)
        }

      } catch (err) {
        console.error('Erro crítico ao processar o arquivo GPX:', err)
      }
    }

    carregarRotaGpx()

    return () => {
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []
      map.remove()
      mapInstance.current = null
    }
  }, [gpxUrl])

  const toggle3D = () => {
    const map = mapInstance.current
    if (!map) return

    if (is3D) {
      map.easeTo({ pitch: 0, duration: 1000 })
      // @ts-ignore
      map.setTerrain(null) 
      setIs3D(false)
    } else {
      map.easeTo({ pitch: 60, duration: 1000 })
      map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.2 })
      setIs3D(true)
    }
  }

  const toggleFullscreen = () => {
    if (!mapContainer.current) return
    if (!document.fullscreenElement) {
      mapContainer.current.requestFullscreen().catch(err => {
        alert(`Erro ao tentar modo tela cheia: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div ref={mapContainer} className="w-full h-full overflow-hidden relative flex-1 bg-[#0a0a0a]">
      {/* Container de Controles Customizados Unificados no Canto Superior Direito */}
      {/* Container de Controles Customizados Compactos no Canto Superior Direito */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
        
        {/* Botão Modo 3D / 2D Compacto */}
        <button
          onClick={toggle3D}
          className="bg-neutral-900 border border-neutral-800 text-neutral-200 w-8 h-8 rounded-xl font-bold text-xs shadow-xl hover:bg-neutral-800 transition-all flex items-center justify-center group"
          title={is3D ? "Voltar para visão plana" : "Ativar visão 3D e relevo"}
        >
          {is3D ? (
            <span className="text-[10px] font-black text-neutral-400 group-hover:text-white">2D</span>
          ) : (
            <span className="text-[10px] font-black text-orange-500">3D</span>
          )}
        </button>

        {/* Botão Expandir / Tela Cheia Compacto */}
        <button
          onClick={toggleFullscreen}
          className="bg-neutral-900 border border-neutral-800 text-neutral-200 w-8 h-8 rounded-xl shadow-xl hover:bg-neutral-800 transition-all flex items-center justify-center group"
          title="Expandir mapa"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-neutral-300 group-hover:text-white">
            {isFullscreen ? (
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
            ) : (
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            )}
          </svg>
        </button>

      </div>

      {/* Ajuste fino do topo dos controles nativos do Mapbox para ficarem logo abaixo */}
      <style jsx global>{`
        .mapboxgl-ctrl-top-right {
          top: 85px !important;
          right: 12px !important;
        }
        .mapboxgl-ctrl-group {
          background-color: #171717 !important;
          border: 1px solid #262626 !important;
          border-radius: 0.75rem !important;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
        }
        .mapboxgl-ctrl-group button {
          border-bottom: 1px solid #262626 !important;
          width: 32px !important;
          height: 32px !important;
        }
        .mapboxgl-ctrl-group button:last-child {
          border-bottom: none !important;
        }
        .mapboxgl-ctrl-icon {
          filter: invert(100%) hue-rotate(180deg) brightness(90%) !important;
        }
      `}</style>
    </div>
  )
}