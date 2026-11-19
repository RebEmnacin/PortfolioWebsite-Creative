import type { ReactNode } from 'react'
import { MotionConfig, motion, type Variants } from 'motion/react'
import { BearIcon, FolderIcon, ImageIcon, PlaneIcon, SparkleIcon, UserIcon } from './icons'
import { WavePattern } from './WavePattern'

// The shared "marker frame" look: thick black border + white fill + hard black/yellow shadow.
// Corners are softly rounded but small, so every box still reads as a sharp square.
const frame =
  'rounded-[10px] border-[6px] border-[#111111] bg-white shadow-[4px_4px_0_#111111,8px_8px_0_#ffcb05]'

// Entrance animation: the page staggers its children in, each one springing up
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
}

// A reusable tile (Files, Gallery, Contacts, Profile) that grows to fill its grid cell
function Tile({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <motion.div variants={item} className="flex min-h-0 flex-col gap-4">
      <motion.div
        whileHover={{ rotate: -2, scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        className={`${frame} flex min-h-32 flex-1 cursor-pointer items-center justify-center`}
      >
        <div className="aspect-square w-1/3 max-w-32 min-w-14">{icon}</div>
      </motion.div>
      <p className="text-center text-base font-bold uppercase tracking-widest text-[#111111] md:text-lg">
        {label}
      </p>
    </motion.div>
  )
}

function App() {
  return (
    // reducedMotion="user" turns off movement for people who ask their OS for less motion
    <MotionConfig reducedMotion="user">
      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        className="relative isolate flex min-h-screen flex-col gap-10 overflow-hidden bg-white p-6 md:p-10 lg:flex-row lg:gap-16"
      >
        {/* BACKGROUND: thick drifting wiggle wave */}
        <WavePattern />

        {/* LEFT SIDE: the launcher grid, stretched to the page edges */}
        <section className="relative z-10 grid flex-1 grid-cols-3 grid-rows-[1.1fr_1fr] gap-x-8 gap-y-12 lg:gap-x-12">
          {/* HOME: wide panel with sparkles + tilted mascot panel overlapping */}
          <motion.div
            variants={item}
            className={`${frame} relative col-span-2 flex min-h-44 items-center justify-around pl-6 pr-32 md:pr-44`}
          >
            <SparkleIcon className="h-12 w-12 md:h-16 md:w-16" />
            <SparkleIcon className="h-12 w-12 md:h-16 md:w-16" outline />
            <SparkleIcon className="h-12 w-12 md:h-16 md:w-16" />
            {/* the mascot panel floats up and down */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
              className={`${frame} absolute -right-6 -top-8 z-10 flex h-32 w-32 rotate-6 items-center justify-center md:h-40 md:w-40`}
            >
              <BearIcon className="h-20 w-20 md:h-24 md:w-24" />
            </motion.div>
          </motion.div>

          <Tile icon={<PlaneIcon className="h-full w-full" />} label="Contacts" />
          <Tile icon={<FolderIcon className="h-full w-full" />} label="Files" />
          <Tile icon={<ImageIcon className="h-full w-full" />} label="Gallery" />
          <Tile icon={<UserIcon className="h-full w-full" />} label="Profile" />
        </section>

        {/* RIGHT SIDE: tall loading panel, full height */}
        <motion.aside
          variants={item}
          className={`${frame} relative z-10 flex h-80 w-full shrink-0 flex-col items-center justify-between p-8 lg:h-auto lg:w-72`}
        >
          <div className="flex h-44 w-44 items-center justify-center rounded-full border-[6px] border-[#111111] bg-white">
            <BearIcon className="h-28 w-28" />
          </div>
          <div className="w-full">
            <div className="h-6 overflow-hidden rounded-full border-4 border-[#111111] bg-white">
              <div className="h-full w-2/3 bg-[#ffcb05]" />
            </div>
            <p className="mt-2 text-center font-bold uppercase tracking-widest text-[#111111]">
              Loading
            </p>
          </div>
        </motion.aside>
      </motion.main>
    </MotionConfig>
  )
}

export default App