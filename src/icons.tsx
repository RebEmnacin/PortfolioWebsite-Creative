// Hand-drawn-feeling SVG icons in the same "marker" style as the rest of the site:
// thick near-black outlines, round joins, flat white and yellow fills.
//
// The four tile icons (plane, folder, image, user) are animated: they sit still
// until `active` becomes true (the Tile sets it while the cursor is on it), then
// they "open up". Every moving part is a `motion.*` element with two states:
//   off = resting pose, on = hovered pose. Motion springs between them.

import type { ReactNode } from 'react'
import { motion } from 'motion/react'

const INK = '#111111'
const YELLOW = '#ffcb05'
const YELLOW_LIGHT = '#ffe066'
const WHITE = '#ffffff'
const PAPER = '#dde7f6'

// How the icons move between off and on (a little bouncy, like the panels)
const ICON_SPRING = { type: 'spring', stiffness: 220, damping: 16 } as const

type IconProps = { className?: string; active?: boolean }

const stroke = {
  stroke: INK,
  strokeWidth: 3,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

// The <svg> every animated icon shares. `animate` picks the state, and every
// motion.* child inside with `variants` follows it automatically.
function AnimatedSvg({
  className,
  active,
  children,
}: {
  className?: string
  active: boolean
  children: ReactNode
}) {
  return (
    <motion.svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
      initial={false}
      animate={active ? 'on' : 'off'}
      style={{ overflow: 'visible' }} // moving parts may leave the 48x48 box
    >
      {children}
    </motion.svg>
  )
}

// ---- Paper plane geometry -------------------------------------------------
// The plane is two wings that share one crease running from the tip T to the
// point P. "Opening" swings each wing away from the crease around T, so we
// rotate their corner points ourselves and let Motion morph the outlines.
const TIP: [number, number] = [44, 5]
const LEFT: [number, number] = [4, 21] //  far corner of the upper wing
const CREASE_END: [number, number] = [19, 27] // where the crease ends (P)
const BOTTOM: [number, number] = [25, 42] //  far corner of the lower wing
const FOLD_END: [number, number] = [21, 38] // little fold line on the lower wing
const OPEN = 10 // degrees each wing swings (try 6 for subtle, 16 for dramatic)

// Rotates a point around the tip. Positive degrees = clockwise on screen.
function turn([x, y]: [number, number], deg: number) {
  const a = (deg * Math.PI) / 180
  const dx = x - TIP[0]
  const dy = y - TIP[1]
  const rx = TIP[0] + dx * Math.cos(a) - dy * Math.sin(a)
  const ry = TIP[1] + dx * Math.sin(a) + dy * Math.cos(a)
  return `${rx.toFixed(2)} ${ry.toFixed(2)}`
}
// Path strings for a given opening angle (0 = closed plane)
const upperWing = (deg: number) =>
  `M44 5 L${turn(LEFT, deg)} L${turn(CREASE_END, deg)} Z`
const lowerWing = (deg: number) =>
  `M44 5 L${turn(CREASE_END, -deg)} L${turn(BOTTOM, -deg)} Z`
const foldLine = (deg: number) =>
  `M${turn(CREASE_END, -deg)} L${turn(FOLD_END, -deg)}`
// The white gap between the two creases (a flat line while the plane is closed)
const inside = (deg: number) =>
  `M44 5 L${turn(CREASE_END, deg)} L${turn(CREASE_END, -deg)} Z`

// Contacts: paper plane. On hover the plane UNFOLDS: the two wings swing apart
// around the tip and show the white inside of the paper.
export function PlaneIcon({ className, active = false }: IconProps) {
  return (
    <AnimatedSvg className={className} active={active}>
      {/* the white inside of the paper, revealed as the wings swing apart */}
      <motion.path
        fill={WHITE}
        {...stroke}
        variants={{ off: { d: inside(0) }, on: { d: inside(OPEN) } }}
        transition={ICON_SPRING}
      />
      {/* upper wing swings UP, lower wing swings DOWN */}
      <motion.path
        fill={YELLOW}
        {...stroke}
        variants={{ off: { d: upperWing(0) }, on: { d: upperWing(OPEN) } }}
        transition={ICON_SPRING}
      />
      <motion.path
        fill={YELLOW}
        {...stroke}
        variants={{ off: { d: lowerWing(0) }, on: { d: lowerWing(OPEN) } }}
        transition={ICON_SPRING}
      />
      <motion.path
        {...stroke}
        variants={{ off: { d: foldLine(0) }, on: { d: foldLine(OPEN) } }}
        transition={ICON_SPRING}
      />
    </AnimatedSvg>
  )
}

// Files: folder. On hover the front flap drops open and two papers rise out.
export function FolderIcon({ className, active = false }: IconProps) {
  return (
    <AnimatedSvg className={className} active={active}>
      {/* back of the folder, with its tab */}
      <path
        d="M5 13a3 3 0 0 1 3-3h11l5 6h16a3 3 0 0 1 3 3v21a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3Z"
        fill={YELLOW}
        {...stroke}
      />
      {/* back paper (pale blue): rises highest, tilts right */}
      <motion.path
        d="M13 36V20a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v16Z"
        fill={PAPER}
        {...stroke}
        variants={{ off: { y: 0, rotate: 0 }, on: { y: -12, rotate: 7 } }}
        transition={ICON_SPRING}
        style={{ originX: 0.5, originY: 1 }}
      />
      {/* front paper (white): rises a bit less, tilts left */}
      <motion.path
        d="M11 36V19a2 2 0 0 1 2-2h22a2 2 0 0 1 2 2v17Z"
        fill={WHITE}
        {...stroke}
        variants={{ off: { y: 0, rotate: 0 }, on: { y: -7, rotate: -4 } }}
        transition={ICON_SPRING}
        style={{ originX: 0.5, originY: 1 }}
      />
      {/* front flap: drops lower and widens, like the folder opening.
          (We reshape the outline instead of scaling it, so the border stays the same thickness) */}
      <motion.path
        fill={YELLOW_LIGHT}
        {...stroke}
        variants={{
          off: { d: 'M5 24a3 3 0 0 1 3-3h32a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3Z' },
          on: { d: 'M3 29a3 3 0 0 1 3-3h36a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3Z' },
        }}
        transition={ICON_SPRING}
      />
    </AnimatedSvg>
  )
}

// Gallery: framed picture. On hover two more pictures SPREAD out behind it like
// a hand of cards. They pivot from the bottom-centre, so where their top edges
// cross, the crossing stays hidden behind the front picture.
export function ImageIcon({ className, active = false }: IconProps) {
  return (
    <AnimatedSvg className={className} active={active}>
      {/* back picture, swings LEFT (hidden exactly behind the front one until hover) */}
      <motion.rect
        x="5"
        y="10"
        width="38"
        height="30"
        rx="4"
        fill={YELLOW}
        {...stroke}
        variants={{ off: { rotate: 0 }, on: { rotate: -12 } }}
        transition={ICON_SPRING}
        style={{ originX: 0.5, originY: 1 }}
      />
      {/* back picture, swings RIGHT */}
      <motion.rect
        x="5"
        y="10"
        width="38"
        height="30"
        rx="4"
        fill={PAPER}
        {...stroke}
        variants={{ off: { rotate: 0 }, on: { rotate: 12 } }}
        transition={ICON_SPRING}
        style={{ originX: 0.5, originY: 1 }}
      />
      {/* front picture: sun and mountains */}
      <motion.g
        variants={{ off: { y: 0 }, on: { y: -1.5 } }}
        transition={ICON_SPRING}
      >
        <rect x="5" y="8" width="38" height="32" rx="4" fill={WHITE} {...stroke} />
        <circle cx="16" cy="19" r="3.5" fill={YELLOW} {...stroke} />
        <path d="m5 35 12-11 8 7 6-5 12 10" fill={INK} {...stroke} />
      </motion.g>
    </AnimatedSvg>
  )
}

// ---- Person geometry ------------------------------------------------------
// On hover the person shrinks to fit INSIDE the magnifying glass. We work out
// the small version of each shape here, so the outline stays 3 units thick
// (scaling a whole group would make the outline thinner too).
const SHRINK = 0.56 //  how small the person gets inside the lens
const shrinkX = (x: number) => (24 + (x - 24) * SHRINK - 1).toFixed(2)
const shrinkY = (y: number) => (25 + (y - 25) * SHRINK - 3).toFixed(2)
const k = (n: number) => (n * SHRINK).toFixed(2)
const HEAD_OFF = { cx: 24, cy: 16, r: 9 }
const HEAD_ON = { cx: shrinkX(24), cy: shrinkY(16), r: k(9) }
// shoulders: a rounded hump starting at the bottom-left corner (7, 43)
const SHOULDERS_OFF = 'M7 43c0-10 7-16 17-16s17 6 17 16Z'
const SHOULDERS_ON = `M${shrinkX(7)} ${shrinkY(43)}c0-${k(10)} ${k(7)}-${k(16)} ${k(17)}-${k(16)}s${k(17)} ${k(6)} ${k(17)} ${k(16)}Z`

// Profile: head and shoulders. On hover a MAGNIFYING GLASS grows around the
// person while the person shrinks to sit inside the lens.
export function UserIcon({ className, active = false }: IconProps) {
  return (
    <AnimatedSvg className={className} active={active}>
      {/* the person: morphs from big (resting) to small (inside the lens) */}
      <motion.circle
        fill={YELLOW}
        {...stroke}
        variants={{ off: HEAD_OFF, on: HEAD_ON }}
        transition={ICON_SPRING}
      />
      <motion.path
        fill={YELLOW}
        {...stroke}
        variants={{ off: { d: SHOULDERS_OFF }, on: { d: SHOULDERS_ON } }}
        transition={ICON_SPRING}
      />
      {/* the lens ring + handle: fade in while growing from the bottom-right */}
      <motion.g
        variants={{
          off: { opacity: 0, scale: 0.5, x: 6, y: 6 },
          on: { opacity: 1, scale: 1, x: 0, y: 0 },
        }}
        transition={ICON_SPRING}
        style={{ originX: 0.4, originY: 0.4 }}
      >
        <circle cx="23" cy="22" r="17" fill="none" {...stroke} />
        <path d="M36 35 44 43" {...stroke} strokeWidth={6} />
      </motion.g>
    </AnimatedSvg>
  )
}

// Mascot: bear face
export function BearIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* ears */}
      <circle cx="14" cy="16" r="9" fill={YELLOW} {...stroke} />
      <circle cx="50" cy="16" r="9" fill={YELLOW} {...stroke} />
      <circle cx="14" cy="16" r="3.5" fill={WHITE} />
      <circle cx="50" cy="16" r="3.5" fill={WHITE} />
      {/* head */}
      <ellipse cx="32" cy="36" rx="22" ry="20" fill={YELLOW} {...stroke} />
      {/* snout */}
      <ellipse cx="32" cy="44" rx="10" ry="7.5" fill={WHITE} {...stroke} />
      {/* eyes */}
      <circle cx="22" cy="32" r="3" fill={INK} />
      <circle cx="42" cy="32" r="3" fill={INK} />
      {/* nose + mouth */}
      <ellipse cx="32" cy="41" rx="3.5" ry="2.5" fill={INK} />
      <path d="M32 43.5v3m-4 1.5q4 3 8 0" {...stroke} strokeWidth={2.5} />
    </svg>
  )
}

// Decorative four-point sparkle; `outline` gives the hollow variant
export function SparkleIcon({
  className,
  outline = false,
}: {
  className?: string
  outline?: boolean
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2c.8 6 4 9.2 10 10-6 .8-9.2 4-10 10-.8-6-4-9.2-10-10 6-.8 9.2-4 10-10Z"
        fill={outline ? 'none' : INK}
        {...stroke}
        strokeWidth={outline ? 2 : 1.5}
      />
    </svg>
  )
}
