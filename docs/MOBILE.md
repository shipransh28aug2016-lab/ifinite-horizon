# Mobile and performance report (Phase 7)

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

## Open

* Real-device frame rates (entry-level Android, ordinary laptop, projector PC).
* Low-memory behaviour: no test on a device with ≤ 2 GB.
* The "digestive.glb" Draco decode took ~3.4 s in this environment; unknown on a phone. Decoding runs on the main thread (no worker), so the page can stutter while it decodes — worth moving to a worker if the phone test shows it.
* CPU deformation of the oesophagus and stomach (about 9 k vertices, every second frame) is cheap here but untested on phones.
* No offline app shell: the page, scripts and assets are cached only if the loader's Cache API is used; the HTML itself is not.
