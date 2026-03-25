export default function Contact() {
  return (
    <section id="contact" className="relative w-full py-24 md:py-40 px-6 md:px-12 bg-transparent z-20 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16">
          <div>
            <span className="text-zinc-500 font-medium tracking-widest uppercase text-sm mb-4 block">
              03 — Contact
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white tracking-tight leading-none text-balance">
              Let&apos;s work<br />
              <span className="text-zinc-600">together.</span>
            </h2>
          </div>

          <p className="text-zinc-400 text-lg md:text-xl max-w-md leading-relaxed text-balance">
            Have a project in mind or want to collaborate? I&apos;d love to hear from you. Drop a message and I&apos;ll get back to you shortly.
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row gap-6 mt-4">
          <a
            href="mailto:your@email.com"
            className="group flex items-center gap-5 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 transition-all duration-300 min-w-[280px]"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-zinc-700 flex items-center justify-center text-xl flex-shrink-0">
              📩
            </div>
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Email</p>
              <p className="text-white font-medium text-base group-hover:text-zinc-300 transition-colors">ahmedislamk03@gmail.com</p>
            </div>
          </a>

          <a
            href="tel:+1234567890"
            className="group flex items-center gap-5 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 transition-all duration-300 min-w-[280px]"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-zinc-700 flex items-center justify-center text-xl flex-shrink-0">
              📞
            </div>
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Phone</p>
              <p className="text-white font-medium text-base group-hover:text-zinc-300 transition-colors">+92 315 6892862</p>
            </div>
          </a>
        </div>

        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 text-sm">
          <span>© 2026 Ahmed Islam. All rights reserved.</span>
          <span>Built with Next.js & Framer Motion</span>
        </div>

      </div>
    </section>
  );
}
