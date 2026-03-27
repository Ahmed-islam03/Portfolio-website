"use client";

import { useEffect, useRef, useCallback } from "react";

// ── constants ──────────────────────────────────────────────────────────────────
const GRAVITY = 0.15;
const FLAP = -4.0;
const PIPE_GAP = 100; // slightly wider for slower speed
const PIPE_W_PX = 5;
const PX = 1;         // keeping user's pixel scale
const PIPE_SPEED = 1.2; // slower speed
const GROUND_H = 18;
const BIRD_X = 100;

// Pixel-art classic flappy bird shape (mapped from image)
// Every 1 is a line; auto-outliner will preserve them
const BIRD = [
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
  [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
];
const BW = BIRD[0].length * PX;
const BH = BIRD.length * PX;

// Pre-compute which pixels are on the outline (have at least one empty neighbour)
const BIRD_OUTLINE = BIRD.map((row, ri) =>
  row.map((cell, ci) => {
    if (!cell) return 0;
    const up = ri > 0 ? BIRD[ri - 1][ci] : 0;
    const dn = ri < BIRD.length - 1 ? BIRD[ri + 1][ci] : 0;
    const lt = ci > 0 ? BIRD[ri][ci - 1] : 0;
    const rt = ci < row.length - 1 ? BIRD[ri][ci + 1] : 0;
    return (up && dn && lt && rt) ? 0 : 1; // interior → skip
  })
);

interface Pipe { x: number; gapTop: number; scored?: boolean; }

export default function FlappyBirdGame({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const W = useRef(600);
  const H = useRef(300);

  const s = useRef({
    birdY: 150, vy: 0,
    pipes: [] as Pipe[],
    score: 0, best: 0,
    phase: "idle" as "idle" | "countdown" | "running" | "dead",
    countdown: 3, cdTimer: 0, frame: 0,
    pipeTimer: 0,
  });
  const rafRef = useRef(0);

  // ── sync canvas size ─────────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const sync = () => {
      const r = container.getBoundingClientRect();
      W.current = r.width || 600;
      H.current = r.height || 300;
      canvas.width = W.current;
      canvas.height = H.current;
      s.current.birdY = H.current / 2;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // ── draw bird (outline only) ──────────────────────────────────────────────────
  const drawBird = (ctx: CanvasRenderingContext2D) => {
    const rot = Math.max(-0.4, Math.min(0.6, s.current.vy * 0.05));
    ctx.save();
    ctx.translate(BIRD_X, s.current.birdY);
    ctx.rotate(rot);
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    BIRD_OUTLINE.forEach((row, ri) =>
      row.forEach((cell, ci) => {
        if (cell) ctx.fillRect(-BW / 2 + ci * PX, -BH / 2 + ri * PX, PX - 0.5, PX - 0.5);
      })
    );
    ctx.restore();
  };

  // ── draw pipe (outline only) ──────────────────────────────────────────────────
  const drawPipe = (ctx: CanvasRenderingContext2D, pipe: Pipe) => {
    const pw = PIPE_W_PX * PX;
    const x = pipe.x;
    const topEnd = pipe.gapTop;        // bottom of top pipe (canvas y)
    const botStart = pipe.gapTop + PIPE_GAP; // top of bottom pipe (canvas y)
    const botEnd = H.current - GROUND_H;

    ctx.fillStyle = "rgba(255,255,255,0.88)";

    const drawOutlineRect = (rx: number, ry: number, rw: number, rh: number) => {
      // top row
      for (let px2 = 0; px2 < rw; px2 += PX)
        ctx.fillRect(rx + px2, ry, PX - 0.5, PX - 0.5);
      // bottom row
      for (let px2 = 0; px2 < rw; px2 += PX)
        ctx.fillRect(rx + px2, ry + rh - PX, PX - 0.5, PX - 0.5);
      // left col (skip corners already drawn)
      for (let py = PX; py < rh - PX; py += PX)
        ctx.fillRect(rx, ry + py, PX - 0.5, PX - 0.5);
      // right col
      for (let py = PX; py < rh - PX; py += PX)
        ctx.fillRect(rx + rw - PX, ry + py, PX - 0.5, PX - 0.5);
    };

    // top pipe (if tall enough to show outline)
    if (topEnd > PX * 2)
      drawOutlineRect(x, 0, pw, topEnd);

    // bottom pipe
    if (botEnd - botStart > PX * 2)
      drawOutlineRect(x, botStart, pw, botEnd - botStart);
  };

  // ── render scene ─────────────────────────────────────────────────────────────
  const drawScene = useCallback((ctx: CanvasRenderingContext2D) => {
    const { score, best, phase, countdown } = s.current;
    const w = W.current, h = H.current;

    ctx.clearRect(0, 0, w, h);

    // ground dots
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    for (let gx = 0; gx < w; gx += PX * 3)
      ctx.fillRect(gx, h - GROUND_H, PX, PX);

    s.current.pipes.forEach(p => drawPipe(ctx, p));
    drawBird(ctx);

    // score
    ctx.font = "bold 15px monospace";
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.textAlign = "right";
    ctx.fillText(`${score}`, w - 14, 24);

    // overlays
    if (phase === "idle") {
      ctx.fillStyle = "rgba(0,0,0,0.48)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.font = "bold 17px monospace";
      ctx.textAlign = "center";
      ctx.fillText("tap  /  space  to  play", w / 2, h / 2);
      if (best > 0) {
        ctx.font = "12px monospace";
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fillText(`best: ${best}`, w / 2, h / 2 + 22);
      }
    }

    if (phase === "countdown") {
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = `bold ${Math.min(w, h) * 0.18}px monospace`;
      ctx.textAlign = "center";
      ctx.fillText(`${countdown}`, w / 2, h / 2 + 16);
    }

    if (phase === "dead") {
      ctx.fillStyle = "rgba(0,0,0,0.52)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "center";
      ctx.fillText("GAME  OVER", w / 2, h / 2 - 16);
      ctx.font = "12px monospace";
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fillText(`score: ${score}   best: ${best}`, w / 2, h / 2 + 6);
      ctx.font = "11px monospace";
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillText("tap / space to retry", w / 2, h / 2 + 26);
    }
  }, []);

  // ── spawn pipe ────────────────────────────────────────────────────────────────
  const spawnPipe = () => {
    const h = H.current;
    const min = 40;
    const max = h - GROUND_H - PIPE_GAP - 40;
    s.current.pipes.push({ x: W.current + 10, gapTop: min + Math.random() * (max - min) });
  };

  // ── collision ─────────────────────────────────────────────────────────────────
  const collides = (): boolean => {
    const { birdY, pipes } = s.current;
    const h = H.current;
    const by1 = birdY - BH / 2 + 3, by2 = birdY + BH / 2 - 3;
    const bx1 = BIRD_X - BW / 2 + 3, bx2 = BIRD_X + BW / 2 - 3;
    const pw = PIPE_W_PX * PX;
    if (by2 >= h - GROUND_H || by1 <= 0) return true;
    for (const p of pipes) {
      if (bx2 < p.x || bx1 > p.x + pw) continue;
      if (by1 < p.gapTop || by2 > p.gapTop + PIPE_GAP) return true;
    }
    return false;
  };

  // ── flap ──────────────────────────────────────────────────────────────────────
  const flap = useCallback(() => {
    const st = s.current;
    if (st.phase === "idle" || st.phase === "dead") {
      st.birdY = H.current / 2; st.vy = 0; 
      
      // Spawn two initial pipes already on screen
      const h = H.current;
      const w = W.current;
      const min = 40;
      const max = h - GROUND_H - PIPE_GAP - 40;
      st.pipes = [
        { x: Math.round(w * 0.55), gapTop: min + Math.random() * (max - min) },
        { x: Math.round(w * 0.82), gapTop: min + Math.random() * (max - min) }
      ];
      
      st.score = 0; st.frame = 0; st.pipeTimer = 0;
      st.phase = "countdown"; st.countdown = 3; st.cdTimer = 0;
      return;
    }
    if (st.phase === "running") st.vy = FLAP;
  }, []);

  // ── game loop ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime: number | null = null;

    const loop = (time: number) => {
      if (lastTime === null) {
        lastTime = time;
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      const dt = time - lastTime;
      lastTime = time;
      
      // Target 60fps as baseline (dtScale = 1.0 @ 60fps)
      // Cap at 4.0 to prevent massive physics jumps if the tab was suspended
      const dtScale = Math.min(dt / (1000 / 60), 4.0);

      const st = s.current;
      st.frame += dtScale;

      if (st.phase === "countdown") {
        st.cdTimer += dtScale;
        if (st.cdTimer >= 60) { st.cdTimer = 0; st.countdown--; if (st.countdown <= 0) st.phase = "running"; }
      }

      if (st.phase === "running") {
        st.vy += GRAVITY * dtScale;
        st.birdY += st.vy * dtScale;
        
        st.pipeTimer += dtScale;
        if (st.pipeTimer >= 180) { spawnPipe(); st.pipeTimer = 0; }
        
        const pw = PIPE_W_PX * PX;
        st.pipes = st.pipes.filter(p => p.x + pw > -10);
        st.pipes.forEach(p => {
          p.x -= PIPE_SPEED * dtScale;
          if (!p.scored && p.x + pw < BIRD_X - BW / 2) {
            p.scored = true; st.score++;
            if (st.score > st.best) st.best = st.score;
          }
        });
        if (collides()) st.phase = "dead";
      }

      drawScene(ctx);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawScene]);

  // ── keyboard ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); flap(); }
      if (e.code === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flap, onClose]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-50 rounded-3xl overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer select-none block"
        style={{ imageRendering: "pixelated" }}
        onPointerDown={e => { e.stopPropagation(); flap(); }}
      />
      <button
        onClick={e => { e.stopPropagation(); onClose(); }}
        className="absolute top-3 left-4 text-white/30 hover:text-white/80 transition-colors text-xs font-mono tracking-wider z-10"
      >
        ✕ Esc
      </button>
    </div>
  );
}
