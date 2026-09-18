'use client'

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

interface PontoGrafico {
  distancia: number
  elevacao: number
  inclinacao: number
}

interface GraficoAltimetriaProps {
  dados: PontoGrafico[]
}

// Customizamos a caixinha preta que aparece ao passar o mouse/dedo
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dadosPonto = payload[0].payload
    return (
      <div className="bg-neutral-900 text-neutral-100 p-3 rounded-xl shadow-xl text-xs border border-neutral-800">
        <p className="font-black text-orange-500 mb-1 text-sm">{label} km</p>
        <p className="flex justify-between gap-4">
          <span className="text-neutral-400">Elevação:</span>
          <span className="font-bold">{dadosPonto.elevacao} m</span>
        </p>
        <p className="flex justify-between gap-4 mt-1">
          <span className="text-neutral-400">Inclinação:</span>
          <span className="font-bold text-orange-400">{dadosPonto.inclinacao}%</span>
        </p>
      </div>
    )
  }
  return null
}

export default function GraficoAltimetria({ dados }: GraficoAltimetriaProps) {
  if (!dados || dados.length === 0) return null

  return (
    <div className="w-full h-48 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={dados}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          {/* Define o gradiente laranja do QUARTA-FIRE */}
          <defs>
            <linearGradient id="corAltimetria" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          
          {/* Eixos invisíveis para manter o design limpo */}
          <XAxis dataKey="distancia" hide />
          {/* O domain dinâmico garante que as montanhas não fiquem achatadas */}
          <YAxis 
            domain={['dataMin - 5', 'dataMax + 10']} 
            hide 
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Area
            type="monotone"
            dataKey="elevacao"
            stroke="#ea580c" /* Laranja mais escuro para a linha do topo */
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#corAltimetria)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}