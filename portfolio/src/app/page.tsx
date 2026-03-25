import ScrollyCanvas from "@/components/ScrollyCanvas";
import Overlay from "@/components/Overlay";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#121212] overflow-x-clip">
      <Navbar />
      <div className="relative">
        {/* Scrollytelling element holding the 500vh container */}
        <ScrollyCanvas />
        
        {/* Parallax typography perfectly overlaid on the canvas */}
        <Overlay />
      </div>

      {/* Renders after 500vh scroll space */}
      <About />
      <Projects />
      <Contact />
    </main>
  );
}
