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
      {/* Classic comedy club ball mic head */}
      <circle
        cx="24"
        cy="12"
        r="9"
        stroke="url(#micGradient)"
        strokeWidth="2.5"
        fill="none"
      />
      
      {/* Mic grille pattern - horizontal lines */}
      <path
        d="M17.5 9.5h13M16.5 12h15M17.5 14.5h13"
        stroke="url(#micGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      
      {/* Mic collar/connector */}
      <rect
        x="20"
        y="20"
        width="8"
        height="4"
        rx="1"
        fill="url(#micGradient)"
      />
      
      {/* Tall stand pole */}
      <line
        x1="24"
        y1="24"
        x2="24"
        y2="40"
        stroke="url(#micGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      
      {/* Stand base - classic tripod hint */}
      <path
        d="M16 44L24 40L32 44"
        stroke="url(#micGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Small base feet */}
      <circle cx="16" cy="44" r="1.5" fill="url(#micGradient)" />
      <circle cx="32" cy="44" r="1.5" fill="url(#micGradient)" />
      
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


