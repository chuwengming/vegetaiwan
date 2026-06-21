'use client';

export default function HeroBanner() {
  return (
    <section className="relative py-24 md:py-32 flex items-center justify-center text-white overflow-hidden bg-[var(--secondary)]">
      {/* 玻璃擬態裝飾 */}
      <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary-light)] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent)] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[var(--max-width)] mx-auto px-4 relative z-10 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[var(--primary-light)] font-bold tracking-widest text-sm uppercase">
          Welcome to Vegan Taiwan
        </div>
        <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
          用蔬食，開啟<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-light)] to-[var(--accent)]">
            和平與和平的共生
          </span>
        </h2>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/80 mb-10 leading-relaxed">
          我們致力於推廣全民蔬食文化，從每一口飲食出發，建立一個更加友善、綠色且充滿慈悲的台灣社會，與大自然和諧共處。
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-10 py-4 bg-white text-[var(--secondary)] rounded-full font-bold text-lg hover:bg-[var(--accent)] hover:text-white transition-all shadow-xl">
            加入我們
          </button>
          <button className="px-10 py-4 border-2 border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
            了解使命
          </button>
        </div>
      </div>
    </section>
  );
}
