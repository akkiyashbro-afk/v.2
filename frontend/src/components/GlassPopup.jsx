import React, { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Quote,
  Star,
  Mail,
  Globe,
  Calendar,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";
import { reviewsById, genericReview } from "../data/reviews";

/**
 * Resolves the popup content for a given profile.
 * 1. If profile.popupId exists → look up the matching Review.
 * 2. Otherwise → synthesise a generic review from profile fields
 *    so every avatar always opens a coherent popup.
 */
function resolveReviewForProfile(profile) {
  if (!profile) return null;
  if (profile.popupId && reviewsById[profile.popupId]) {
    return reviewsById[profile.popupId];
  }
  return genericReview({
    username: profile.username || "@member",
    platform: profile.platform || "Instagram",
    followers: profile.followers || "—",
    date: profile.recoveryDate || "",
    quote: profile.recoveryType
      ? `${profile.recoveryType} · recovery completed by WinsAble.`
      : "",
  });
}

export const GlassPopup = ({
  profile,
  onClose,
  onPrev,
  onNext,
  onStartRecovery,
}) => {
  useEffect(() => {
    if (!profile) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [profile, onClose, onPrev, onNext]);

  const review = useMemo(() => resolveReviewForProfile(profile), [profile]);

  return (
    <AnimatePresence>
      {profile && review && (
        <motion.div
          data-testid="review-glass-popup"
          role="dialog"
          aria-modal="true"
          aria-label={`Recovery story: ${profile.name || profile.username}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8"
        >
          <div
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-2xl"
          />

          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) onNext();
              else if (info.offset.x > 80) onPrev();
            }}
            initial={{ y: 40, scale: 0.94, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 40, scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-4xl max-h-[92vh] rounded-3xl border border-white/[0.1] bg-[#0D0D0D]/90 backdrop-blur-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] overflow-hidden font-body flex flex-col"
          >
            {/* Soft light halos (white only — palette) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-40 -right-32 h-96 w-96 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.06), transparent 70%)",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.04), transparent 70%)",
              }}
            />

            {/* Top bar */}
            <div className="relative flex items-center justify-between px-6 sm:px-10 pt-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1.5">
                <BadgeCheck
                  className="h-3.5 w-3.5 text-white/90"
                  strokeWidth={2}
                />
                <span className="text-[10px] uppercase tracking-[0.28em] text-white/70 font-medium">
                  Verified Recovery
                </span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="popup-prev"
                  onClick={onPrev}
                  className="h-9 w-9 grid place-items-center rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
                  aria-label="Previous review"
                >
                  <ChevronLeft
                    className="h-4 w-4 text-white"
                    strokeWidth={1.8}
                  />
                </button>
                <button
                  type="button"
                  data-testid="popup-next"
                  onClick={onNext}
                  className="h-9 w-9 grid place-items-center rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
                  aria-label="Next review"
                >
                  <ChevronRight
                    className="h-4 w-4 text-white"
                    strokeWidth={1.8}
                  />
                </button>
                <button
                  type="button"
                  data-testid="popup-close-button"
                  onClick={onClose}
                  className="h-9 w-9 grid place-items-center rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
                  aria-label="Close"
                >
                  <X className="h-4 w-4 text-white" strokeWidth={1.8} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="relative grid md:grid-cols-5 gap-8 md:gap-10 px-6 sm:px-10 py-10 sm:py-12 overflow-y-auto">
              {/* Recovery proof panel */}
              <div className="md:col-span-2 space-y-3">
                <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden aspect-[4/5]">
                  <img
                    src={profile.avatar}
                    alt={profile.name || profile.username}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-medium">
                      Restored account
                    </div>
                    <div className="mt-1 font-display font-extrabold tracking-tight text-white text-xl">
                      {review.username}
                    </div>
                    <div className="mt-1 text-white/60 text-sm">
                      {review.followers} followers · {review.platform}
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-black/50 border border-white/10 px-2 py-1 backdrop-blur-xl">
                    <BadgeCheck
                      className="h-3 w-3 text-white/90"
                      strokeWidth={2.5}
                    />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/85 font-medium">
                      Verified
                    </span>
                  </div>
                </div>

                {/* Proof strip: email + telegram screenshots */}
                {(review.emailScreenshot || review.telegramScreenshot) && (
                  <div className="grid grid-cols-2 gap-2">
                    {review.emailScreenshot && (
                      <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden aspect-square">
                        <img
                          src={review.emailScreenshot}
                          alt="Platform email proof"
                          className="h-full w-full object-cover opacity-90"
                          loading="lazy"
                          draggable={false}
                        />
                        <div className="absolute inset-x-2 bottom-2 flex items-center gap-1.5 rounded-full bg-black/60 border border-white/10 px-2 py-1">
                          <Mail
                            className="h-3 w-3 text-white/80"
                            strokeWidth={1.9}
                          />
                          <span className="text-[9px] uppercase tracking-[0.2em] text-white/85">
                            Platform email
                          </span>
                        </div>
                      </div>
                    )}
                    {review.telegramScreenshot && (
                      <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden aspect-square">
                        <img
                          src={review.telegramScreenshot}
                          alt="Telegram thread"
                          className="h-full w-full object-cover opacity-90"
                          loading="lazy"
                          draggable={false}
                        />
                        <div className="absolute inset-x-2 bottom-2 flex items-center gap-1.5 rounded-full bg-black/60 border border-white/10 px-2 py-1">
                          <MessageCircle
                            className="h-3 w-3 text-white/80"
                            strokeWidth={1.9}
                          />
                          <span className="text-[9px] uppercase tracking-[0.2em] text-white/85">
                            Telegram
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Testimony */}
              <div className="md:col-span-3 flex flex-col">
                <div className="flex items-center gap-1 text-white/85 mb-5">
                  {Array.from({ length: review.rating || 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-current"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <Quote
                  className="h-6 w-6 text-white/20 mb-3"
                  strokeWidth={1.5}
                />
                <p
                  className="font-display font-semibold text-white/95 text-xl sm:text-2xl leading-[1.35]"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  &ldquo;{review.description}&rdquo;
                </p>

                <div className="mt-6">
                  <div className="text-white font-medium tracking-tight text-[15px]">
                    {profile.name || profile.username}
                  </div>
                  <div className="text-white/50 text-sm mt-0.5">
                    {profile.role}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/[0.06] grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Globe
                      className="h-3.5 w-3.5 text-white/40 mt-0.5"
                      strokeWidth={1.8}
                    />
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">
                        Platform
                      </div>
                      <div className="text-white/85 text-[13px] mt-1">
                        {review.platform}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar
                      className="h-3.5 w-3.5 text-white/40 mt-0.5"
                      strokeWidth={1.8}
                    />
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">
                        Recovery date
                      </div>
                      <div className="text-white/85 text-[13px] mt-1">
                        {review.date}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onStartRecovery}
                  data-testid="popup-recover-cta"
                  className="mt-8 group relative inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/[0.14] hover:border-white/40 px-5 py-3 text-[13px] font-medium text-white overflow-hidden transition-all self-start"
                >
                  <span className="relative">Start your recovery case</span>
                  <ArrowUpRight
                    className="relative h-3.5 w-3.5"
                    strokeWidth={2}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlassPopup;
