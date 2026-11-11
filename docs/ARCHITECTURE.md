# Architecture improvements (Phases 3, 5, 6)

## What was added, and why each piece exists

| Piece | Where | Justification |
|---|---|---|
| Lazy asset loader | `assets/va-assets.js` | The bundled Three.js has no GLB, Draco or network code and the source to rebuild it is not available, so loading lives in a separate ES module imported only when a realistic scene opens. Nothing loads at start-up. |
| Vendored loaders | `assets/vendor/` (≈1.6 MB, loaded only with a realistic scene) | Three r160 `GLTFLoader` + `DRACOLoader` + Draco decoder, matching the bundled revision. Chosen over a hand-written decoder to avoid maintaining a glTF parser. |
| Plain-array hand-off | loader returns `{position, normal, index}` typed arrays | The loader's Three copy and the app's bundled Three never exchange objects, so there are no cross-instance class problems. Cost: a console warning "Multiple instances of Three.js" (harmless). |
| Progressive fallback | `Mdigest()` returns the existing primitive scene until the assets are ready, then `__atlas.rebuild()` swaps in the realistic one | Never a blank canvas; works when blocked, offline, or opened from `file://` (tested). |
| Quality-aware LOD | `ts.level` → `digestive.glb` (High) or `digestive_lo.glb` (Balanced, Fast) | 104k vs 42k triangles. |
| Download cache | Cache API `va-assets-v1` + in-memory map | Second visit and offline reuse of the same URL. Only active when served over http(s). |
| Engine hooks | `__atlas.fly()` (camera presets), `__atlas.rebuild()` | Needed for guided camera per stage and the fallback swap. |
| Asset build tool | `tools/build-digestive.mjs` | Reproducible extraction, welding, simplification (meshoptimizer) and Draco compression from named source meshes. |
| Regression script | `tests/regression.js` | Every scene loads, every control clicks, no console errors. |

## Scene features implemented in the pilot (reusable pattern)

Named, selectable meshes with bilingual info cards · isolate-selected · transparent organs · cut-away with clipping plane · exploded view · camera presets and per-stage camera · 11-stage timeline using the engine step player · per-stage label sets and "all labels" · instanced particles with per-instance colour · CPU mesh deformation along a centre line (peristalsis, churning) · rigid jaw with weighted gum deformation · microscopic inset kept separate and labelled · fallback path · disposal verified.

## Not yet done

Skeleton / animation-clip import (no animated asset is needed by the pilot) · KTX2 textures (the pilot uses no image textures; the loader has no KTX2 decoder yet) · service worker for the app shell · a generic `defineRealisticScene()` helper extracted from `Mdigest` (deliberately deferred until a second topic shows what is common).
