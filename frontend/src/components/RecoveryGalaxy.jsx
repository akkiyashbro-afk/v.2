import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { recoveredProfiles } from "../data/recoveredProfiles";
import { orbitSettings } from "../data/settings";
import { WinsAbleMark } from "./WinsAbleMark";

// Ring configuration is derived from /src/data/settings.js.
// Rotation duration is in seconds for one full revolution.
// speedFactor 1.0 = base 60s / rotation.
const BASE_DURATION_S = 60;
const RING_DEFS = [
  {
    count: orbitSettings.ring1Count,
    duration: BASE_DURATION_S / Math.max(orbitSettings.ring1Speed, 0.05),
    direction: orbitSettings.ring1Direction,
    diameter: orbitSettings.ring1Diameter,
  },
  {
    count: orbitSettings.ring2Count,
    duration: BASE_DURATION_S / Math.max(orbitSettings.ring2Speed, 0.05),
    direction: orbitSettings.ring2Direction,
    diameter: orbitSettings.ring2Diameter,
  },
  {
    count: orbitSettings.ring3Count,
    duration: BASE_DURATION_S / Math.max(orbitSettings.ring3Speed, 0.05),
    direction: orbitSettings.ring3Direction,
    diameter: orbitSettings.ring3Diameter,
  },
];

/**
 * Auto-distribute profiles into rings based on ring counts.
 * Any profiles beyond ring1+ring2+ring3 counts are appended to the outer ring.
 */
function distributeProfiles(profiles) {
  const capacities = RING_DEFS.map((r) => r.count);
  const rings = capacities.map(() => []);
  let cursor = 0;
  for (let r = 0; r < rings.length; r += 1) {
    const need = capacities[r];
    rings[r] = profiles.slice(cursor, cursor + need);
    cursor += need;
  }
  if (cursor < profiles.length) {
    rings[rings.length - 1] = rings[rings.length - 1].concat(
      profiles.slice(cursor)
    );
  }
  return rings;
}

// Individual avatar — purely visual (no interaction).
const Avatar = ({ profile, angle, radius }) => {
  return (
    <div
      data-testid={`galaxy-profile-${profile.id}`}
      aria-hidden="true"
      className="absolute top-1/2 left-1/2 pointer-events-none"
      style={{
        transform: `translate(-50%, -50%) rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`,
        willChange: "transform",
        padding: "6px",
      }}
    >
      <span className="relative block">
        <span
          className="relative block rounded-full overflow-hidden border border-white/15 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.9)]"
          style={{
            width: "clamp(40px, 4vw, 56px)",
            height: "clamp(40px, 4vw, 56px)",
          }}
        >
          <img
            src={profile.avatar}
            alt=""
            aria-hidden="true"
            draggable={false}
            loading="lazy"
            className="h-full w-full object-cover pointer-events-none select-none"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(160deg, rgba(255,255,255,0.18) 0%, transparent 40%)",
            }}
          />
        </span>
        {profile.verified !== false && (
          <span
            className="absolute -bottom-1 -right-1 rounded-full bg-[#050505] border border-white/10 p-[3px] opacity-80"
            data-testid="galaxy-verified-badge"
          >
            <BadgeCheck className="h-3 w-3 text-white/90" strokeWidth={2.5} />
          </span>
        )}
      </span>
    </div>
  );
};

