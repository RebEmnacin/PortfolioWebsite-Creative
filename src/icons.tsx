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

// ---- Profile: the "hi" sequence --------------------------------------------
// On hover the person says hi, in this order (times in seconds from the hover):
//   0.0  an arm swings up and WAVES (about 1.3s), the face fades in with dot eyes
//   0.5  a chat bubble saying "hi" pops in, and the dot eyes become ^ ^
// Each part has its own `delay` / `duration`, so they overlap like a little scene.
const HI_AT = 0.5 // seconds until the bubble pops and the eyes change (try 0.3 for snappier)
const WAVE = [null, -14, 14, -14, 14, 0] // arm angles in degrees; null = "start from where you are"

// Mouth: a small smile first, a bigger grin once the bubble lands
const SMILE_SMALL = 'M21.5 20.5Q24 22 26.5 20.5'
const SMILE_BIG = 'M20.5 20Q24 24.5 27.5 20'

// Profile: head and shoulders that wave hello.
export function UserIcon({ className, active = false }: IconProps) {
  return (
    <AnimatedSvg className={className} active={active}>
      {/* the waving arm, behind the shoulders. Outer group: pops in. Inner group: waves. */}
      <motion.g
        variants={{
          off: { opacity: 0, y: 6, scale: 0.7 },
          on: { opacity: 1, y: 0, scale: 1 },
        }}
        transition={ICON_SPRING}
        style={{ originX: 0.5, originY: 1 }}
      >
        <motion.g
          variants={{
            off: { rotate: 35 },
            on: { rotate: WAVE, transition: { duration: 1.3, ease: 'easeInOut' } },
          }}
          transition={ICON_SPRING}
          style={{ originX: 0.5, originY: 1 }} // pivot at the bottom of the arm
        >
          <rect x="4" y="22" width="8" height="20" rx="4" fill={YELLOW} {...stroke} />
          <circle cx="8" cy="20" r="5" fill={YELLOW} {...stroke} />
        </motion.g>
      </motion.g>

      {/* the person (same as the resting icon) */}
      <circle cx="24" cy="16" r="9" fill={YELLOW} {...stroke} />
      <path d="M7 43c0-10 7-16 17-16s17 6 17 16Z" fill={YELLOW} {...stroke} />

      {/* face, part 1: dot eyes while waving, then they fade out as the bubble lands */}
      <motion.g
        variants={{
          off: { opacity: 0, transition: { duration: 0.1 } },
          on: { opacity: [0, 1, 1, 0], transition: { duration: HI_AT + 0.05, times: [0, 0.12, 0.85, 1] } },
        }}
      >
        <circle cx="20" cy="15.5" r="1.6" fill={INK} />
        <circle cx="28" cy="15.5" r="1.6" fill={INK} />
      </motion.g>
      {/* face, part 2: happy ^ ^ eyes, appear when the bubble pops */}
      <motion.path
        d="M17.8 17 20 14.4 22.2 17M25.8 17 28 14.4 30.2 17"
        {...stroke}
        strokeWidth={2.4}
        variants={{
          off: { opacity: 0, transition: { duration: 0.1 } },
          on: { opacity: 1, transition: { delay: HI_AT, duration: 0.1 } },
        }}
      />
      {/* face, part 3: mouth, small smile -> big grin */}
      <motion.path
        {...stroke}
        strokeWidth={2.2}
        variants={{
          off: { opacity: 0, d: SMILE_SMALL },
          on: {
            opacity: 1,
            d: SMILE_BIG,
            transition: {
              opacity: { duration: 0.15 },
              d: { type: 'spring', stiffness: 300, damping: 14, delay: HI_AT },
            },
          },
        }}
        transition={ICON_SPRING}
      />

      {/* the chat bubble saying "hi", pops from its tail (bottom-left) */}
      <motion.g
        variants={{
          off: { opacity: 0, scale: 0.2, transition: { duration: 0.12 } },
          on: {
            opacity: 1,
            scale: 1,
            transition: { type: 'spring', stiffness: 420, damping: 15, delay: HI_AT },
          },
        }}
        style={{ originX: 0.17, originY: 1 }}
      >
        <path
          d="M33.5 0H42.5A4.5 4.5 0 0 1 47 4.5V7.5A4.5 4.5 0 0 1 42.5 12H38L32 17.5 33 12H33.5A4.5 4.5 0 0 1 29 7.5V4.5A4.5 4.5 0 0 1 33.5 0Z"
          fill={WHITE}
          {...stroke}
        />
        <text
          x="38"
          y="6.3"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="8"
          fontWeight="800"
          fill={INK}
          style={{ fontFamily: 'inherit' }}
        >
          hi
        </text>
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
