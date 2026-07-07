import React from "react";

// The uploaded official WinsAble logo mark
export const WinsAbleMark = ({ className = "h-6 w-6", alt = "WinsAble" }) => (
  <img
    src="/winsable-logo.png"
    alt={alt}
    draggable={false}
    className={`${className} object-contain select-none`}
    style={{ filter: "drop-shadow(0 0 14px rgba(255,255,255,0.28))" }}
  />
);

// Full wordmark: logo + "WINSABLE"
export const WinsAbleWordmark = ({ className = "" }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <WinsAbleMark className="h-7 w-7" />
    <span className="font-display font-extrabold tracking-[0.02em] text-white text-[15px] uppercase">
      Winsable
    </span>
  </div>
);

export default WinsAbleMark;
