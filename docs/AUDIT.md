# Phase 1 — Repository audit (Infinite Horizon / Vigyan Atlas v2.0)

Audit date 2026-11-11. Nothing in the app was changed to produce this report.
Measurements were taken in headless Chromium with **software rendering (SwiftShader)** on a scratch copy of `index.html` with a read-only probe added. They are valid for counts (draw calls, triangles, objects) and **not** for frame rate.

## 1. Project structure

| File | Size | Note |
|---|---|---|
| `index.html` | 1,502,085 bytes | The whole app: CSS, HTML shell, one minified bundle (Three.js + app + Class IX/Advanced scenes), two readable add-on scripts |
| `docs/CLASS9_COVERAGE.md`, `docs/class9-coverage.json` | 7 kB, 12 kB | Class IX coverage report |
| `package.json` | 289 bytes | Name and version only; no dependencies, no build |
| `vercel.json` | 1,133 bytes | `outputDirectory: "public"` — **no such folder exists**; headers for `/sw.js` and `/manifest.webmanifest`, which are also absent |
| `DEPLOY.md` | 1,082 bytes | Refers to a `vercel/` folder and `tools/make-vercel.sh` that are not in this repository |
| `.github/workflows/jekyll-docker.yml` | 476 bytes | A Jekyll build on `main`; unrelated to this static file |

- **Build situation:** only a built bundle. The original source and build script are not here. Every change so far has been patched into the built file.
- **Offline:** the page makes no external requests (no CDN, no web fonts). It registers a service worker only if a `<link rel="manifest">` exists and the page is on HTTPS; there is no manifest link and no `sw.js`, so **there is no offline cache when hosted**. It works offline only when the file itself is saved locally.
- **No binary assets** of any kind: no models, textures, images or audio files. Textures are drawn on canvases at run time.

## 2. Three.js and rendering

| Item | Finding |
|---|---|
| Revision | **r160** (`window.__THREE__ = "160"`), bundled inside an IIFE — `THREE` is not a global |
| Context | WebGL 2 |
| Renderer | antialias on; ACES-style tone mapping, exposure 1.05; sRGB output; shadow maps on, one 1024² directional shadow per scene |
| Post-processing | EffectComposer: render pass → bloom pass → output pass. Bloom is switched off below the High level |
| Environment | A generated environment map for reflections (inferred from a `fromScene` call; class names are minified) |
| Controls | OrbitControls with damping; idle auto-rotate |
| Quality levels | High: pixel ratio ≤ 2, shadows, bloom · Balanced: ≤ 1.25, shadows · Fast: 1, no shadows. Auto drops one level if the average is under 32 fps over 90 frames; starts at Balanced on touch devices or ≤ 4 cores / ≤ 4 GB |
| Scene lifetime | Built on first visit; six scenes cached; older ones disposed. A scene that throws is stopped and an error card is shown |

## 3. Loaders and animation system — what a realistic pipeline is missing

| Capability | In bundle? |
|---|---|
| GLTFLoader | **No** |
| DRACOLoader / Meshopt decoder | **No** |
| KTX2Loader / Basis transcoder | **No** |
| AnimationMixer / AnimationClip | **No** (tree-shaken out) |
| SkinnedMesh support in renderer | Yes (shader paths present) |
| InstancedMesh | Yes |
| LOD class | Not exported for use (one internal reference) |
| Any network loading (`fetch`, caches) | **No** |

Consequence: imported models need a loader, a decoder, an animation mixer and a fetch/caching layer added. These must be compiled against r160 and cannot share the bundled Three.js unless the bundle exposes it — the cleanest route is a second, lazily loaded module that receives the engine's classes, or a rebuild from source. **This is the main architectural decision of the upgrade and needs the owner's answer on where the source is.**

## 4. Scene inventory — 118 scenes

Class X 65 · Class IX compulsory 37 · Class IX Advanced 16. 34 are step-based, 84 are explore-mode; 53 have selectable parts. **Every scene is built from primitives** (spheres, boxes, cylinders, cones, tori, lathes, tubes). None uses an imported mesh, a texture map from a file, a skeleton or an animation clip.

Classification: **36** would benefit from realism · **80** are correctly schematic · **2** carry a risk of teaching something wrong.

