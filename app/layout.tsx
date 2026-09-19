import './globals.css';


export const metadata = {
  title: 'QUARTA-FIRE | Coletivo de Corrida',
  description: 'Agenda mensal, rotas e lista de presença do coletivo QUARTA-FIRE.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-roboto bg-[#0a0a0a] text-white">
        {children}
      </body>
    </html>
  )
}