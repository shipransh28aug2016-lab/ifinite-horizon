# Testing report (Phase 9) — 2026-11-11

Environment: headless Chromium (Playwright), software WebGL, Linux. **No real phone, no real GPU, no Firefox/Safari, no human reviewer.**

| Check | Result |
|---|---|
| `node tests/regression.js http://localhost:8765/index.html` — 119 scenes load, 479 control clicks | 0 stopped scenes, 0 console errors |
| Same over `file://` (468 clicks, digestive scene uses fallback) | 0 / 0 |
| Class X regression (chapter map, pager, language modes, sections, labels, panels at desktop / tablet / phone widths) | 0 failures |
| Class IX / Advanced functional test (deep links, tabs, counts, practical lab, competency overlay) | 0 failures |
| Digestive scene: loads over HTTP, 11 steps, 23 labels, all 11 stage screenshots | Rendered; no exceptions |
| Asset URL blocked | Falls back to the built-in 7-step scene with an on-screen notice, no errors |
| Opened from `file://` | Falls back with notice, no errors |
| Geometry disposal after eviction | Identical counts with and without the scene |
| Tools in the digestive scene: camera presets, transparent, cut-away, cut plane, exploded, isolate, all labels | Clicked without errors. **Visual effect of each was checked in screenshots for cut-away, explode and presets only**; isolate and transparent were not inspected visually. |

## Known issues

* Console warning "Multiple instances of Three.js being imported" when the loader module is imported (two copies, by design).
* Camera presets use the engine's fly-in, which is slow under software rendering; the final framing could not be judged at full speed.
* Cut-away shows the outer shell clipped; there is no modelled inner lining, so the lumen looks hollow.
* Particle paths inside the small-intestine coil are schematic (the true lumen route is unknown).

## Scientific validation — NOT done

The check against the official CBSE session syllabus and the NCERT textbook was **not performed**: neither document was available in this session, and no subject teacher has reviewed the scene. The stage texts follow the NCERT Class X Chapter 5 wording from memory and from the existing Class X scene. **Status: pending source check and teacher sign-off.** Items for the reviewer:

1. Stage text and Hindi terms (all 11 stages, 23 labels, info cards).
2. Teeth: the model shows 28 (no third molars); the text says so.
3. The small intestine is duodenum + jejunum meshes; the ileum is not separate in the data.
4. Peristalsis and churning amplitudes are exaggerated for visibility.
5. Pancreatic juice and bile paths: the pancreatic duct follows its own mesh; the bile duct is drawn schematically and is labelled.
6. Whether showing the rectum and anal sphincter opening is acceptable for the intended age group.

Each stage is tagged on screen as Anatomical, Conceptual or Microscopic.