| Scene | Mode | Labels | Tools | Selectable | Draw calls | Triangles / frame | Class | Evidence |
|---|---|---|---|---|---|---|---|---|
| `ch1/displacement` | explore | 5 | 3 | 0 | 81 | 114,141 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch1/balancing` | explore | 2 | 5 | 3 | 43 | 32,107 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch1/combination` | explore | 5 | 5 | 0 | 32 | 41,051 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch1/redox` | steps 5 | 4 | 0 | 4 | 45 | 40,725 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch1/corrosion` | explore | 3 | 3 | 0 | 44 | 26,635 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch2/ph` | explore | 7 | 2 | 12 | 114 | 41,647 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch2/acidrx` | steps 5 | 9 | 0 | 9 | 69 | 66,697 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch2/indicators` | explore | 2 | 6 | 2 | 29 | 4,283 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch2/neutralisation` | explore | 3 | 2 | 0 | 58 | 61,979 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch2/salts` | explore | 6 | 2 | 5 | 94 | 19,483 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch3/physical` | explore | 3 | 6 | 1 | 9 | 179 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch3/ionic` | steps 6 | 6 | 0 | 6 | 79 | 139,791 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch3/reactivity` | explore | 3 | 8 | 0 | 56 | 2,545 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch3/extraction` | explore | 4 | 4 | 0 | 21 | 507 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch3/prevent` | explore | 5 | 3 | 0 | 19 | 299 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch4/covalent` | steps 4 | 4 | 0 | 2 | 18 | 23,895 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch4/allotropes` | explore | 5 | 4 | 0 | 305 | 56,323 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch4/homologous` | explore | 2 | 10 | 0 | 47 | 48,611 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch4/molecules` | explore | 3 | 6 | 5 | 23 | 22,179 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch4/ethanol` | steps 6 | 8 | 0 | 8 | 135 | 138,051 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch4/micelle` | steps 5 | 4 | 0 | 4 | 17 | 8,647 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch4/reactions` | explore | 2 | 5 | 0 | 40 | 39,781 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch5/heart` | explore | 8 | 2 | 7 | 98 | 244,979 | Realism would help | Chambers are four spheres inside one ellipsoid; vessels are tubes |
| `ch5/digestion` | steps 7 | 10 | 0 | 10 | 30 | 35,709 | Risk of misleading | Small intestine drawn as a short flat coil; organs are ellipsoids; no teeth, tongue, pharynx, rectum |
| `ch5/alveoli` | explore | 5 | 2 | 0 | 298 | 268,771 | Realism would help | Lungs and airways from spheres and tubes; alveoli inset is conceptual |
| `ch5/nephron` | steps 5 | 5 | 0 | 5 | 108 | 225,183 | Realism would help | Tubule is a single bent tube; capsule is a cut sphere |
| `ch5/xylem` | explore | 5 | 4 | 0 | 79 | 54,063 | Realism would help | Plant is a cylinder with flat leaves |
| `ch6/reflex` | steps 8 | 9 | 0 | 0 | 65 | 67,739 | Realism would help | Arm and cord are primitives; pathway itself is fine as a diagram |
| `ch6/neuron` | steps 6 | 5 | 0 | 35 | 66 | 50,451 | Realism would help | Soma sphere with tube dendrites |
| `ch6/synapse` | steps 6 | 4 | 0 | 4 | 58 | 41,335 | Realism would help | Bulb and cleft are spheres; acceptable as a magnified concept |
| `ch6/brain` | explore | 8 | 4 | 10 | 23 | 82,611 | Realism would help | Lobes are scaled ellipsoids; no gyri |
| `ch6/plants` | explore | 5 | 9 | 78 | 16 | 8,245 | Realism would help | Seedling is tubes |
| `ch6/hormones` | explore | 8 | 6 | 17 | 61 | 103,395 | Realism would help | Body outline with glowing spheres for glands |
| `ch7/human` | steps 6 | 12 | 0 | 12 | 51 | 44,787 | Realism would help | Reproductive organs as tubes and ellipsoids; labelled schematic |
| `ch7/fission` | steps 5 | 4 | 0 | 4 | 32 | 54,979 | Realism would help | Amoeba is a deformed sphere |
| `ch7/budding` | steps 4 | 3 | 0 | 3 | 18 | 6,887 | Realism would help | Hydra is a lathe shape with tube tentacles |
| `ch7/vegetative` | steps 4 | 3 | 0 | 3 | 90 | 133,271 | Realism would help | Leaf is a flat disc |
| `ch7/flower` | steps 5 | 9 | 0 | 9 | 73 | 97,231 | Realism would help | Petals and pistil from primitives |
| `ch8/mendel` | steps 5 | 4 | 0 | 4 | 24 | 861 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch8/dihybrid` | steps 4 | 4 | 0 | 4 | 57 | 62,111 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch8/sex` | steps 5 | 5 | 0 | 5 | 98 | 103,391 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch8/evolution` | steps 6 | 2 | 0 | 2 | 491 | 249,003 | Realism would help | Beetles are ellipsoids |
| `ch9/reflection` | explore | 7 | 3 | 0 | 170 | 16,763 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch9/optics` | explore | 3 | 4 | 0 | 38 | 34,971 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch9/slab` | explore | 5 | 4 | 0 | 50 | 3,433 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch9/power` | explore | 2 | 6 | 0 | 45 | 25,103 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch10/eyeparts` | steps 5 | 10 | 0 | 10 | 49 | 35,739 | Realism would help | Eye is nested spheres; lens and cornea not shaped |
| `ch10/eye` | explore | 7 | 5 | 7 | 25 | 34,227 | Realism would help | Same eye primitives |
| `ch10/prism` | explore | 4 | 1 | 0 | 36 | 1,927 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch10/scatter` | explore | 3 | 3 | 0 | 73 | 59,259 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch11/ohm` | explore | 6 | 8 | 0 | 71 | 51,039 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch11/resistance` | explore | 4 | 9 | 0 | 25 | 12,863 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch11/series` | explore | 4 | 3 | 0 | 42 | 34,517 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch11/heating` | explore | 3 | 5 | 0 | 33 | 46,093 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch12/magnet` | explore | 5 | 4 | 0 | 67 | 63,959 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch12/field` | explore | 4 | 6 | 0 | 113 | 76,815 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch12/induction` | explore | 4 | 6 | 0 | 25 | 16,579 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch12/solenoid` | explore | 4 | 4 | 0 | 106 | 54,783 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch12/flhr` | explore | 3 | 4 | 0 | 48 | 9,333 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch12/domestic` | explore | 3 | 4 | 20 | 99 | 26,059 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch12/motor` | explore | 4 | 3 | 0 | 44 | 20,953 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch13/pyramid` | steps 6 | 7 | 0 | 7 | 282 | 55,395 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch13/web` | explore | 2 | 2 | 22 | 445 | 85,649 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch13/ozone` | steps 5 | 4 | 0 | 4 | 98 | 183,073 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ch13/waste` | explore | 3 | 2 | 0 | 57 | 40,967 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix1/cell` | explore | 16 | 4 | 48 | 27 | 44,771 | Realism would help | Organelles are ellipsoids; ER is two tubes; no cristae, grana or nuclear pores |
| `ix1/osmosis` | explore | 5 | 6 | 0 | 202 | 48,575 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix1/division` | steps 7 | 7 | 0 | 7 | 30 | 6,071 | Realism would help | Chromosomes are cylinders; spindle not shown |
| `ix2/tissues` | explore | 12 | 2 | 284 | 329 | 150,371 | Realism would help | Each tissue is a small cluster of boxes, spheres or cylinders |
| `ix2/joint` | explore | 9 | 5 | 0 | 16 | 9,599 | Risk of misleading | Elbow is two straight cylinders; biceps and triceps are ellipsoids not attached to bone |
| `ix2/xylem` | explore | 5 | 4 | 0 | 79 | 54,063 | Realism would help | Re-used ch5/xylem |
| `ix3/fission` | steps 5 | 4 | 0 | 4 | 32 | 54,979 | Realism would help | Re-used |
| `ix3/budding` | steps 4 | 3 | 0 | 3 | 18 | 6,887 | Realism would help | Re-used |
| `ix3/vegetative` | steps 4 | 3 | 0 | 3 | 90 | 133,271 | Realism would help | Re-used |
| `ix3/flower` | steps 5 | 9 | 0 | 9 | 73 | 97,231 | Realism would help | Re-used ch7/flower |
| `ix3/dispersal` | explore | 5 | 4 | 0 | 54 | 64,871 | Realism would help | Plant, seeds and animal are boxes and spheres |
| `ix3/human` | steps 6 | 12 | 0 | 12 | 51 | 44,787 | Realism would help | Re-used ch7/human |
| `ix4/kingdoms` | explore | 16 | 2 | 14 | 68 | 78,419 | Realism would help | Kingdom icons are two or three primitives each |
| `ix4/acellular` | explore | 8 | 3 | 0 | 129 | 134,115 | Realism would help | Virus is an octahedron with pins; lichen is a box with dots |
| `ix5/types` | explore | 5 | 4 | 0 | 136 | 33,899 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix5/lab` | explore | 19 | 9 | 0 | 32 | 11,645 | Realism would help | Glassware is cylinders and cones; real apparatus shapes would help practical work |
| `ix5/conc` | explore | 3 | 8 | 0 | 14 | 2,171 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix6/atom` | explore | 7 | 8 | 0 | 44 | 12,659 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix6/models` | steps 5 | 10 | 0 | 10 | 17 | 5,851 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix7/conserve` | explore | 5 | 3 | 0 | 30 | 10,835 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix7/molecules` | explore | 2 | 11 | 0 | 15 | 13,283 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix7/ionic` | steps 6 | 6 | 0 | 6 | 79 | 139,791 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix7/covalent` | steps 4 | 4 | 0 | 2 | 18 | 23,895 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix8/spheres` | explore | 5 | 5 | 3 | 81 | 58,419 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix8/spectrum` | explore | 7 | 8 | 7 | 39 | 8,675 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix8/heating` | explore | 4 | 9 | 0 | 22 | 7,055 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix8/breeze` | explore | 5 | 4 | 0 | 102 | 23,855 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix8/cycles` | explore | 27 | 5 | 0 | 46 | 45,091 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix9/line` | explore | 4 | 6 | 0 | 35 | 827 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix9/circular` | explore | 4 | 6 | 0 | 17 | 2,843 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix10/forces` | explore | 5 | 12 | 0 | 13 | 467 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix10/trolley` | explore | 4 | 4 | 0 | 21 | 995 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix11/energy` | explore | 7 | 8 | 0 | 41 | 2,003 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix11/machines` | explore | 7 | 13 | 0 | 15 | 365 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix12/source` | explore | 4 | 7 | 0 | 89 | 20,339 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix12/wave` | explore | 6 | 8 | 0 | 975 | 242,395 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `ix12/echo` | explore | 5 | 6 | 0 | 14 | 1,515 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `adv1/measure` | explore | 11 | 7 | 12 | 19 | 299 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `adv2/frame` | explore | 9 | 12 | 0 | 27 | 1,043 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `adv3/pseudo` | explore | 6 | 9 | 0 | 14 | 1,007 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `adv3/gravity` | explore | 6 | 10 | 0 | 13 | 7,235 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `adv4/machines` | explore | 8 | 11 | 0 | 20 | 2,491 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `adv5/spring` | explore | 6 | 10 | 0 | 14 | 3,683 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `adv6/rays` | explore | 17 | 5 | 0 | 42 | 7,399 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `adv6/spectrum` | explore | 4 | 9 | 0 | 15 | 899 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `adv6/models` | steps 5 | 10 | 0 | 10 | 17 | 5,851 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `adv7/bonding` | explore | 6 | 8 | 0 | 10 | 1,141 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `adv8/column` | explore | 4 | 4 | 0 | 42 | 26,219 | Realism would help | Glassware primitives |
| `adv8/fractional` | explore | 12 | 4 | 0 | 48 | 13,589 | Realism would help | Glassware primitives |
| `adv9/microscope` | explore | 12 | 6 | 15 | 39 | 5,819 | Realism would help | Microscope built from boxes and cylinders; a real instrument model would teach the parts better |
| `adv9/resolution` | explore | 3 | 8 | 0 | 11 | 1,163 | Schematic is right | Diagram, graph, particle or apparatus concept; primitives convey it correctly |
| `adv10/fermenter` | explore | 8 | 4 | 0 | 82 | 14,027 | Realism would help | Vessel and fittings are cylinders |
| `adv10/insulin` | steps 7 | 8 | 0 | 8 | 21 | 8,931 | Realism would help | DNA is two sine tubes; bacterium is an ellipsoid |

Draw calls and triangles include the shadow pass and post-processing. Median: 44 draw calls, 32,107 triangles per frame.

## 5. Performance findings

| Finding | Evidence | Severity |
|---|---|---|
| **GPU memory leak in Class IX / Advanced scenes added in v2.0** | Geometry count grows while a scene is simply left open: `ix9/circular` 225 → 695 in 8 s, `ix10/forces` 905 → 1,641, `adv3/pseudo` 1,742 → 2,078, `ix11/machines` 2,205 → 2,629. Cause: arrows, ropes and springs are rebuilt every frame and the old geometry is never disposed. Class X scenes are stable (`ch5/digestion`, `ch5/heart`: no growth) | High — **fixed 2026-11-11**: per-frame geometry is now disposed; the same scenes hold a constant count over 8 s (e.g. `ix9/circular` 80 → 80, `ix10/forces` 89 → 89) |
| Too many draw calls in some scenes | `ix12/wave` 975, `ch8/evolution` 491, `ch13/web` 445, `ix2/tissues` 329, `ch4/allotropes` 305, `ch5/alveoli` 298. `ix12/wave` draws 480 separate spheres twice (colour + shadow) — should be one instanced mesh | Medium |
| High triangle counts from over-tessellated spheres | `ch5/alveoli` 268,771, `ch8/evolution` 249,003, `ch5/heart` 244,979 triangles per frame: the shared ellipsoid helper uses 40 × 28 segments for every sphere | Medium on phones |
| Graph textures redrawn every frame | Class IX motion, trolley, spring, spectrum, fermenter and resolution scenes repaint a canvas and re-upload it each frame even when nothing changed | Low–medium |
| JS heap | 13 MB at start, 17–45 MB while visiting all 118 scenes; returns toward baseline, so no JS-side leak was seen | OK |
| Load | ~2.7 s to interactive from local file in this environment; 1.5 MB single file, all code parsed up front | OK; will not scale to binary assets |
| Frame rate | **Not measured** — software rendering only. Needs a real phone and a real laptop | Open |

## 6. Working features that must survive

Three class tabs and their progress · bilingual labels and the EN / हिं / both switch · step player, predict-first cards, quizzes, “Test yourself” · student report codes and the teacher dashboard · quality switch, FPS meter and device test · collapsible panels and sections · chapter map (Class X) and syllabus panels (Class IX) · virtual practical lab and competency reference · deep links by `#key` · keyboard shortcuts · light theme and large-text modes.

