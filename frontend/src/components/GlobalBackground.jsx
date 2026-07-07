import React, { useEffect, useMemo, useState } from "react";
import LiquidEther from "./LiquidEther/LiquidEther";

// Stable color identity (array identity must not change or LiquidEther re-inits).
const COLORS = ["#ff3b30", "#7c3aed", "#2563eb", "#22d3ee"];

// Classify the device into a performance tier and derive LiquidEther settings.
// - Respects prefers-reduced-motion (renders a static ambient instead of the sim).
// - Reduces resolution / intensity on tablet + mobile.
// - Further reduces quality on low-end devices (few cores / low memory).
function computeConfig() {
  if (typeof window === "undefined") return { disabled: true, tier: "ssr" };

  const reduce = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reduce) return { disabled: true, tier: "reduced" };

  const w = window.innerWidth;
  const isMobile = w < 768;
  const isTablet = w >= 768 && w < 1024;

  const cores = navigator.hardwareConcurrency || 8;
  const mem = navigator.deviceMemory || 8;
  const lowEnd = cores <= 4 || mem <= 4;

  // Desktop defaults (as specified in the brief).
  let resolution = 0.5;
  let autoIntensity = 2.1;
  let cursorSize = 100;
  let autoSpeed = 0.4;
  let mouseForce = 17;

  if (isTablet) {
    resolution = 0.4;
    autoIntensity = 1.85;
    cursorSize = 90;
    mouseForce = 15;
  }
  if (isMobile) {
    resolution = 0.34;
    autoIntensity = 1.6;
    cursorSize = 80;
    autoSpeed = 0.35;
    mouseForce = 14;
  }
  if (lowEnd) {
    resolution = Math.min(resolution, 0.28);
    autoIntensity = Math.min(autoIntensity, 1.5);
  }

  const tier = `${isMobile ? "m" : isTablet ? "t" : "d"}${lowEnd ? "-low" : ""}`;
  return {
    disabled: false,
    tier,
    resolution,
    autoIntensity,
    cursorSize,
    autoSpeed,
    mouseForce,
  };
}

// Full-screen ambient liquid background.
// - fixed, behind every section (z-0)
// - never captures pointer/scroll (pointer-events: none)
// - subtle dark overlay preserves the #050505 identity + text readability
export const GlobalBackground = ({ active = true }) => {
  const [config, setConfig] = useState(() => computeConfig());

  // Re-evaluate the tier only when it actually changes (avoids needless re-inits).
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const next = computeConfig();
        setConfig((prev) => (prev.tier === next.tier ? prev : next));
      });
    };
    window.addEventListener("resize", onResize, { passive: true });
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => setConfig(computeConfig());
    if (mq.addEventListener) mq.addEventListener("change", onMq);
    else if (mq.addListener) mq.addListener(onMq);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      if (mq.removeEventListener) mq.removeEventListener("change", onMq);
      else if (mq.removeListener) mq.removeListener(onMq);
    };
  }, []);

  const liquid = useMemo(() => {
    if (config.disabled || !active) return null;
    return (
      <LiquidEther
        key={config.tier}
        style={{ width: "100%", height: "100%" }}
        mouseForce={config.mouseForce}
        cursorSize={config.cursorSize}
        isViscous={false}
        viscous={30}
        colors={COLORS}
        autoDemo
        autoSpeed={config.autoSpeed}
        autoIntensity={config.autoIntensity}
        isBounce
        resolution={config.resolution}
      />
    );
  }, [config, active]);

  return (
    <div
      aria-hidden="true"
      data-testid="global-liquid-background"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* Reduced-motion / SSR fallback: static ambient glow (keeps identity). */}
      {config.disabled && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 22% 28%, rgba(37,99,235,0.10), transparent 55%), radial-gradient(circle at 80% 72%, rgba(124,58,237,0.09), transparent 55%)",
          }}
        />
      )}

      {/* Interactive liquid layer */}
      {liquid && <div className="absolute inset-0">{liquid}</div>}

      {/* Subtle dark overlay so #050505 identity + text stay perfectly readable */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(5,5,5,0.46)" }}
      />
      {/* Edge vignette to keep the composition centered and calm */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 38%, rgba(5,5,5,0.5) 100%)",
        }}
      />
    </div>
  );
};

export default GlobalBackground;
