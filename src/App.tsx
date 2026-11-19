import type { ReactNode } from 'react'
import { BearIcon, FolderIcon, ImageIcon, PlaneIcon, SparkleIcon, UserIcon } from './icons'

// The shared "marker frame" look: thick plum border + cream fill + double hard shadow.
// Corners are softly rounded but small, so every box still reads as a sharp square.
const frame =
  'rounded-[10px] border-[6px] border-[#3b1d4a] bg-[#f5e6c8] shadow-[4px_4px_0_#3b1d4a,8px_8px_0_#d9a7c7]'

// A reusable tile (Files, Gallery, Contacts, Profile) that grows to fill its grid cell
function Tile({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex min-h-0 flex-col gap-4">
      <div
        className={`${frame} flex min-h-32 flex-1 cursor-pointer items-center justify-center transition-transform hover:-rotate-1 hover:scale-[1.02]`}
      >
        <div className="aspect-square w-1/3 max-w-32 min-w-14">{icon}</div>
      </div>
      <p className="text-center text-base font-bold uppercase tracking-widest text-[#3b1d4a] md:text-lg">
        {label}
      </p>
    </div>
  )
}

function App() {
  return (
    <main className="flex min-h-screen flex-col gap-10 bg-[#d9a7c7] p-6 md:p-10 lg:flex-row lg:gap-16">
      {/* LEFT SIDE: the launcher grid, stretched to the page edges */}
      <section className="grid flex-1 grid-cols-3 grid-rows-[1.1fr_1fr] gap-x-8 gap-y-12 lg:gap-x-12">
        {/* HOME: wide panel with sparkles + tilted mascot panel overlapping */}
        <div
          className={`${frame} relative col-span-2 flex min-h-44 items-center justify-around pl-6 pr-32 md:pr-44`}
        >
          <SparkleIcon className="h-12 w-12 md:h-16 md:w-16" />
          <SparkleIcon className="h-12 w-12 md:h-16 md:w-16" outline />
          <SparkleIcon className="h-12 w-12 md:h-16 md:w-16" />
          <div
            className={`${frame} absolute -right-6 -top-8 z-10 flex h-32 w-32 rotate-6 items-center justify-center md:h-40 md:w-40`}
          >
            <BearIcon className="h-20 w-20 md:h-24 md:w-24" />
          </div>
        </div>

        <Tile icon={<PlaneIcon className="h-full w-full" />} label="Contacts" />
        <Tile icon={<FolderIcon className="h-full w-full" />} label="Files" />
        <Tile icon={<ImageIcon className="h-full w-full" />} label="Gallery" />
        <Tile icon={<UserIcon className="h-full w-full" />} label="Profile" />
      </section>

      {/* RIGHT SIDE: tall loading panel, full height */}
      <aside
        className={`${frame} flex h-80 w-full shrink-0 flex-col items-center justify-between p-8 lg:h-auto lg:w-72`}
      >
        <div className="flex h-44 w-44 items-center justify-center rounded-full border-[6px] border-[#3b1d4a] bg-[#d9a7c7]">
          <BearIcon className="h-28 w-28" />
        </div>
        <div className="w-full">
          <div className="h-6 overflow-hidden rounded-full border-4 border-[#3b1d4a] bg-white">
            <div className="h-full w-2/3 bg-[#3b1d4a]" />
          </div>
          <p className="mt-2 text-center font-bold uppercase tracking-widest text-[#3b1d4a]">
            Loading
          </p>
        </div>
      </aside>
    </main>
  )
}

export default App