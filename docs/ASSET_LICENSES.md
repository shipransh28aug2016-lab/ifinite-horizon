# Asset Licence Register — Vigyan Atlas

**Rule:** no 3D model, texture, image, audio, or code snippet is adopted into the app until it has one row here, the licence text has been read by a person, and the owner has cleared commercial use (if the app is ever sold/bundled, non-commercial assets are prohibited — see docs/AUDIT.md §11 Q2).

Status today: **partially populated.** No external 3D model, texture, image, audio, or code snippet has been adopted from outside the repo. All `public/2d/**/images/*.png` files are AI-generated in-session by the agent (no external asset, no external licence). Three.js r160 in `public/lib/` is from npm `three@0.160.0` (MIT).

| Asset | Source repo | Licence (GitHub field) | Licence text read? | Origin traced to author? | Cleared for app? | Date | Notes |
|-------|-------------|------------------------|--------------------|--------------------------|------------------|------|-------|
| 2D AI images — Class IX Biology (20 images) | In-session generation (this repo) | AI generation tool terms | N/A — generated in-session, no external asset adopted | N/A — created by agent in-session | Yes, per generation tool terms (re-verify before any commercial sale/bundle) | 2026-11-11 | public/2d/class9/biology/images/ |
| 2D AI images — Class X Biology (15 images) | In-session generation (this repo) | AI generation tool terms | N/A — generated in-session, no external asset adopted | N/A — created by agent in-session | Yes, per generation tool terms (re-verify before any commercial sale/bundle) | 2026-11-11 | public/2d/class10/biology/images/ |
| 2D AI images — Class IX Chemistry (7 images) | In-session generation (this repo) | AI generation tool terms | N/A — generated in-session, no external asset adopted | N/A — created by agent in-session | Yes, per generation tool terms (re-verify before any commercial sale/bundle) | 2026-11-11 | public/2d/class9/chemistry/images/ |
| 2D AI images — Class X Chemistry (10 images) | In-session generation (this repo) | AI generation tool terms | N/A — generated in-session, no external asset adopted | N/A — created by agent in-session | Yes, per generation tool terms (re-verify before any commercial sale/bundle) | 2026-11-11 | public/2d/class10/chemistry/images/ |
| Three.js r160 + addons | npm `three@0.160.0` | MIT | Yes (MIT, npm registry) | Yes (npm / mrdoob/three) | Yes | 2026-11-11 | public/lib/ |

How to add a row:
1. Open the candidate repository (needs it attached read-only, or owner's go-ahead).
2. Read the LICENCE file. "None" = all rights reserved; "NOASSERTION" = read the file text personally.
3. Trace each model to its original author and terms (asset pages often carry their own licence).
4. Fill one row per adopted asset; keep a copy of the licence text in `docs/licences/<asset-name>/` if possible.
