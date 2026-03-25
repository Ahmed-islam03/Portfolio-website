import { ExternalLink, GitBranch } from "lucide-react";

export default function Projects() {
  const projects = [
    {
      title: "Neura Interface",
      description: "A futuristic neural-controlled dashboard built with webGL and React.",
      year: "2025",
    },
    {
      title: "Aura E-Commerce",
      description: "High performance headless storefront with bespoke animations.",
      year: "2024",
    },
    {
      title: "Vanguard Studio",
      description: "WebGL powered digital agency portfolio with smooth scrolling mechanics.",
      year: "2024",
    },
    {
      title: "Lumina App",
      description: "Fintech dashboard with real-time data visualization and dark mode.",
      year: "2023",
    }
  ];

  return (
    <section id="work" className="relative w-full py-24 md:py-40 px-6 md:px-12 bg-[#121212] z-20 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto">

        {/* Header — matches About layout */}
        <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-start mb-20 md:mb-28">
          <div className="md:w-1/3">
            <span className="text-zinc-500 font-medium tracking-widest uppercase text-sm mb-4 block">
              02 — Selected Works
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight text-balance leading-tight">
              Work that <br className="hidden md:block" />
              <span className="text-zinc-600">speaks.</span>
            </h2>
          </div>
          <div className="md:w-2/3 mt-2 md:mt-12">
            <p className="text-xl md:text-3xl font-light text-zinc-300 leading-relaxed text-balance">
              A curated showcase of recent digital experiences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative flex flex-col p-8 rounded-3xl bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 hover:border-zinc-700/80 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex justify-between items-start mb-12">
                <span className="px-3 py-1 rounded-full text-xs font-medium text-zinc-400 bg-zinc-800/50 border border-zinc-700/50">
                  {project.year}
                </span>
                <div className="flex space-x-3 text-zinc-500">
                  <span className="hover:text-white transition-colors cursor-pointer">
                    <GitBranch size={20} strokeWidth={1.5} />
                  </span>
                  <span className="hover:text-white transition-colors cursor-pointer">
                    <ExternalLink size={20} strokeWidth={1.5} />
                  </span>
                </div>
              </div>

              <div className="mt-auto">
                <h3 className="text-2xl md:text-3xl font-semibold text-zinc-100 mb-3 group-hover:text-white transition-colors">
                  {project.title}
                </h3>
                <p className="text-zinc-400 text-base md:text-lg">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
