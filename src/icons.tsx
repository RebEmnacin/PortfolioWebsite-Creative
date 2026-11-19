// Hand-drawn-feeling SVG icons in the same "marker" style as the rest of the site:
// thick plum outlines, round joins, flat fills from the pink/cream palette.

const PLUM = '#3b1d4a'
const PINK = '#d9a7c7'
const MAUVE = '#b57ba3'
const CREAM = '#f5e6c8'

type IconProps = { className?: string }

const stroke = {
  stroke: PLUM,
  strokeWidth: 3,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

// Contacts: paper plane
export function PlaneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M44 5 4 21l15 6 6 15Z" fill={PINK} {...stroke} />
      <path d="M19 27 44 5" {...stroke} />
      <path d="m19 27 2 11" {...stroke} />
    </svg>
  )
}

// Files: folder
export function FolderIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 13a3 3 0 0 1 3-3h11l5 6h16a3 3 0 0 1 3 3v21a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3Z"
        fill={PINK}
        {...stroke}
      />
      <path d="M5 21h38" {...stroke} />
    </svg>
  )
}

// Gallery: framed picture with sun and mountains
export function ImageIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="8" width="38" height="32" rx="4" fill={CREAM} {...stroke} />
      <circle cx="16" cy="19" r="3.5" fill={PINK} {...stroke} />
      <path d="m5 35 12-11 8 7 6-5 12 10" fill={MAUVE} {...stroke} />
    </svg>
  )
}

// Profile: head and shoulders
export function UserIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="24" cy="16" r="9" fill={PINK} {...stroke} />
      <path d="M7 43c0-10 7-16 17-16s17 6 17 16Z" fill={PINK} {...stroke} />
    </svg>
  )
}

// Mascot: bear face
export function BearIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* ears */}
      <circle cx="14" cy="16" r="9" fill={MAUVE} {...stroke} />
      <circle cx="50" cy="16" r="9" fill={MAUVE} {...stroke} />
      <circle cx="14" cy="16" r="3.5" fill={PINK} />
      <circle cx="50" cy="16" r="3.5" fill={PINK} />
      {/* head */}
      <ellipse cx="32" cy="36" rx="22" ry="20" fill={MAUVE} {...stroke} />
      {/* snout */}
      <ellipse cx="32" cy="44" rx="10" ry="7.5" fill={CREAM} {...stroke} />
      {/* eyes */}
      <circle cx="22" cy="32" r="3" fill={PLUM} />
      <circle cx="42" cy="32" r="3" fill={PLUM} />
      {/* nose + mouth */}
      <ellipse cx="32" cy="41" rx="3.5" ry="2.5" fill={PLUM} />
      <path d="M32 43.5v3m-4 1.5q4 3 8 0" {...stroke} strokeWidth={2.5} />
    </svg>
  )
}

// Decorative four-point sparkle; `outline` gives the hollow variant
export function SparkleIcon({ className, outline = false }: IconProps & { outline?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2c.8 6 4 9.2 10 10-6 .8-9.2 4-10 10-.8-6-4-9.2-10-10 6-.8 9.2-4 10-10Z"
        fill={outline ? 'none' : PLUM}
        {...stroke}
        strokeWidth={outline ? 2 : 1.5}
      />
    </svg>
  )
}
