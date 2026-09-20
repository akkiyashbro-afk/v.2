import React, { useEffect, useRef } from "react";

export const MouseSpotlight = () => {
  const ref = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;

    const move = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const tick = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      if (ref.current) {
        ref.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.04), rgba(255,255,255,0.01) 30%, transparent 60%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-testid="mouse-spotlight"
      className="pointer-events-none fixed inset-0 z-[5]"
    />
  );
};

export default MouseSpotlight;
