"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

const FRAME_COUNT = 200;

export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Preload images on mount
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      // Calculate filename matching ezgif-frame-001.png to ezgif-frame-200.png
      const frameString = (i + 1).toString().padStart(3, "0");
      img.src = `/sequence/ezgif-frame-${frameString}.png`;
      img.onload = () => {
        // Trigger first paint when at least one image is loaded
        if (i === 0) {
          paintFrame(img);
        }
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  const paintFrame = (image: HTMLImageElement) => {
    if (!canvasRef.current || !image) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use object-fit cover logic inside canvas
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = image.width / image.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;

    // To completely avoid stretching the pixels while ensuring no borders appear,
    // we use standard 'object-fit: cover' mathematics. 
    // We also apply a 10% zoom multiplier to explicitly push the bottom-right 
    // "VEO" watermark outside of the visible canvas bounds on all screen sizes.
    const zoomMap = 1.10;

    if (canvasRatio > imgRatio) {
      drawWidth = canvas.width * zoomMap;
      drawHeight = (canvas.width / imgRatio) * zoomMap;
      // Center the zoomed crop
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = (canvas.height * imgRatio) * zoomMap;
      drawHeight = canvas.height * zoomMap;
      // Center the zoomed crop
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw with slight smoothing or disable for performance if needed
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Keep canvas sized to viewport
  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        // High DPI canvas rendering
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = window.innerWidth * dpr;
        canvasRef.current.height = window.innerHeight * dpr;
        canvasRef.current.style.width = `${window.innerWidth}px`;
        canvasRef.current.style.height = `${window.innerHeight}px`;
        
        // Re-paint current frame after resize
        const currentFrame = Math.round(scrollYProgress.get() * (FRAME_COUNT - 1));
        if (images[currentFrame]) {
          paintFrame(images[currentFrame]);
        }
      }
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [images, scrollYProgress]);

  // Scrub through frames linearly
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (images.length === 0) return;
    
    // Map progress 0-1 to frame index 0-(FRAME_COUNT-1)
    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.floor(latest * (FRAME_COUNT - 1)))
    );
    
    requestAnimationFrame(() => {
      if (images[frameIndex]) {
        paintFrame(images[frameIndex]);
      }
    });
  });

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "500vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#121212]">
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />
        
        {/* Parallax Overlay passed as children in page.tsx or positioned over canvas */}
      </div>
    </div>
  );
}
