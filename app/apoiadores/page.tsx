
export default function ApoiadoresPage() {
  const parceiros = [
    { nome: 'Loja do Corredor', desc: 'Desconto de 15% em tênis.', logo: '/loja1.png' },
    { nome: 'Suplementos Alpha', desc: 'Isotônicos para os treinos longos.', logo: '/loja2.png' },
  ]

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-black italic text-orange-500 uppercase tracking-tight mb-4">
          Apoiadores
        </h1>
        <p className="text-neutral-400 mb-12">
          As marcas e empresas que ajudam a manter a fogueira acesa.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {parceiros.map((parceiro, i) => (
            <div key={i} className="bg-[#111] border border-[#222] p-6 rounded-2xl flex items-center gap-6 hover:border-orange-500/50 transition">
              <div className="w-16 h-16 bg-neutral-900 rounded-full flex-shrink-0" /> {/* Troque por <Image /> depois */}
              <div>
                <h3 className="text-white font-bold text-lg uppercase">{parceiro.nome}</h3>
                <p className="text-neutral-500 text-sm mt-1">{parceiro.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}