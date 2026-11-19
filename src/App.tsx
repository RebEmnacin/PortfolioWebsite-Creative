import type { ReactNode } from 'react'
import { BearIcon, FolderIcon, ImageIcon, PlaneIcon, SparkleIcon, UserIcon } from './icons'

// The shared "marker frame" look: thick plum border + cream fill + double hard shadow
const frame =
  'border-[6px] border-[#3b1d4a] bg-[#f5e6c8] shadow-[4px_4px_0_#3b1d4a,8px_8px_0_#d9a7c7]'

// A reusable square tile (Files, Gallery, Contacts, Profile)
function Tile({ icon, label, wobble }: { icon: ReactNode; label: string; wobble: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${frame} ${wobble} w-32 h-32 flex items-center justify-center cursor-pointer transition-transform hover:-rotate-3 hover:scale-105`}
      >
        {icon}
      </div>
      <p className="font-bold uppercase tracking-widest text-[#3b1d4a]">{label}</p>
    </div>
  )
}

function App() {
  return (
    <main className="min-h-screen bg-[#d9a7c7] flex items-center justify-center p-8">
  <div className="w-full max-w-6xl p-12 flex items-center justify-center gap-14 border-[6px] border-[#3b1d4a] bg-[#f0d9e6] shadow-[6px_6px_0_#3b1d4a,12px_12px_0_#b57ba3] rounded-[24px_40px_28px_36px/36px_24px_40px_28px]">
      {/* LEFT SIDE: the launcher grid */}
      <section className="grid grid-cols-3 gap-x-10 gap-y-12">
        {/* HOME: wide panel with sparkles + tilted mascot panel overlapping */}
        <div
          className={`${frame} relative col-span-2 h-44 flex items-center justify-around rounded-[14px_34px_16px_28px/26px_12px_32px_16px]`}
        >
          <SparkleIcon className="w-10 h-10" />
          <SparkleIcon className="w-10 h-10" outline />
          <SparkleIcon className="w-10 h-10" />
          <div
            className={`${frame} absolute -top-8 -right-6 z-10 w-28 h-28 rotate-6 flex items-center justify-center rounded-[24px_10px_28px_12px/12px_26px_10px_24px]`}
          >
            <BearIcon className="w-16 h-16" />
          </div>
        </div>

        <Tile
          icon={<PlaneIcon className="w-14 h-14" />}
          label="Contacts"
          wobble="rounded-[10px_30px_14px_26px/24px_12px_28px_10px]"
        />
        <Tile
          icon={<FolderIcon className="w-14 h-14" />}
          label="Files"
          wobble="rounded-[26px_12px_30px_10px/10px_28px_12px_24px]"
        />
        <Tile
          icon={<ImageIcon className="w-14 h-14" />}
          label="Gallery"
          wobble="rounded-[12px_28px_10px_30px/28px_10px_26px_12px]"
        />
        <Tile
          icon={<UserIcon className="w-14 h-14" />}
          label="Profile"
          wobble="rounded-[30px_10px_26px_14px/12px_24px_10px_30px]"
        />
      </section>

      {/* RIGHT SIDE: tall loading panel */}
      <aside
        className={`${frame} w-56 h-[28rem] shrink-0 flex flex-col items-center justify-between p-6 rounded-[18px_10px_28px_12px/10px_26px_12px_30px]`}
      >
        <div className="w-32 h-32 rounded-full border-[6px] border-[#3b1d4a] bg-[#d9a7c7] flex items-center justify-center">
          <BearIcon className="w-20 h-20" />
        </div>
        <div className="w-full">
          <div className="h-6 border-4 border-[#3b1d4a] rounded-full overflow-hidden bg-white">
            <div className="h-full w-2/3 bg-[#3b1d4a]" />
          </div>
          <p className="mt-2 text-center font-bold uppercase tracking-widest text-[#3b1d4a]">
            Loading
          </p>
        </div>
      </aside>
      </div>
</main>
  )
}

export default App