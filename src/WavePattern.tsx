import { motion, useReducedMotion, useTime, useTransform } from 'motion/react'

// ---- Tweak the look here -------------------------------------------------
const STROKE = 90 // how thick each wave band is
const ANGLE = -22 // tilt of the bands in degrees (negative = rising to the right)
const LOOP_SECONDS = 14 // time for one full loop of the motion
const SWAY = 70 // how far (px) the motion swings side to side along its wavy path
const SWAY_WAVES = 2 // how many side-to-side waves the path makes per loop
const COLOR = '#ffcb05'
// true  = hold still for visitors whose system asks for reduced motion (accessible default)
// false = always animate, even when the system asks for reduced motion
const RESPECT_REDUCED_MOTION = false
// --------------------------------------------------------------------------

// One repeat of the pattern. The wave's period equals TILE_W, so after the layer
// has travelled exactly TILE_W along the bands' direction it looks identical to
// where it started, which is what makes the loop seamless.
const TILE_W = 360
const TILE_H = 360

const rad = (ANGLE * Math.PI) / 180
// Unit vector along the bands, and the one perpendicular to it
const along = { x: Math.cos(rad), y: Math.sin(rad) }
const across = { x: -Math.sin(rad), y: Math.cos(rad) }

// Where the layer sits at time `ms`: it travels forward along the bands while
// swinging across them in a sine wave, so its path is itself a wave. Both parts
// finish a whole number of cycles per loop, so the motion repeats without a jump.
function offsetAt(ms: number) {
  const p = (ms / 1000 / LOOP_SECONDS) % 1
  const forward = -TILE_W * p
  const sway = SWAY * Math.sin(p * Math.PI * 2 * SWAY_WAVES)
  return {
    x: forward * along.x + sway * across.x,
    y: forward * along.y + sway * across.y,
  }
}

// Big thick yellow wiggle-wave bands flowing diagonally across the page.
// Place it as the first child of a `relative isolate overflow-hidden` container.
export function WavePattern() {
  const reduceMotion = useReducedMotion() && RESPECT_REDUCED_MOTION
  const time = useTime()
  const x = useTransform(time, (t) => offsetAt(t).x)
  const y = useTransform(time, (t) => offsetAt(t).y)

  return (
    <motion.div
      aria-hidden="true"
      // Oversized on every side so the motion never reveals an empty edge
      className="pointer-events-none absolute -inset-[400px] -z-10"
      // Still waves when RESPECT_REDUCED_MOTION is on and the system asks for less motion
      style={reduceMotion ? undefined : { x, y }}
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="wiggle-wave"
            width={TILE_W}
            height={TILE_H}
            patternUnits="userSpaceOnUse"
            patternTransform={`rotate(${ANGLE})`}
          >
            {/* Drawn past both tile edges so clipping never cuts the stroke at the seams */}
            <path
              d="M-360 180 C-300 90 -240 90 -180 180 S-60 270 0 180 C60 90 120 90 180 180 S300 270 360 180 C420 90 480 90 540 180 S660 270 720 180"
              fill="none"
              stroke={COLOR}
              strokeWidth={STROKE}
              strokeLinecap="round"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wiggle-wave)" />
      </svg>
    </motion.div>
  )
}