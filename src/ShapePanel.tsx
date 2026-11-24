import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import { HOVER_OFFSET, INK, REST_OFFSET, SPRING, YELLOW } from './pop'
import type { Point, ShapeFn } from './shapes'

// Same look as `frame` in App.tsx: 6px black outline, small rounded corners
const STROKE = 6
const RADIUS = 10

// Walks from `from` toward `to` by `dist` (never more than half the edge)
function pointToward(from: Point, to: Point, dist: number): Point {
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const len = Math.hypot(dx, dy)
  const t = Math.min(dist, len / 2) / len
  return [from[0] + dx * t, from[1] + dy * t]
}

// Turns corner points into an SVG path with softly rounded corners
function roundedPath(points: Point[], radius: number): string {
  const n = points.length
  let d = ''
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n]
    const cur = points[i]
    const next = points[(i + 1) % n]
    const start = pointToward(cur, prev, radius) // where the corner starts
    const end = pointToward(cur, next, radius) //   where the corner ends
    d += `${i === 0 ? 'M' : 'L'} ${start[0]} ${start[1]} `
    d += `Q ${cur[0]} ${cur[1]} ${end[0]} ${end[1]} ` // curve, pulled toward the corner
  }
  return d + 'Z'
}

// Tells us the element's real size in px, and updates whenever it changes
function useSize() {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, size] as const
}

// A layer that is hit-test invisible (the page ignores the pointer over it)
const layer = 'pointer-events-none absolute left-0 top-0 overflow-visible'

type ShapePanelProps = {
  shape: ShapeFn // homeShape or loadingShape (from shapes.ts)
  children?: ReactNode // your content, placed with `absolute` + percentages
  className?: string // size and placement: "col-span-2", "lg:w-72", "z-10" ...
  variants?: Variants // pass your `item` so it joins the staggered entrance
  popScale?: number // how much it grows on hover (1.035 = 3.5%)
  popLift?: number // how many px it rises on hover (negative = up)
}

export function ShapePanel({
  shape,
  children,
  className = '',
  variants,
  popScale = 1.035,
  popLift = -6,
}: ShapePanelProps) {
  const [ref, size] = useSize()
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  // Shadow distance: stretches out on hover, snaps back while pressed
  const d = hovered && !pressed ? HOVER_OFFSET : REST_OFFSET

  let outline = ''
  if (size) {
    // Shrink the shape by half the stroke so the outer edge matches a normal CSS border
    const half = STROKE / 2
    const points = shape(size.w - STROKE, size.h - STROKE).map(
      ([x, y]): Point => [x + half, y + half],
    )
    outline = roundedPath(points, RADIUS)
  }

  return (
    <motion.div
      ref={ref}
      variants={variants}
      whileHover={{ scale: popScale, y: popLift }}
      whileTap={{ scale: popScale - 0.1, y: 0 }}
      transition={SPRING}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onTapStart={() => setPressed(true)}
      onTap={() => setPressed(false)}
      onTapCancel={() => setPressed(false)}
      // pointer-events-none: the empty corners of the shape don't react to the mouse
      className={`pointer-events-none relative ${className}`}
    >
      {size && (
        <>
          {/* back layer: yellow shadow */}
          <motion.svg
            width={size.w}
            height={size.h}
            className={layer}
            aria-hidden="true"
            initial={false}
            animate={{ x: d * 2, y: d * 2 }}
            transition={SPRING}
          >
            <path d={outline} fill={YELLOW} stroke={YELLOW} strokeWidth={STROKE} strokeLinejoin="round" />
          </motion.svg>
          {/* middle layer: black shadow */}
          <motion.svg
            width={size.w}
            height={size.h}
            className={layer}
            aria-hidden="true"
            initial={false}
            animate={{ x: d, y: d }}
            transition={SPRING}
          >
            <path d={outline} fill={INK} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
          </motion.svg>
          {/* front layer: the panel itself. Only the painted shape reacts to the mouse. */}
          <svg width={size.w} height={size.h} className={layer} aria-hidden="true">
            <path
              d={outline}
              fill="#ffffff"
              stroke={INK}
              strokeWidth={STROKE}
              strokeLinejoin="round"
              style={{ pointerEvents: 'visiblePainted' }}
            />
          </svg>
        </>
      )}
      {children}
    </motion.div>
  )
}
