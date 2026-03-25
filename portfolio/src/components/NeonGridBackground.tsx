"use client";

import { useEffect, useRef } from "react";

export default function NeonGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const gridSize = 50;
    const neurons: Neuron[] = [];
    const maxNeurons = 30; // Number of active neurons
    const neuronSpeed = 2; // Pixels per frame
    const baseColor = "rgba(40, 40, 40, 0.4)"; // Dark grid lines
    const neonColor = "rgba(255, 100, 0, 1)"; // Neon orange

    class Neuron {
      x: number;
      y: number;
      length: number;
      dx: number;
      dy: number;
      history: { x: number, y: number }[];

      constructor() {
        this.length = Math.random() * 100 + 50;
        this.history = [];

        // Pick a random intersection on the grid (restricted to columns 7 to 24)
        const minCol = 7;
        const maxCol = 24;
        const col = Math.floor(Math.random() * (maxCol - minCol + 1)) + minCol;

        this.x = col * gridSize;
        this.y = 0; // Always start at the top

        // Always start moving downwards
        this.dx = 0;
        this.dy = neuronSpeed;
      }

      update() {
        this.history.push({ x: this.x, y: this.y });

        // Remove old history to keep tail length proper
        const maxHistory = this.length / neuronSpeed;
        if (this.history.length > maxHistory) {
          this.history.shift();
        }

        this.x += this.dx;
        this.y += this.dy;

        // Optionally change direction at intersections
        if (this.x % gridSize === 0 && this.y % gridSize === 0) {
          // Enforce straight drop for at least 3 rows
          const hasFallenEnough = this.y >= gridSize * 4;

          if (hasFallenEnough && Math.random() > 0.7) { // 30% chance to turn
            if (this.dy > 0) {
              // Currently going down, turn horizontal
              this.dx = Math.random() > 0.5 ? neuronSpeed : -neuronSpeed;
              this.dy = 0;
            } else {
              // Currently going horizontal, turn back down
              this.dx = 0;
              this.dy = neuronSpeed;
            }
          }
        }

        // Reset if out of bounds (off sides or bottom)
        if (this.x < -this.length || this.x > width + this.length || this.y > height + this.length) {
          this.reset();
        }
      }

      reset() {
        this.history = [];
        const minCol = 6;
        const maxCol = 27;
        const col = Math.floor(Math.random() * (maxCol - minCol + 1)) + minCol;
        this.x = col * gridSize;
        this.y = 0;

        this.dx = 0;
        this.dy = neuronSpeed;
        this.length = Math.random() * 100 + 50;
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.history.length === 0) return;

        ctx.beginPath();
        ctx.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 1; i < this.history.length; i++) {
          ctx.lineTo(this.history[i].x, this.history[i].y);
        }
        ctx.lineTo(this.x, this.y);

        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = neonColor;
        ctx.strokeStyle = neonColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Reset shadow
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < maxNeurons; i++) {
      neurons.push(new Neuron());
    }

    const drawGrid = () => {
      ctx.strokeStyle = baseColor;
      ctx.lineWidth = 1;

      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      drawGrid();

      neurons.forEach(neuron => {
        neuron.update();
        neuron.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-[-1] pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
}