// One orbit ring — a single rAF drives all its avatars in perfect sync.
const Ring = ({ index, profiles, cfg, reveal }) => {
  const rotationRef = useRef(0);
  const groupRef = useRef(null);
  const raf = useRef(0);
  const last = useRef(null);

  useEffect(() => {
    if (!reveal) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    let running = true;
    const step = (t) => {
      if (!running) return;
      if (last.current == null) last.current = t;
      const dt = (t - last.current) / 1000;
      last.current = t;
      rotationRef.current =
        (rotationRef.current + (dt * 360) / cfg.duration) % 360;
      if (groupRef.current) {
        groupRef.current.style.transform = `rotate(${
          rotationRef.current * cfg.direction
        }deg)`;
      }
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      running = false;
      cancelAnimationFrame(raf.current);
      last.current = null;
    };
  }, [reveal, cfg.duration, cfg.direction]);

  const r = cfg.diameter / 2 - 1;
  const c = 2 * Math.PI * r;
  const radius = cfg.diameter / 2;

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ width: cfg.diameter, height: cfg.diameter }}
      data-testid={`galaxy-ring-${index}`}
    >
      {/* Ring stroke (SVG) */}
      <svg
        aria-hidden="true"
        width={cfg.diameter}
        height={cfg.diameter}
        className="absolute inset-0 overflow-visible pointer-events-none"
      >
        <defs>
          <linearGradient
            id={`ring-grad-${index}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </linearGradient>
        </defs>
        <motion.circle
          cx={cfg.diameter / 2}
          cy={cfg.diameter / 2}
          r={r}
          fill="none"
          stroke={`url(#ring-grad-${index})`}
          strokeWidth="1"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: reveal ? 0 : c }}
          transition={{
            duration: 1.6,
            delay: 0.1 + index * 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </svg>

      {/* Avatars — the whole group rotates together via a single transform. */}
      <div ref={groupRef} className="absolute inset-0 pointer-events-none">
        {profiles.map((p, i) => {
          const baseAngle = (i / Math.max(profiles.length, 1)) * 360;
          return (
            <motion.div
              key={p.id}
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: reveal ? 1 : 0 }}
              transition={{
                duration: 0.9,
                delay: reveal ? 0.15 + 0.04 * i + index * 0.1 : 0,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Avatar profile={p} angle={baseAngle} radius={radius} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Center: WinsAble logo + glass platform + breathing pulse + energy ring
const GalaxyCore = ({ reveal }) => {
  return (
    <div
      data-testid="galaxy-core"
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: reveal ? 1 : 0, scale: reveal ? 1 : 0.7 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-[176px] w-[176px] sm:h-[200px] sm:w-[200px] flex items-center justify-center"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.22), transparent 70%)",
            animation: "breath 6s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-2 rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.16), transparent 70%)",
            animation: "breath 8s ease-in-out infinite reverse",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{
            padding: "1px",
            background:
              "conic-gradient(from 0deg, rgba(255,255,255,0), rgba(255,255,255,0.5), rgba(255,255,255,0))",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            animation: "energy-ring 10s linear infinite",
          }}
        />
        <div className="relative h-[128px] w-[128px] sm:h-[148px] sm:w-[148px] rounded-full bg-white/[0.03] backdrop-blur-2xl border border-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_60px_-10px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.14), transparent 55%)",
            }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full overflow-hidden"
          >
            <span
              className="absolute top-0 left-0 h-full w-1/3 -skew-x-12"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
                animation: "shine 7s ease-in-out infinite",
              }}
            />
          </span>
          <WinsAbleMark className="h-20 w-20 sm:h-24 sm:w-24 relative" />
        </div>
      </motion.div>
    </div>
  );
};

export const RecoveryGalaxy = () => {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const inView = useInView(containerRef, { once: true, amount: 0.2 });

  // Distribute profiles across rings
  const ringProfiles = distributeProfiles(recoveredProfiles);

  // Responsive orbit scaling: uniformly scale the whole galaxy so the outer
  // ring always fits the available width on phones/tablets, keeping the orbit
  // perfectly proportional and centered. Desktop (>=1024px) stays unchanged.
  const OUTER_CONTENT = RING_DEFS[2].diameter + 72; // outer ring + avatar allowance
  const [layout, setLayout] = useState({ scale: 1, height: null });
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const compute = () => {
      const w = el.clientWidth;
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop || !w) {
        setLayout({ scale: 1, height: null });
        return;
      }
      const scale = Math.max(0.32, Math.min(1, (w * 0.98) / OUTER_CONTENT));
      const height = Math.round(OUTER_CONTENT * scale + 32);
      setLayout({ scale, height });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [OUTER_CONTENT]);

  // Ambient 3D tilt via mouse (premium movement, no click interaction).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 22, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 55, damping: 22, mass: 0.5 });
  const rotY = useTransform(sx, [-1, 1], [6, -6]);
  const rotX = useTransform(sy, [-1, 1], [-4, 4]);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;
    const el = stageRef.current;
    if (!el) return;
    let ticking = false;
    let lx = 0;
    let ly = 0;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      lx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ly = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          mx.set(lx);
          my.set(ly);
          ticking = false;
        });
      }
    };
    const onLeave = () => {
      mx.set(0);
      my.set(0);
    };
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [mx, my]);

  return (
    <section
      id="galaxy"
      data-testid="recovery-galaxy"
      ref={containerRef}
      className="relative overflow-hidden py-32 md:py-40"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 relative z-10">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-20">
          <span className="text-[10px] uppercase tracking-[0.35em] text-white/40 mb-5 font-body font-medium">
            The Recovery Galaxy
          </span>
          <h2
            className="font-display font-black text-[36px] md:text-[54px] leading-[1.02] text-white"
            style={{ letterSpacing: "-0.04em" }}
          >
            Every orbit is a story
            <br />
            <span className="text-white/50">we quietly rewrote.</span>
          </h2>
          <p className="mt-6 text-white/50 text-[15px] leading-[1.75] font-body">
            Hundreds of verified identities — recovered, restored, and quietly
            returned to their owners.
          </p>
        </div>

        <div
          ref={stageRef}
          className="relative mx-auto w-full"
          style={{
            perspective: "1400px",
            height: layout.height
              ? `${layout.height}px`
              : "clamp(560px, 68vw, 860px)",
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              rotateX: rotX,
              rotateY: rotY,
              scale: layout.scale,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Outer ring first (pushed back), inner rings drawn on top. */}
            {[2, 1, 0].map((ringIndex) => {
              const zMap = { 0: 60, 1: 0, 2: -40 };
              return (
                <div
                  key={ringIndex}
                  style={{ transform: `translateZ(${zMap[ringIndex]}px)` }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <Ring
                    index={ringIndex}
                    profiles={ringProfiles[ringIndex]}
                    cfg={RING_DEFS[ringIndex]}
                    reveal={inView}
                  />
                </div>
              );
            })}
            <div
              style={{ transform: "translateZ(90px)" }}
              className="absolute inset-0 pointer-events-none"
            >
              <GalaxyCore reveal={inView} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ambient background aura */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[70rem] w-[70rem] rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.07), transparent 55%)",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[50rem] w-[50rem] rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.05), transparent 55%)",
          }}
        />
      </div>
    </section>
  );
};

export default RecoveryGalaxy;
