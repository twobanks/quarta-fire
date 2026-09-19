'use client'

export default function LogoFire({ className = "w-full max-w-2xl mx-auto" }: { className?: string }) {
  return (
    <div className={className}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 800 250" 
        className="w-full h-auto drop-shadow-2xl"
      >
        <defs>
          {/* 1. Gradiente base do fogo (do vermelho escuro ao branco) */}
          <linearGradient id="fireGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#7a0000" />
            <stop offset="30%" stopColor="#ff2a00" />
            <stop offset="60%" stopColor="#ff7a00" />
            <stop offset="90%" stopColor="#ffcc00" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* 2. Filtro SVG de Turbulência (A Mágica do Fogo) */}
          <filter id="fire-filter" x="-20%" y="-50%" width="140%" height="200%">
            {/* O animate no baseFrequency cria o movimento caótico do fogo */}
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.08" numOctaves="3" result="noise">
              <animate 
                attributeName="baseFrequency" 
                values="0.015 0.08; 0.025 0.12; 0.015 0.08" 
                dur="2s" 
                repeatCount="indefinite" 
              />
            </feTurbulence>
            
            {/* Distorce o texto usando o ruído gerado acima */}
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="25" 
              xChannelSelector="R" 
              yChannelSelector="G" 
              result="displaced" 
            />
            
            {/* Borra levemente as pontas das chamas */}
            <feGaussianBlur in="displaced" stdDeviation="3" result="blurred" />
            
            <feMerge>
              <feMergeNode in="blurred" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 3. Filtro de Brilho Interno (Glow) */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* CSS Embutido para as faíscas e pulsação */}
        <style>{`
          .spark {
            fill: #ffcc00;
            animation: rise infinite ease-in;
          }
          .s1 { animation-duration: 1.2s; animation-delay: 0.1s; transform-origin: 200px 180px; }
          .s2 { animation-duration: 1.5s; animation-delay: 0.5s; transform-origin: 400px 160px; }
          .s3 { animation-duration: 1.1s; animation-delay: 0.8s; transform-origin: 600px 170px; }
          .s4 { animation-duration: 1.7s; animation-delay: 0.2s; transform-origin: 300px 190px; }
          
          @keyframes rise {
            0% { transform: translateY(0) scale(1.5); opacity: 1; }
            100% { transform: translateY(-80px) scale(0); opacity: 0; }
          }
          
          .pulse-core {
            animation: pulse-core 2s infinite alternate;
          }
          
          @keyframes pulse-core {
            0% { filter: brightness(1); }
            100% { filter: brightness(1.25); }
          }
        `}</style>

        {/* Fundo Transparente ou Escuro (Remova o rect se quiser fundo 100% transparente) */}
        {/* <rect width="100%" height="100%" fill="#0a0a0a" /> */}

        {/* Container do Texto Centralizado */}
        <g style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontStyle: 'normal' }}>
          
          {/* Camada 1: Sombra Distorcida (Fogo ao Fundo - Vermelho escuro) */}
          <text 
            x="50%" 
            y="65%" 
            textAnchor="middle" 
            fontSize="90" 
            fill="#ff0000" 
            filter="url(#fire-filter)" 
            opacity="0.7"
            transform="translate(0, -10)"
          >
            QUARTA-FIRE
          </text>

          {/* Camada 2: Chamas Intermediárias (Laranja) */}
          <text 
            x="50%" 
            y="65%" 
            textAnchor="middle" 
            fontSize="90" 
            fill="#ff7a00" 
            filter="url(#fire-filter)" 
            opacity="0.9"
          >
            QUARTA-FIRE
          </text>

          {/* Camada 3: Núcleo do Texto (Nítido, com gradiente e brilho pulsante) */}
          <text 
            x="50%" 
            y="65%" 
            textAnchor="middle" 
            fontSize="90" 
            fill="url(#fireGradient)" 
            filter="url(#glow)"
            className="pulse-core"
          >
            QUARTA-FIRE
          </text>
        </g>

        {/* Faíscas Subindo (Partículas SVG) */}
        <circle cx="200" cy="180" r="3" className="spark s1" />
        <circle cx="400" cy="160" r="2" className="spark s2" />
        <circle cx="600" cy="170" r="4" className="spark s3" />
        <circle cx="300" cy="190" r="2" className="spark s4" />
        <circle cx="500" cy="185" r="3" className="spark s1" style={{ animationDelay: '0.4s' }} />
      </svg>
    </div>
  )
}