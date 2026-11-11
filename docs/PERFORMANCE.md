# Performance report (Phase 7) — target: web browsers and smart boards

Decision (project owner, 2026-11-11): the app runs only on the web and on smart boards / classroom projection PCs. Phone testing and phone-specific work are out of scope and have been removed from the open items below.

All figures come from headless Chromium with **software rendering**. Counts are reliable; frame rate is **not measured** and no real phone was used.

## Digestive scene cost (per frame, includes shadow pass and post-processing)

| Quality | Asset | Draw calls | Triangles |
|---|---|---|---|
| High | `digestive.glb` (394 kB) | 84–88 (123 in the villi inset) | 125–144 k (229 k in the villi inset) |
| Fast | `digestive_lo.glb` (204 kB) | 69–73 (104 in the villi inset) | 53–59 k (97 k in the villi inset) |

Budget set in the build skill: ≤ 5 MB download, ≤ 300 k / 80 k triangles. Met. The villi inset is the heaviest stage at both levels (instanced high-segment lathe villi) and should be reduced before a low-end-phone test.

## Memory

* Visiting the digestive scene and then eight others leaves the same GPU geometry and texture counts (224 / 26) as never visiting it: eviction disposes it.
* JS heap 24 → 44 MB (High) and 22 → 34 MB (Fast) after the digestive scene plus nine others.
* A leak in the Class IX scenes (per-frame arrows) was found by this measurement in Phase 1 and fixed.

## Implemented

Dynamic pixel ratio, auto quality drop, shadow-off on Fast (already in the engine) · lazy loading with a progress bar · cached downloads · LOD by quality level · instanced particles (140 per frame as one draw call) · disposal on eviction · failure fallback.

## Open (web and smart board)

* Frame rate on a real classroom PC / smart-board computer, which is often an older machine with integrated graphics: not measured. The quality switch (High / Balanced / Fast) and the FPS meter exist; the build uses the Fast files on Balanced and Fast.
* Decoding runs on the main thread (≈3 s in software rendering); the page can pause briefly while a realistic scene opens. A worker is possible later if a real board shows a visible stall.
* Touch input on a smart board has not been tested with real hardware (the engine uses pointer events; labels and buttons are the existing large-text-capable UI, A / A+ / A++).
* No offline app shell: the HTML itself is not cached. Assets are cached by the loader once fetched.
