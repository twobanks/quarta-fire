import Header from "@/components/Header"
import { ReactNode } from "react"

export default function LayoutCaverna({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full mt-16 overflow-x-hidden bg-[#0a0a0a] font-sans flex flex-col selection:bg-orange-500 selection:text-black [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#0a0a0a] [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full">
      
      <style>{`
        @keyframes fire {
          0% { transform: scaleY(0.95) scaleX(0.98) skew(-1deg); }
          100% { transform: scaleY(1.05) scaleX(1.02) skew(1deg); }
        }
        .fire-anim {
          animation: fire 1.4s cubic-bezier(.455, .03, .515, .955) infinite alternate;
          transform-origin: bottom center;
          will-change: transform;
        }

        @keyframes smokeDrift {
          0% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { opacity: 0.4; }
          100% { transform: translateY(-100px) scale(1.1); opacity: 0.1; }
        }
        .smoke-overlay {
          animation: smokeDrift 15s infinite alternate ease-in-out;
        }
      `}</style>

      <svg className="hidden">
        <filter id="smoke-effect">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3 -1" in="noise" result="coloredNoise" />
          <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
          <feGaussianBlur stdDeviation="15" />
        </filter>
      </svg>

      <div 
        className="fixed inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 90px 40px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 160px 120px, #ffffff, rgba(0,0,0,0))',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px'
        }}
      />

      <div className="fixed inset-0 z-0 pointer-events-none smoke-overlay mix-blend-screen opacity-30">
        <div className="w-full h-full bg-gradient-to-t from-orange-900/40 via-neutral-600/20 to-transparent" style={{ filter: 'url(#smoke-effect)' }} />
      </div>

      <Header />

      {children}

      <div className="fixed bottom-0 left-0 w-[30vw] min-w-[200px] max-w-[400px] z-0 pointer-events-none -scale-x-100 origin-bottom opacity-50 mix-blend-screen">
        <svg className="w-full h-auto fire-anim" viewBox="0 0 609 387" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M90.5226 266.04C41.1228 279.679 13.591 368.917 6 395H627V88.119L591.089 190.85C577.951 215.913 546.857 241.647 527.587 144.075C508.318 46.5021 443.065 8.703 412.847 2C437.956 30.7063 476.173 95.2009 428.175 123.528C380.177 151.856 357.958 204.11 352.849 226.696C341.609 211.105 322.193 205.276 312.559 166.806C306.825 143.913 294.019 103.565 300.296 88.119C289.056 101.234 265.524 137.954 261.319 179.921C257.115 221.888 191.833 260.94 159.717 275.22C178.987 251.089 169.206 208.919 161.907 190.85C158.695 210.23 139.922 252.401 90.5226 266.04Z" fill="#FDBC24"></path>
          <path d="M71.961 322.713C50.9687 337.07 48.0531 378.592 49.2194 397.559L630.005 405L644 215.916L612.074 261.874C597.205 259.685 558.282 255.308 521.545 255.308C484.809 255.308 484.955 167.769 489.619 124C481.747 141.8 459.268 182.301 432.328 201.91C405.388 221.518 395.446 260.561 393.842 277.631C380.139 270.19 346.172 253.82 319.932 247.868C293.692 241.915 292.088 198.408 294.566 177.399C288.444 197.095 273.574 238.764 263.078 247.868C249.958 259.248 169.05 309.583 147.621 310.458C130.477 311.158 140.478 273.983 147.621 255.308C131.148 271.795 92.9532 308.357 71.961 322.713Z" fill="#FF9C40"></path>
        </svg>
      </div>

      <div className="fixed bottom-0 right-0 w-[30vw] min-w-[200px] max-w-[400px] z-0 pointer-events-none origin-bottom opacity-50 mix-blend-screen">
        <svg className="w-full h-auto fire-anim" viewBox="0 0 609 387" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M90.5226 266.04C41.1228 279.679 13.591 368.917 6 395H627V88.119L591.089 190.85C577.951 215.913 546.857 241.647 527.587 144.075C508.318 46.5021 443.065 8.703 412.847 2C437.956 30.7063 476.173 95.2009 428.175 123.528C380.177 151.856 357.958 204.11 352.849 226.696C341.609 211.105 322.193 205.276 312.559 166.806C306.825 143.913 294.019 103.565 300.296 88.119C289.056 101.234 265.524 137.954 261.319 179.921C257.115 221.888 191.833 260.94 159.717 275.22C178.987 251.089 169.206 208.919 161.907 190.85C158.695 210.23 139.922 252.401 90.5226 266.04Z" fill="#FDBC24"></path>
          <path d="M71.961 322.713C50.9687 337.07 48.0531 378.592 49.2194 397.559L630.005 405L644 215.916L612.074 261.874C597.205 259.685 558.282 255.308 521.545 255.308C484.809 255.308 484.955 167.769 489.619 124C481.747 141.8 459.268 182.301 432.328 201.91C405.388 221.518 395.446 260.561 393.842 277.631C380.139 270.19 346.172 253.82 319.932 247.868C293.692 241.915 292.088 198.408 294.566 177.399C288.444 197.095 273.574 238.764 263.078 247.868C249.958 259.248 169.05 309.583 147.621 310.458C130.477 311.158 140.478 273.983 147.621 255.308C131.148 271.795 92.9532 308.357 71.961 322.713Z" fill="#FF9C40"></path>
        </svg>
      </div>

    </div>
  )
}