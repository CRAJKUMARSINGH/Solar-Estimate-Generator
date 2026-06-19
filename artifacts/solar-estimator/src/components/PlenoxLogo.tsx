interface Props {
  size?: number;
  variant?: "color" | "white";
  className?: string;
}

export function PlenoxLogo({ size = 44, variant = "color", className = "" }: Props) {
  const primary = variant === "white" ? "#ffffff" : "#F97316";
  const panel   = variant === "white" ? "#ffffff" : "#ffffff";
  const ray     = variant === "white" ? "#ffffff" : "#FB923C";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="PLENOX Enterprises LLP logo"
    >
      {/* ── 8 Sun Rays ─────────────────────────────────────── */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <rect
          key={i}
          x="20.5"
          y="2"
          width="3"
          height="8"
          rx="1.5"
          fill={ray}
          opacity={deg % 90 === 0 ? "1" : "0.75"}
          transform={`rotate(${deg} 22 22)`}
        />
      ))}

      {/* ── Main circle ─────────────────────────────────────── */}
      <circle cx="22" cy="22" r="12" fill={primary} />

      {/* ── Solar-panel grid (clipped inside circle) ────────── */}
      <clipPath id={`clip-${variant}`}>
        <circle cx="22" cy="22" r="12" />
      </clipPath>
      <g clipPath={`url(#clip-${variant})`} stroke={panel} strokeWidth="1.4" opacity="0.9">
        {/* Horizontal mid-line */}
        <line x1="10" y1="22" x2="34" y2="22" />
        {/* Vertical trisectors */}
        <line x1="18" y1="11" x2="18" y2="33" />
        <line x1="26" y1="11" x2="26" y2="33" />
      </g>

      {/* ── Outer ring on circle ─────────────────────────────── */}
      <circle cx="22" cy="22" r="12" stroke={panel} strokeWidth="1.2" opacity="0.4" fill="none" />
    </svg>
  );
}
