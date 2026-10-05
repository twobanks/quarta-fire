import LayoutCaverna from '@/components/LayoutCaverna';
import Link from 'next/link';

export default async function AdminHubPage() {
  const secoesAdmin = [
    {
      titulo: 'Gerenciar Treinos',
      descricao: 'Visualize, crie, edite ou reaproveite rotas de treinos coletivos.',
      href: '/admin/treinos',
      icone: '🔥',
      badge: 'Principal',
      destaque: true
    },
    {
      titulo: 'Gerenciar Rotas (GPX)',
      descricao: 'Cadastre e gerencie o catálogo de percursos oficiais do Quarta-Fire.',
      href: '/admin/rotas',
      icone: '🗺️',
      badge: 'Percursos',
      destaque: false
    },
    {
      titulo: 'Gerenciar Apoiadores',
      descricao: 'Adicione marcas parceiras, logotipos e brindes vinculados aos treinos.',
      href: '/admin/apoiadores',
      icone: '🤝',
      badge: 'Parceiros',
      destaque: false
    },
    {
      titulo: 'Cadastrar Novo Treino',
      descricao: 'Abra o formulário rápido para publicar um novo treino coletivo.',
      href: '/admin/treino/novo-treino',
      icone: '⚡',
      badge: 'Atalho',
      destaque: false
    }
  ];

  return (
    <LayoutCaverna>
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 py-12 flex-1 flex flex-col gap-8 pb-32">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase mt-1">
            CENTRAL DE <span className="text-orange-500">COMANDO</span> 
          </h1>
        </div>

        {/* LISTAGEM NO PADRÃO DE BARRAS HORIZONTAIS */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {secoesAdmin.map((secao, index) => (
              <Link 
                key={index} 
                href={secao.href}
                className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:px-6 sm:py-5 rounded-2xl backdrop-blur-md transition-all gap-4 shadow-xl group bg-[#111]/80 border border-white/10 hover:border-orange-500/40`}
              >
                <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                    {secao.icone}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base sm:text-lg uppercase tracking-wide group-hover:text-orange-500 transition-colors">
                      {secao.titulo}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5 max-w-md">
                      {secao.descricao}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <span className="px-3 py-1.5 rounded-xl bg-orange-600/10 group-hover:bg-orange-600 text-orange-500 group-hover:text-white border border-orange-500/20 text-xs font-black transition-all flex items-center gap-1">
                    <span>Acessar</span>
                    <span>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </LayoutCaverna>
  );
}