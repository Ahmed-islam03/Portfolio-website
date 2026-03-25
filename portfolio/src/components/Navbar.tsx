"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sectionIds = ["about", "work", "contact"];

    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 2;
      let currentSection = "";

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element && element.offsetTop <= scrollY) {
          currentSection = id;
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 pointer-events-auto">
      <div className="max-w-7xl mx-auto relative flex items-center h-14">
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-1 bg-black/20 backdrop-blur-md px-3 py-2 rounded-full border border-white/5">
          {["About", "Work", "Contact", "LinkedIn", "GitHub"].map((link) => {
            const linkId = link.toLowerCase();
            const isActive = activeSection === linkId;
            return (
              <a
                key={link}
                href={
                  link === "LinkedIn"
                    ? "https://www.linkedin.com/in/ahmed-islam-926817322"
                    : link === "GitHub"
                    ? "https://github.com/Ahmed-islam03"
                    : `#${linkId}`
                }
                target={link === "LinkedIn" || link === "GitHub" ? "_blank" : undefined}
                rel={link === "LinkedIn" || link === "GitHub" ? "noopener noreferrer" : undefined}
                className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  isActive
                    ? "text-white bg-white/10"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {link}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
