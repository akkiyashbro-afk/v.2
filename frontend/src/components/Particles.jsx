import React, { useEffect, useRef } from "react";

// Lightweight canvas particles — 60fps, transform+opacity only equivalents on canvas
export const Particles = ({ count = 60, color = "#FAFAFA" }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: (Math.random() * 1.0 + 0.3) * window.devicePixelRatio,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      a: Math.random() * 0.45 + 0.15,
      p: Math.random() * Math.PI * 2,
    }));

    const onResize = () => {
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    window.addEventListener("resize", onResize);

    const tick = (t) => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }
        const twinkle = (Math.sin(t / 900 + p.p) + 1) / 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.a * (0.4 + twinkle * 0.6);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [count, color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="particle-canvas"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
};

export default Particles;
