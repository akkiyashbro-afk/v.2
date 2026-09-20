import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import LiquidEther from "./LiquidEther/LiquidEther";

// Stable color identity (array identity must not change or LiquidEther re-inits).
// White-only palette — premium "liquid glass" ambience, kept extremely subtle.
const COLORS = ["#ffffff", "#ffffff", "#ffffff"];

// ---------------------------------------------------------------------------
// Capability detection
// ---------------------------------------------------------------------------
function detectWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") ||
        c.getContext("webgl") ||
        c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

// iOS / iPadOS Safari cannot reliably render to the float textures the
// LiquidEther fluid simulation depends on, which leaves the background blank
// or broken. Detect Apple touch devices (incl. iPadOS reporting as "MacIntel")
// so we can serve the animated Aurora fallback instead.
function isAppleTouchDevice() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const iOS = /iPad|iPhone|iPod/.test(ua);
  const iPadOS =
    navigator.platform === "MacIntel" && (navigator.maxTouchPoints || 0) > 1;
  return iOS || iPadOS;
}

function computeConfig() {
  if (typeof window === "undefined") return { disabled: true, tier: "ssr" };

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return { disabled: true, tier: "reduced" };

  const w = window.innerWidth;
  const isMobile = w < 768;
  const isTablet = w >= 768 && w < 1024;

  const cores = navigator.hardwareConcurrency || 8;
  const mem = navigator.deviceMemory || 8;
  const lowEnd = cores <= 4 || mem <= 4;

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

// ---------------------------------------------------------------------------
// Error boundary — if LiquidEther throws while initialising WebGL, swap to the
// Aurora fallback so the background is never blank.
// ---------------------------------------------------------------------------
class LiquidBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn("LiquidEther failed, using Aurora fallback:", err?.message);
    this.props.onError && this.props.onError();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Animated Aurora fallback — lightweight, GPU-friendly drifting colour blobs
// using the same brand palette so the premium look is preserved everywhere.
// ---------------------------------------------------------------------------
const FALLBACK_BLOBS = [
  {
    bg: "radial-gradient(circle at center, rgba(37,99,235,0.30), transparent 60%)",
    style: { top: "-12%", left: "-8%", width: "62vw", height: "62vw" },
    x: [0, 40, -20, 0],
    y: [0, -30, 25, 0],
    dur: 26,
  },
  {
    bg: "radial-gradient(circle at center, rgba(124,58,237,0.26), transparent 60%)",
    style: { bottom: "-14%", right: "-8%", width: "58vw", height: "58vw" },
    x: [0, -35, 20, 0],
    y: [0, 25, -20, 0],
    dur: 32,
  },
  {
    bg: "radial-gradient(circle at center, rgba(34,211,238,0.20), transparent 60%)",
    style: { top: "18%", right: "6%", width: "44vw", height: "44vw" },
    x: [0, -25, 30, 0],
    y: [0, 30, -15, 0],
    dur: 36,
  },
  {
    bg: "radial-gradient(circle at center, rgba(255,59,48,0.16), transparent 60%)",
    style: { bottom: "12%", left: "10%", width: "40vw", height: "40vw" },
    x: [0, 30, -25, 0],
    y: [0, -25, 20, 0],
    dur: 40,
  },
];

const AuroraFallback = () => (
  <div
    className="absolute inset-0 overflow-hidden"
    data-testid="aurora-fallback"
  >
    {FALLBACK_BLOBS.map((b, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{ ...b.style, background: b.bg, filter: "blur(70px)" }}
        animate={{ x: b.x, y: b.y }}
        transition={{
          duration: b.dur,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Global ambient background
// ---------------------------------------------------------------------------
export const GlobalBackground = ({ active = true }) => {
  const [config, setConfig] = useState(() => computeConfig());
  const [forceFallback, setForceFallback] = useState(false);

  // Decide once whether this device should use the Aurora fallback.
  const preferFallback = useMemo(
    () => !detectWebGL() || isAppleTouchDevice(),
    []
  );

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

  const useAurora = active && !config.disabled && (preferFallback || forceFallback);

  const liquid = useMemo(() => {
    if (config.disabled || !active || preferFallback || forceFallback)
      return null;
    return (
      <LiquidBoundary onError={() => setForceFallback(true)}>
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
      </LiquidBoundary>
    );
  }, [config, active, preferFallback, forceFallback]);

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

      {/* Animated Aurora fallback (iOS/iPadOS Safari, no-WebGL, or on error). */}
      {useAurora && <AuroraFallback />}

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
