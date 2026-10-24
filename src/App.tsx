// The shared "marker frame" look: thick plum border + cream fill + double hard shadow
const frame =
  'border-[6px] border-[#3b1d4a] bg-[#f5e6c8] shadow-[4px_4px_0_#3b1d4a,8px_8px_0_#d9a7c7]'

// A reusable square tile (Files, Gallery, Contacts, Profile)
function Tile({ icon, label, wobble }: { icon: string; label: string; wobble: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${frame} ${wobble} w-32 h-32 flex items-center justify-center text-5xl cursor-pointer transition-transform hover:-rotate-3 hover:scale-105`}
      >
        {icon}
      </div>
      <p className="font-bold uppercase tracking-widest text-[#3b1d4a]">{label}</p>
    </div>
  )
}

function App() {
  return (
    <main className="min-h-screen bg-[#f0d9e6] flex items-center justify-center gap-14 p-8">
      {/* LEFT SIDE: the launcher grid */}
      <section className="grid grid-cols-3 gap-x-10 gap-y-12">
        {/* HOME: wide panel with sparkles + tilted mascot panel overlapping */}
        <div
          className={`${frame} relative col-span-2 h-44 flex items-center justify-around text-4xl text-[#3b1d4a] rounded-[14px_34px_16px_28px/26px_12px_32px_16px]`}
        >
          <span>✦</span>
          <span>✧</span>
          <span>✦</span>
          <div
            className={`${frame} absolute -top-8 -right-6 z-10 w-28 h-28 rotate-6 flex items-center justify-center text-5xl rounded-[24px_10px_28px_12px/12px_26px_10px_24px]`}
          >
            🐻
          </div>
        </div>

        <Tile icon="✈️" label="Contacts" wobble="rounded-[10px_30px_14px_26px/24px_12px_28px_10px]" />
        <Tile icon="📁" label="Files" wobble="rounded-[26px_12px_30px_10px/10px_28px_12px_24px]" />
        <Tile icon="🖼️" label="Gallery" wobble="rounded-[12px_28px_10px_30px/28px_10px_26px_12px]" />
        <Tile icon="👤" label="Profile" wobble="rounded-[30px_10px_26px_14px/12px_24px_10px_30px]" />
      </section>

      {/* RIGHT SIDE: tall loading panel */}
      <aside
        className={`${frame} w-56 h-[28rem] flex flex-col items-center justify-between p-6 rounded-[18px_10px_28px_12px/10px_26px_12px_30px]`}
      >
        <div className="w-32 h-32 rounded-full border-[6px] border-[#3b1d4a] bg-[#d9a7c7] flex items-center justify-center text-6xl">
          🐻
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
    </main>
  )
}

export default App