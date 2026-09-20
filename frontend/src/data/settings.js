// Central configuration for the Recovery Galaxy orbit system.
// Change these values to tune the entire orbit experience — no component
// code should ever need to be modified.
//
// NOTE: `avatarSize` is a CSS size hint; the actual avatar element uses
// `clamp(40px, 4vw, avatarSize)` so it stays responsive on mobile.

export const orbitSettings = {
  // How many profiles orbit on each ring.
  // The Orbit component reads these to distribute avatars evenly.
  ring1Count: 8,
  ring2Count: 12,
  ring3Count: 16,

  // Rotation speed in "rotations per minute" units (higher = faster).
  // 1.0 ≈ one full rotation per 60 seconds. Ring 2 orbits in reverse.
  ring1Speed: 1.2,
  ring2Speed: 0.8,
  ring3Speed: 0.5,

  // Rotation direction: 1 = clockwise, -1 = counter-clockwise
  ring1Direction: 1,
  ring2Direction: -1,
  ring3Direction: 1,

  // Ring diameters (px) at desktop resolution. Component clamps to viewport.
  ring1Diameter: 320,
  ring2Diameter: 540,
  ring3Diameter: 780,

  // Interaction
  avatarSize: 56, // Desktop max — CSS clamp scales down on mobile
  pauseOnHover: true,
  glowOnHover: true,
  hoverIntentDelayMs: 220, // Delay before tooltip is dismissed on unhover
};

export default orbitSettings;
