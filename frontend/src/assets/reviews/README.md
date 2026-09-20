# Review screenshots

Drop platform / email / Telegram screenshots here and reference them from
`/src/data/reviews.js`:

```js
import ameliaEmail from "@/assets/reviews/amelia-email.png";
import ameliaTelegram from "@/assets/reviews/amelia-telegram.png";

export const reviews = [
  {
    id: "review-amelia-chen",
    emailScreenshot: ameliaEmail,
    telegramScreenshot: ameliaTelegram,
    images: [
      require("./amelia-profile-1.png"),
      require("./amelia-profile-2.png"),
    ],
    // …
  },
];
```

Any URL or file import is supported.
