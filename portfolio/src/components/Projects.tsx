import { ExternalLink, GitBranch } from "lucide-react";

export default function Projects() {
  const projects = [
    {
      title: "Flappy Bird Game",
      description: "A remake of the iconic flappy bird game made with Phaser.js and Firebase.",
      link: "https://flappy-bird-one-ashen.vercel.app/",
      repo: "https://github.com/Ahmed-islam03/FlappyBird",
    },
    {
      title: "Project 2",
      description: "nill.",
    },
    {
      title: "Project 3",
      description: "nill.",
    },
    {
      title: "Project 4",
      description: "nill.",
    }
  ];

  return (
    <section id="work" className="relative w-full py-24 md:py-40 px-6 md:px-12 bg-transparent z-20 border-t border-zinc-800/50">
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
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex justify-end items-start mb-12">
                <div className="flex space-x-3 text-zinc-500">
                  {project.repo ? (
                    <a href={project.repo} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer block">
                      <GitBranch size={20} strokeWidth={1.5} />
                    </a>
                  ) : (
                    <span className="hover:text-white transition-colors cursor-pointer">
                      <GitBranch size={20} strokeWidth={1.5} />
                    </span>
                  )}
                  {project.link ? (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer block">
                      <ExternalLink size={20} strokeWidth={1.5} />
                    </a>
                  ) : (
                    <span className="hover:text-white transition-colors cursor-pointer">
                      <ExternalLink size={20} strokeWidth={1.5} />
                    </span>
                  )}
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
