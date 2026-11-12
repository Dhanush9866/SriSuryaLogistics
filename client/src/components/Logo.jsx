export function SunMark({ size = 44 }) {
  const rays = Array.from({ length: 11 }, (_, i) => -75 + i * 15);
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 60 48" aria-hidden="true">
      <defs>
        <linearGradient id="sunG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd45c" />
          <stop offset="1" stopColor="#f39c12" />
        </linearGradient>
      </defs>
      {rays.map((a) => (
        <rect key={a} x="29" y="2" width="2" height="12" rx="1" fill="url(#sunG)" transform={`rotate(${a} 30 34)`} />
      ))}
      <path d="M14 34a16 16 0 0 1 32 0z" fill="url(#sunG)" />
      <path d="M3 38c16-7 38-7 54 0" stroke="#d7191f" strokeWidth="3.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ light = false }) {
  return (
    <a href="#home" className={`logo ${light ? 'logo--light' : ''}`} aria-label="Sri Surya Logistics home">
      <SunMark />
      <span className="logo__text">
        <span className="logo__name">
          <span className="logo__sri">Sri</span> <span className="logo__surya">Surya</span>
        </span>
        <span className="logo__sub">Logistics</span>
      </span>
    </a>
  );
}
