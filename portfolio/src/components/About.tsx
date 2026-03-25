export default function About() {
  return (
    <section id="about" className="relative w-full py-24 md:py-40 px-6 md:px-12 bg-[#121212] z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-start">

        {/* Title Area */}
        <div className="md:w-1/3">
          <span className="text-zinc-500 font-medium tracking-widest uppercase text-sm mb-4 block">
            01 — About Me
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight text-balance leading-tight">
            I craft digital <br className="hidden md:block" />
            <span className="text-zinc-600">masterpieces.</span>
          </h2>
        </div>

        {/* Content Area */}
        <div className="md:w-2/3 flex flex-col gap-8 md:gap-12 mt-2 md:mt-12">
          <p className="text-xl md:text-3xl font-light text-zinc-300 leading-relaxed text-balance">
            I'm a creative web / game developer bridging the gap between aesthetics and uncompromising engineering. My work focuses on building high-performance, immersive web experiences that leave a lasting impression.
          </p>

          <div className="w-full h-[1px] bg-zinc-800" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Capabilities</span>
              <ul className="text-zinc-300 space-y-1 font-medium">
                <li>Creative Development</li>
                <li>Web Development</li>
                <li>Interactive Design</li>
                <li>Game Development</li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Stack</span>
              <ul className="text-zinc-300 space-y-1 font-medium">
                <li>Next.js / React / Phaser</li>
                <li>TypeScript</li>
                <li>Framer Motion</li>
                <li>Firebase</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
