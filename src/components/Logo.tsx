interface LogoProps {
  size?: number
  showText?: boolean
  variant?: 'full' | 'icon'
  className?: string
}

export function BexaltecLogo({ size = 40, showText = true, variant = 'full', className = '' }: LogoProps) {
  // Scale factor — original logo is 600 wide × 692 tall, we normalize to viewBox 0 0 100 115
  const iconW = size
  const iconH = size * 1.15

  const icon = (
    <svg width={iconW} height={iconH} viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer hexagon */}
      <polygon
        points="50,3 95,28 95,78 50,103 5,78 5,28"
        fill="none" stroke="#B0BEC5" strokeWidth="2.2" strokeLinejoin="round"
      />
      {/* Inner hexagon (navy fill) */}
      <polygon
        points="50,12 86,33 86,76 50,97 14,76 14,33"
        fill="#0A1628"
      />
      {/* B — vertical bar */}
      <rect x="20" y="34" width="5" height="47" rx="2" fill="#00C853" />
      {/* B — top bump */}
      <path d="M 25,34 Q 44,34 44,46 Q 44,58 25,58" fill="none" stroke="#00C853" strokeWidth="5" strokeLinecap="round" />
      {/* B — bottom bump */}
      <path d="M 25,58 Q 47,58 47,70 Q 47,81 25,81" fill="none" stroke="#00C853" strokeWidth="5" strokeLinecap="round" />
      {/* X — two diagonal lines */}
      <line x1="55" y1="34" x2="79" y2="81" stroke="#B0BEC5" strokeWidth="5" strokeLinecap="round" />
      <line x1="79" y1="34" x2="55" y2="81" stroke="#B0BEC5" strokeWidth="5" strokeLinecap="round" />
      {/* X — corner dots */}
      <circle cx="55" cy="34" r="3.5" fill="#00E676" />
      <circle cx="79" cy="34" r="3.5" fill="#00E676" />
      <circle cx="67" cy="57.5" r="3.5" fill="#00E676" />
      <circle cx="55" cy="81" r="3.5" fill="#00E676" />
      <circle cx="79" cy="81" r="3.5" fill="#00E676" />
      {/* Circuit connectors */}
      <line x1="55" y1="34" x2="46" y2="23" stroke="#00E676" strokeWidth="1.2" />
      <line x1="46" y1="23" x2="46" y2="12" stroke="#00E676" strokeWidth="1.2" />
      <circle cx="46" cy="12" r="2.5" fill="none" stroke="#00E676" strokeWidth="1.2" />
      <line x1="79" y1="34" x2="86" y2="22" stroke="#00E676" strokeWidth="1.2" />
      <circle cx="89" cy="16" r="2.5" fill="none" stroke="#00E676" strokeWidth="1.2" />
      <line x1="86" y1="22" x2="89" y2="16" stroke="#00E676" strokeWidth="1.2" />
      <line x1="79" y1="81" x2="86" y2="92" stroke="#00E676" strokeWidth="1.2" />
      <circle cx="86" cy="98" r="2.5" fill="none" stroke="#00E676" strokeWidth="1.2" />
      <line x1="86" y1="92" x2="86" y2="98" stroke="#00E676" strokeWidth="1.2" />
      <line x1="55" y1="81" x2="46" y2="92" stroke="#00E676" strokeWidth="1.2" />
      <line x1="46" y1="92" x2="40" y2="100" stroke="#00E676" strokeWidth="1.2" />
      <circle cx="40" cy="104" r="2.5" fill="none" stroke="#00E676" strokeWidth="1.2" />
    </svg>
  )

  if (variant === 'icon') return <div className={className}>{icon}</div>

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {icon}
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className="font-rajdhani font-black tracking-[0.15em] text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(90deg, #00E676 0%, #CFD8DC 50%, #78909C 100%)',
              fontSize: size * 0.5,
            }}
          >
            BEXALTEC
          </span>
          <span
            className="font-mono tracking-[0.2em] text-slate-400 uppercase"
            style={{ fontSize: size * 0.17 }}
          >
            Soluções Informáticas
          </span>
        </div>
      )}
    </div>
  )
}

// Small text-only badge version for tight spaces
export function BexaltecBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-7 h-7 border border-green2 rounded-md flex items-center justify-center">
        <span className="font-rajdhani font-black text-[11px] text-green tracking-widest">BX</span>
      </div>
      <span className="font-rajdhani font-bold text-lg tracking-[0.18em] text-transparent bg-clip-text"
        style={{ backgroundImage: 'linear-gradient(90deg, #00E676, #CFD8DC)' }}>
        BEXALTEC
      </span>
    </div>
  )
}
