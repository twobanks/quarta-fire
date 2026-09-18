import { Inter } from 'next/font/google'; // Ajuste se usar outra fonte
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'QUARTA-FIRE | Coletivo de Corrida',
  description: 'Agenda mensal, rotas e lista de presença do coletivo QUARTA-FIRE.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-neutral-950 text-neutral-50 antialiased min-h-screen flex flex-col`}>
        
        {/* O layout principal agora deixa as páginas respirarem e usarem o tamanho que precisarem */}
        <div className="flex-1 flex flex-col w-full">
          {children}
        </div>

        {/* Rodapé Global Escuro e Minimalista */}
        <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-500 text-center p-6 text-sm mt-auto">
          <p className="font-bold mb-1 text-neutral-400">Coletivo QUARTA-FIRE</p>
          <p className="text-xs">Corra com a gente toda quarta-feira.</p>
        </footer>

      </body>
    </html>
  )
}