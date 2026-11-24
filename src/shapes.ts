// A shape is a function: give it the panel's real size in pixels (w, h) and it
// returns the corner points, in order, clockwise. Because it works from the real
// size, the shape stays correct when the panel stretches (your panels do).

export type Point = [number, number]
export type ShapeFn = (w: number, h: number) => Point[]

// HOME = two blocks side by side. The RIGHT block (mascot) sits HIGHER.
// The top edge and the bottom edge both step up to the right, leaning "/".
export const homeShape: ShapeFn = (w, h) => {
  const lift = h * 0.19 //       how much higher the right block sits
  const run = lift * 0.63 //     sideways distance each diagonal step travels
  const topStep = w * 0.476 //   where the top edge steps up
  const bottomStep = w * 0.624 // where the bottom edge steps up
  return [
    [0, lift], //                    top-left (the low block)
    [topStep, lift], //              top edge of the low block...
    [topStep + run, 0], //           ...steps UP
    [w, 0], //                       top-right (the high block)
    [w, h - lift], //                bottom-right of the high block
    [bottomStep, h - lift], //       bottom edge of the high block...
    [bottomStep - run, h], //        ...steps DOWN to the low block
    [0, h], //                       bottom-left
  ]
}

// LOADING = two blocks stacked. The BOTTOM block (progress bar) is shifted RIGHT.
// The right edge and the left edge both step out to the right, leaning "\".
// Keep SHIFT in sync with the 77% / 23% used for the content in App.tsx.
export const LOADING_SHIFT = 0.23
export const loadingShape: ShapeFn = (w, h) => {
  const shift = w * LOADING_SHIFT //  how far the bottom block is pushed right
  const rightStepY = h * 0.45 //      where the right edge starts stepping out
  const leftStepY = h * 0.5 //        where the left edge starts stepping out
  return [
    [0, 0], //                                top-left
    [w - shift, 0], //                        top-right (the top block is narrower)
    [w - shift, rightStepY], //               right edge goes down...
    [w, rightStepY + shift], //               ...steps OUT to the right
    [w, h], //                                bottom-right
    [shift, h], //                            bottom-left (bottom block starts further right)
    [shift, leftStepY + shift], //            left edge goes up...
    [0, leftStepY], //                        ...steps OUT to the left
  ]
}
