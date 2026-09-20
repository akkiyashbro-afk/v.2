/**
 * Recovery Case Reviews — the "proof" content shown when a profile is opened.
 *
 * Each review is looked up by `id` via `Profile.popupId → Review.id`.
 * To replace real customer proof, only edit this file — no components need
 * to change.
 *
 * @typedef {Object} Review
 * @property {string}   id                 - Stable identifier, referenced by profiles.popupId
 * @property {string}   username           - Handle displayed at the top of the popup
 * @property {string}   platform           - e.g. "Instagram", "TikTok"
 * @property {string}   followers          - Free-form follower count string
 * @property {boolean}  verified           - Whether to render a verified badge
 * @property {string}   date               - Recovery completion date (display string)
 * @property {string[]} images             - Auxiliary screenshots (e.g. profile screens)
 * @property {string=}  emailScreenshot    - URL/import path of the platform email screenshot
 * @property {string=}  telegramScreenshot - URL/import path of a Telegram conversation screenshot
 * @property {string}   description        - Long-form testimonial or case summary
 * @property {string}   rating             - Optional star rating (1–5)
 */

// Placeholder screenshot pool. Replace files in /src/assets/reviews/ or swap URLs.
const P = (seed) =>
  `https://images.unsplash.com/photo-${seed}?w=1200&auto=format&fit=crop&q=80`;

/** @type {Review[]} */
export const reviews = [
  {
    id: "review-amelia-chen",
    username: "@amelia.builds",
    platform: "Instagram",
    followers: "86.2K",
    verified: true,
    date: "Jun 3, 2026",
    images: [P("1517841905240-472988babdf9"), P("1544005313-94ddf0286df2")],
    emailScreenshot: P("1568992687947-868a62a9f521"),
    telegramScreenshot: P("1611746872915-64382b5c76da"),
    description:
      "They didn't just recover my account — they restored a decade of brand equity. Calm, forensic, relentless.",
    rating: 5,
  },
  {
    id: "review-marcus-alvarez",
    username: "@marcus.builds",
    platform: "YouTube",
    followers: "240K",
    verified: true,
    date: "May 28, 2026",
    images: [P("1507003211169-0a1dd7228f2d")],
    emailScreenshot: P("1587560699334-cc4ff634909a"),
    telegramScreenshot: P("1611746872915-64382b5c76da"),
    description:
      "I had lost hope after 3 weeks of automated support. WinsAble had me back online in under a week.",
    rating: 5,
  },
  {
    id: "review-priya-raman",
    username: "@priya.frames",
    platform: "Instagram",
    followers: "128K",
    verified: true,
    date: "Jun 12, 2026",
    images: [P("1544005313-94ddf0286df2")],
    emailScreenshot: P("1587560699334-cc4ff634909a"),
    telegramScreenshot: P("1611746872915-64382b5c76da"),
    description:
      "Discreet, encrypted, human. My clients never even knew there was an incident.",
    rating: 5,
  },
  {
    id: "review-daniel-okoye",
    username: "@d.okoye",
    platform: "LinkedIn",
    followers: "45.1K",
    verified: true,
    date: "May 20, 2026",
    images: [P("1531123897727-8f129e1688ce")],
    emailScreenshot: P("1587560699334-cc4ff634909a"),
    telegramScreenshot: P("1611746872915-64382b5c76da"),
    description:
      "Precision engineering behind every step. This is what digital recovery should look like in 2026.",
    rating: 5,
  },
  {
    id: "review-sofia-lindgren",
    username: "@sofia.writes",
    platform: "X / Twitter",
    followers: "312K",
    verified: true,
    date: "Jun 18, 2026",
    images: [P("1524504388940-b1c1722653e1")],
    emailScreenshot: P("1587560699334-cc4ff634909a"),
    telegramScreenshot: P("1611746872915-64382b5c76da"),
    description:
      "48 hours from panic to peace. I've never seen a private team move with such clarity.",
    rating: 5,
  },
];

// Fallback used by profiles that don't yet have a bespoke review authored.
export const genericReview = ({
  username = "@member",
  platform = "Instagram",
  followers = "—",
  date = "2026",
  quote = "",
}) => ({
  id: "review-generic",
  username,
  platform,
  followers,
  verified: true,
  date,
  images: [],
  emailScreenshot: undefined,
  telegramScreenshot: undefined,
  description:
    quote || "Extraordinary attention to detail. Recovery, done right.",
  rating: 5,
});

// Fast lookup map by id
export const reviewsById = reviews.reduce((acc, r) => {
  acc[r.id] = r;
  return acc;
}, {});

export default reviews;
