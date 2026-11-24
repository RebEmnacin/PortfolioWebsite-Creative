// Shared "pop" settings, used by the rectangular panels (pop() in App.tsx)
// AND by the step-shaped panels (ShapePanel), so everything pops the same way.

export const INK = '#111111'
export const YELLOW = '#ffcb05'

// How far the black shadow sits from the panel (px). The yellow one sits
// the same distance again behind it, so at rest the total reach is 8px.
export const REST_OFFSET = 4
export const HOVER_OFFSET = 10

// Same strings as before: black shadow first, yellow shadow behind it
const shadow = (d: number) => `${d}px ${d}px 0 ${INK}, ${d * 2}px ${d * 2}px 0 ${YELLOW}`
export const REST_SHADOW = shadow(REST_OFFSET)
export const HOVER_SHADOW = shadow(HOVER_OFFSET)

// A soft, unhurried spring: about 0.6s to arrive, with a small bounce at the end.
// Raise `duration` for slower, lower it for snappier; raise `bounce` (0 to 1) for more wobble.
export const SPRING = { type: 'spring', duration: 0.6, bounce: 0.3 } as const
