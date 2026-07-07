# Profile avatars

Drop profile images here (e.g. `p-001.jpg`, `amelia.jpg`) and reference
them from `/src/data/recoveredProfiles.js`:

```js
import ameliaAvatar from "@/assets/profiles/amelia.jpg";

export const recoveredProfiles = [
  {
    id: "p-001",
    avatar: ameliaAvatar,
    // …
  },
];
```

The `avatar` field can also hold a remote URL — both work.
