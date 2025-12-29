interface LogoProps {
  className?: string
  size?: number
}

export default function Logo({ className = '', size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Mic head - rounded rectangle with gradient stroke */}
      <rect
        x="14"
        y="4"
        width="20"
        height="26"
        rx="10"
        stroke="url(#micGradient)"
        strokeWidth="3"
        fill="none"
      />
      
      {/* Mic grille lines */}
      <line x1="18" y1="12" x2="30" y2="12" stroke="url(#micGradient)" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="17" x2="30" y2="17" stroke="url(#micGradient)" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="22" x2="30" y2="22" stroke="url(#micGradient)" strokeWidth="2" strokeLinecap="round" />
      
      {/* Mic stand curve */}
      <path
        d="M12 30C12 36.627 17.373 42 24 42C30.627 42 36 36.627 36 30"
        stroke="url(#micGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Mic stand vertical */}
      <line x1="24" y1="42" x2="24" y2="46" stroke="url(#micGradient)" strokeWidth="3" strokeLinecap="round" />
      
      {/* Mic stand base */}
      <line x1="18" y1="46" x2="30" y2="46" stroke="url(#micGradient)" strokeWidth="3" strokeLinecap="round" />
      
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="micGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7B2FF7" />
          <stop offset="50%" stopColor="#F72585" />
          <stop offset="100%" stopColor="#FF6B6B" />
        </linearGradient>
      </defs>
    </svg>
  )
}