## 7. Current limitations

1. No source tree: the engine cannot be rebuilt, tree-shaken or extended cleanly.
2. No asset pipeline at all (section 3).
3. No real offline support when hosted, and hosting config that does not match the repository.
4. All anatomy is symbolic; two scenes are simplified enough to risk a wrong picture (digestive system, elbow joint).
5. No isolate, transparency, cross-section or exploded-view system shared across scenes; `ix1/cell` has its own explode, `ch6/brain` its own cut-open.
6. No timeline scrubber — only step buttons and play/pause.
7. A memory leak in the newest scenes.
8. No automated tests in the repository (the headless checks used so far live outside it).

## 8. Reusable components

Scene contract (labels, steps or explore, tools, pickables, draggables, predict, quiz) · label placement with leader lines and collision avoidance · step state machine · HUD · quality manager · scene cache and disposal · physical material presets (glass, liquid, metal, tissue) · particle-flow helper · molecule builder · in-scene graph panels (Class IX) · progress store and report codes.

## 9. Missing scientific assets (for the pilot and the next topics)

Digestive tract with separate organ meshes including oral cavity, teeth, tongue, salivary glands, pharynx, rectum · villi at microscopic scale · heart with chambers and valves · lungs and bronchial tree · kidney and nephron · brain · eye · neuron · plant and animal cells with organelle detail · skeleton and major joints · flower · laboratory glassware set · compound microscope.

## 10. Recommended sequence

1. ~~Fix the v2.0 leak and add the regression script to the repository.~~ Done: see `tests/regression.js`.
2. Owner decision: locate the original source, or accept a second lazily loaded module for the asset pipeline.
3. Finish Phase 2: inspect the candidate repositories’ files and trace each model’s origin (metadata pass is in `REPO_SHORTLIST.md`).
4. Phase 3: loader service, manifest, fallback path, licence record — proven with one small openly licensed model before any anatomy.
5. Phase 4: digestive system pilot, keeping `ch5/digestion` as the fallback.
6. Phases 7–9 on the pilot, with a teacher’s review, before a second topic.
7. Fix hosting: make `vercel.json` match the repository and add a real service worker, or offline use will break as soon as assets are external files.

## 11. Open questions for the owner

1. Where are the original source and `tools/make-vercel.sh`? Can they be added to this repository?
2. Is the app, or any version of it, sold or bundled commercially? This decides whether non-commercial assets can be used at all.
3. What is the lowest-end Android device it must run on, and is there one available for testing?
4. What is the acceptable download size for one realistic lesson on school connectivity?
5. Who is the subject teacher who will sign off the digestive pilot?
6. Is Blender modelling by a person available, or must every asset be sourced?
