import React from "react";

// Aurora background — pure CSS radial gradients + heavy blur.
// Kept very subtle: soft blue + purple lighting only, no colorful gradients.
// aria-hidden so screen readers ignore decoration.
export const Aurora = ({ intensity = 1 }) => {
  return (
    <div
      aria-hidden="true"
      data-testid="aurora-layer"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity: intensity }}
    >
      {/* Very subtle blue light */}
      <div
        className="absolute -top-40 -left-40 h-[60rem] w-[60rem] rounded-full blur-3xl motion-safe:animate-[aurora_22s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(59,130,246,0.10), rgba(59,130,246,0) 60%)",
        }}
      />
      {/* Very subtle purple glow */}
      <div
        className="absolute -bottom-40 -right-40 h-[55rem] w-[55rem] rounded-full blur-3xl motion-safe:animate-[aurora_26s_ease-in-out_infinite_reverse]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(124,58,237,0.08), rgba(124,58,237,0) 60%)",
        }}
      />
      {/* Vignette to keep 90% black */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(5,5,5,0.85) 100%)",
        }}
      />
    </div>
  );
};

export default Aurora;
