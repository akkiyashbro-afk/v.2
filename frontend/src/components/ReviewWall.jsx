import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Quote, Star } from "lucide-react";
import { recoveredProfiles } from "../data/recoveredProfiles";
import { reviewsById, genericReview } from "../data/reviews";

const chunk = (arr, n) => {
  const out = Array.from({ length: n }, () => []);
  arr.forEach((item, i) => out[i % n].push(item));
  return out;
};

// Merge each profile with its (bespoke or synthesised) review so the wall
// stays fully data-driven.
const buildWallItems = () =>
  recoveredProfiles.map((profile) => {
    const review =
      (profile.popupId && reviewsById[profile.popupId]) ||
      genericReview({
        username: profile.username,
        platform: profile.platform,
        followers: profile.followers,
        date: profile.recoveryDate,
        quote: `${profile.recoveryType} · recovered by WinsAble in ${profile.recoveryDate}.`,
      });
    return { profile, review };
  });

const Card = ({ item, onClick }) => {
  const { profile, review } = item;
  return (
    <button
      type="button"
      data-testid="review-card"
      onClick={() => onClick(profile)}
      className="w-full text-left rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-5 hover:border-white/25 hover:bg-white/[0.04] transition-all duration-500 group focus:outline-none focus:ring-2 focus:ring-white/40 font-body"
    >
      <div className="flex items-start gap-3">
        <img
          src={profile.avatar}
          alt=""
          aria-hidden="true"
          loading="lazy"
          draggable={false}
          className="h-10 w-10 rounded-xl object-cover border border-white/10"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-white truncate">
              {profile.name || profile.username}
            </span>
            <BadgeCheck
              className="h-3.5 w-3.5 text-white/85 flex-shrink-0"
              strokeWidth={2.2}
            />
          </div>
          <div className="text-[11px] text-white/45 mt-0.5 truncate">
            {profile.role || profile.username}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-0.5 text-white/85 mt-4 mb-2">
        {Array.from({ length: review.rating || 5 }).map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-current" strokeWidth={0} />
        ))}
      </div>

      <Quote className="h-4 w-4 text-white/20 mb-2" strokeWidth={1.5} />
      <p className="text-sm text-white/75 leading-relaxed">
        {review.description}
      </p>

      <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
          {review.platform} · {review.followers}
        </span>
        <span className="text-[10px] text-white/40">{profile.recoveryDate}</span>
      </div>
    </button>
  );
};

const Column = ({ items, direction, onClick, paused }) => {
  const list = useMemo(() => [...items, ...items], [items]);
  return (
    <div className="relative h-full overflow-hidden">
      <motion.div
        className="flex flex-col gap-5"
        animate={
          paused
            ? {}
            : { y: direction > 0 ? ["0%", "-50%"] : ["-50%", "0%"] }
        }
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {list.map((it, i) => (
          <Card key={`${it.profile.id}-${i}`} item={it} onClick={onClick} />
        ))}
      </motion.div>
    </div>
  );
};

export const ReviewWall = ({ onOpen }) => {
  const [paused, setPaused] = useState(false);
  const items = useMemo(() => buildWallItems(), []);
  const columns = useMemo(() => chunk(items, 4), [items]);

  return (
    <section
      id="reviews"
      data-testid="review-wall-section"
      className="relative overflow-hidden py-28 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div className="max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.35em] text-white/40 font-body font-medium">
              Signed testimonials
            </span>
            <h2
              className="mt-4 font-display font-black text-[36px] md:text-[54px] leading-[1.02] text-white"
              style={{ letterSpacing: "-0.04em" }}
            >
              The wall of quiet
              <br />
              <span className="text-white/50">wins.</span>
            </h2>
          </div>
          <p className="text-white/50 text-[15px] leading-[1.75] max-w-md font-body">
            Every card below is a real digital identity we restored — verified
            by our recovery officers and signed by the client.
          </p>
        </div>

        <div
          data-testid="review-masonry-grid"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative h-[720px] grid grid-cols-2 lg:grid-cols-4 gap-5"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
          }}
        >
          {columns.map((col, idx) => (
            <Column
              key={idx}
              items={col}
              direction={idx % 2 === 0 ? 1 : -1}
              onClick={onOpen}
              paused={paused}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewWall;
