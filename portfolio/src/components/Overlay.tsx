"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

const SCROLL_HEIGHT_VH = 500;

export default function Overlay() {
  // Raw scroll progress 0..1 through the 500vh scrolly section
  const rawProgress = useMotionValue(0);
  const progress = useSpring(rawProgress, { stiffness: 200, damping: 40, mass: 0.5 });

  useEffect(() => {
    const update = () => {
      // The scrolly section is exactly SCROLL_HEIGHT_VH vh tall starting at top of page
      const sectionHeight = (SCROLL_HEIGHT_VH / 100) * window.innerHeight;
      const scrollable = sectionHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, window.scrollY / scrollable));
      rawProgress.set(p);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [rawProgress]);

  // Section 1: 0 → 0.18
  const y1 = useTransform(progress, [0, 0.18], ["0vh", "-110vh"]);
  const opacity1 = useTransform(progress, [0, 0.12, 0.18], [0.75, 0.75, 0]);

  // Section 2: 0.20 → 0.50
  const y2 = useTransform(progress, [0.18, 0.28, 0.42, 0.52], ["110vh", "0vh", "0vh", "-110vh"]);
  const opacity2 = useTransform(progress, [0.18, 0.28, 0.42, 0.52], [0, 0.5, 0.5, 0]);

  // Section 3: 0.52 → 0.88
  const y3 = useTransform(progress, [0.52, 0.62, 0.78, 0.88], ["110vh", "0vh", "0vh", "-110vh"]);
  const opacity3 = useTransform(progress, [0.52, 0.62, 0.78, 0.88], [0, 0.5, 0.5, 0]);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ height: `${SCROLL_HEIGHT_VH}vh` }}>
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center z-10 px-8 overflow-hidden">

        {/* Section 1 — Ahmed Islam */}
        <motion.div
          style={{ opacity: opacity1, y: y1 }}
          className="absolute text-center flex flex-col items-center justify-center max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4 text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Ahmed Islam
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 font-light tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Web / Game Developer.
          </p>
        </motion.div>

        {/* Section 2 — I build digital experiences */}
        <motion.div
          style={{ opacity: opacity2, y: y2 }}
          className="absolute w-full max-w-7xl flex justify-start px-4 md:px-12"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white max-w-2xl leading-tight text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            I build <span className="text-zinc-500">digital experiences</span>.
          </h2>
        </motion.div>

        {/* Section 3 — Bridging design and engineering */}
        <motion.div
          style={{ opacity: opacity3, y: y3 }}
          className="absolute w-full max-w-7xl flex justify-end px-4 md:px-12"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white max-w-2xl leading-tight text-right text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Bridging <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-600">design and engineering</span>.
          </h2>
        </motion.div>

      </div>
    </div>
  );
}
