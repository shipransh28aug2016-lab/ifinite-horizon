# 🚀 Realism Enrichment Roadmap — Class IX & X Science Visuals

**App:** Vigyan Atlas (this repo, branch `arena/eae64aa8-ifinite-horizon`)  
**Goal:** Every science subject (Physics, Chemistry, Biology) of Class IX and Class X should feel like "vastav mein virtually dekh pa raha hai" — with Biology ultra-realistic, like a doctor viewing inside the body during surgery.  
**Style toggle per lesson:** Schematic (today) → Anime/animation (cel shading, outlines, motion lines) → Ultra-realistic (PBR tissue, surgical light, live cross-section slice, isolate organ).  
**Baseline audit:** see `docs/VISUAL_AUDIT_REPORT.md`. Nothing was changed to produce this plan.

---

## Guiding principles

1. **Visuals only** — the learning contract (labels, steps, tools, pickables, predict-first cards, quizzes, bilingual EN/हिंदी/both, progress, reports) stays identical.
2. **Style toggle** per scene: Schematic / Anime / Ultra-realistic. Anime for clarity & motion (waves, rays, electron flow); Ultra-realistic for anatomy (heart, digestion, neuron, eye, joints).
3. **Biology first** — the user's pain point; pilot = `ch5/digestion` (currently flagged as "risk of teaching something wrong"), fallback kept.
4. **GitHub skills with licence discipline** — no model or code is used until its licence is recorded in `docs/ASSET_LICENSES.md`. See `docs/REPO_SHORTLIST.md` for candidates (skeleton-anatomy, anatomy-atlas-3d, 3d-anatomy, human-cell-visualizer MIT, three.js examples MIT).
5. **Performance budget** — one realistic lesson must download within school connectivity; test on the lowest-end Android device available. Quality manager already exists (High/Balanced/Fast) — reuse it.

---

## Phase 0 — Architecture decision (do first)

| Step | Action | Why |
|------|--------|-----|
| 0.1 | Owner decides: recover original source + `tools/make-vercel.sh` (referenced in DEPLOY.md, missing from repo) OR accept a second lazily loaded module for the asset pipeline | The bundle is minified; `THREE` is not exported. Adding GLTFLoader/DRACO/AnimationMixer/fetch-cache requires one of these two routes (docs/AUDIT.md §3, §10). |
| 0.2 | If route 2: expose the bundled engine classes to a lazy module; prove it with one small openly licensed model (e.g. a simple beating-heart GLB) before any anatomy | Minimal risk, no rebuild needed. |
| 0.3 | Create `docs/ASSET_LICENSES.md` — one row per asset actually adopted (licence, author, origin URL, date checked) | Empty today; nothing adopted yet. |

---

## Phase 1 — Asset pipeline & offline support

| Step | Action |
|------|
| 1.1 | Add loader service: GLTFLoader + DRACOLoader + meshopt decoder (r160), AnimationMixer, fetch + cache (IndexedCache-style) for `.glb/.ktx2/.basis` |
| 1.2 | Add web app manifest + service worker so hosted lessons work offline (currently missing; vercel.json output `public/` doesn't match repo either) |
| 1.3 | Fix hosting config: `vercel.json` output directory must match what is deployed; add headers for `.glb`, `.ktx2` (gzip/brotli) |
| 1.4 | Fallback path: if a realistic asset fails to load, fall back to the existing primitive scene silently |

---

## Phase 2 — Rendering engine upgrades (shared by all subjects)

| Step | Upgrade | Effect |
|------|---------|--------|
| 2.1 | Material presets extended: PBR tissue (clearcoat for wet organ look), transmission (glass/prism/cornea), subsurface-scattering approximation | Biology looks like flesh, not plastic |
| 2.2 | Surgical lighting: spotlight + fill + rim lights; ACES tone mapping; exposure control | Depth and drama like an operation theatre |
| 2.3 | Bloom post-process (UnrealBloomPass) for glossy-wet/anime glow | "Rich anime" feel |
| 2.4 | Cross-section clip plane + cap mesh per organ | Surgeon's slice — slide a plane through heart/stomach/lung live |
| 2.5 | Isolate / transparency / explode system shared across scenes (cell already has its own explode; brain its own cut — unify) | Focus on one organ, see through others |
| 2.6 | Timeline scrubber alongside step buttons | Play/pause a beating heart, peristalsis, nerve impulse |
| 2.7 | Anime pass: MeshToonMaterial + gradient map + EdgesGeometry outlines + animated dashed motion lines | Clear, vibrant, exam-friendly motion visuals |
| 2.8 | Label leader lines + 3D labels that survive style switches | Keep bilingual labels in every mode |

---

## Phase 3 — Biology step-by-step (Class X)

*Class X chapters: Chemical reactions, Acids/bases/salts, Metals, Carbon compounds, Life processes, Control & coordination, Reproduction, Heredity/evolution, Light, Electricity, Magnetic effects, Sources of energy, Environment.*

| Step | Scene (key) | Today | Target (Anime / Ultra-realistic) | GitHub skill to use |
|------|-------------|-------|----------------------------------|---------------------|
| 3.1 | `ch5/digestion` (pilot) | Short flat coil; organs ellipsoids; **risk of wrong picture** | Full tract: oral cavity, teeth, tongue, salivary glands, pharynx, oesophagus, stomach, small intestine with villi, large intestine, rectum; peristalsis animation; isolate stomach; cross-section slice | anatomy-atlas-3d / 3d-anatomy (reference only, licence check) |
| 3.2 | `ch5/heart` | 4 spheres in ellipsoid; tubes as vessels | Chambers with walls, four valves (mitral, tricuspid, aortic, pulmonary), aorta arch, pulmonary trunk, vena cava, coronary vessels; beating animation (scale + chamber pulse); cross-section inside ventricle | skeleton-anatomy (structure ref), human-cell-visualizer (procedural technique) |
| 3.3 | `ch5/alveoli` | Spheres + tubes | Bronchial tree, alveoli sacs, capillary network, gas-exchange colour shift (O₂/CO₂) | three.js examples (tube geometry, instancing) |
| 3.4 | `ch5/nephron` | One bent tube | Glomerulus + Bowman's capsule, proximal/distal tubule, loop of Henle, collecting duct; filtrate flow animation | — |
| 3.5 | `ch6/neuron` | Soma sphere + tube dendrites | Soma, axon with myelin sheath + nodes of Ranvier, synapse cleft with neurotransmitter dots, impulse travel (anime motion line) | — |
| 3.6 | `ch6/synapse` | Bulb + cleft spheres | Pre/post-synaptic membrane, vesicle release, receptor binding — step-by-step | — |
| 3.7 | `ch6/brain` | Ellipsoid lobes | Gyri/sulci surface, lobes coloured, ventricles, cross-section cap | — |
| 3.8 | `ch6/eye`, `ch10/eyeparts` | Nested spheres | Cornea, iris/pupil (dilate), lens (accommodation), retina, optic nerve; ray path through eye | — |
| 3.9 | `ch6/reflex`, `ch6/plants`, `ch6/hormones` | Primitives | Reflex arc: receptor → sensory neuron → spinal cord → motor neuron → muscle; gland glow for hormones | anime motion lines |
| 3.10 | `ch7/human`, `ch7/fission`, `ch7/budding`, `ch7/vegetative`, `ch7/flower` | Primitives, lathe | Realistic organ shapes, flower parts (anther, stigma, ovary, ovule), pollen tube growth, binary fission with cytokinesis cleavage | — |
| 3.11 | `ch8/evolution` | Beetles as ellipsoids | Beetles with shell texture, colour-variation animation (green → brown on bark background) | — |

---

## Phase 4 — Biology step-by-step (Class IX)

| Step | Scene (key) | Today | Target |
|------|-------------|-------|--------|
| 4.1 | `ix1/cell` | Organelles ellipsoids; ER two tubes | Plant/animal/bacterium with cristae (mitochondria), grana (chloroplast), nuclear pores, Golgi stacks, vacuole; explode view already exists — keep, enrich materials | human-cell-visualizer MIT (technique) |
| 4.2 | `ix1/division` | Chromosomes = cylinders; no spindle | Chromatids, spindle fibres, centrioles, nuclear envelope breakdown, cleavage furrow (anime-style clear) | — |
| 4.3 | `ix2/tissues` | Clusters of boxes/spheres | Real tissue arrangement: epithelial layers, muscle fibres, xylem vessels, phloem sieve tubes, neuron bundles | — |
| 4.4 | `ix2/joint` | Two cylinders; muscles not attached | Hinge joint: humerus, ulna, radius, cartilage, ligament, tendon, biceps/triceps attached to bone, flexion-extension animation | skeleton-anatomy (reference) |
| 4.5 | `ix2/xylem`, `ix5/lab`, `ix4/kingdoms`, `ix4/acellular` | Primitives | Realistic glassware (lab), virus capsid geometry, lichen thallus, five-kingdom models | — |
| 4.6 | `ix3/...` reproduction (re-used X) | Same as Class X scenes | Re-use enriched X scenes with IX-appropriate labels | — |

---

## Phase 5 — Chemistry step-by-step (Class IX & X)

| Step | Scene (key) | Today | Target |
|------|-------------|-------|--------|
| 5.1 | `ch4/molecules`, `ix6/atom`, `ix7/molecules` | Ball primitives | Ball-and-stick with PBR (CPK colours: C grey, O red, N blue, H white), covalent/ionic bond animation, Lewis dots (anime) | three.js instanced mesh |
| 5.2 | `ch4/ethanol`, `ch4/micelle`, `ch4/homologous` | Primitives | Ethanol molecule rotating; micelle with hydrophobic tails inward; homologous series CH₂ addition animation | — |
| 5.3 | `ch2/ph`, `ch2/acidrx`, `ch2/neutralisation`, `ch2/salts` | Apparatus primitives | pH meter with colour-changing universal indicator, reaction bubbles (CO₂), neutralisation heat glow, salt crystallisation | anime particle flow |
| 5.4 | `ch3/ionic`, `ix7/ionic`, `ix7/covalent` | Primitives | Electron transfer animation (ionic), orbital overlap (covalent), octet exceptions | — |
| 5.5 | `adv8/column`, `adv8/fractional` | Glassware primitives | Real fractionating column with trays, crude-oil tower, temperature gradient | — |
| 5.6 | `adv10/fermenter`, `adv10/insulin` | Vessel cylinders | Bioreactor with impeller, growth curve, recombinant insulin workflow (bacterium → plasmid → insulin) | — |

---

## Phase 6 — Physics step-by-step (Class IX & X)

| Step | Scene (key) | Today | Target |
|------|-------------|-------|--------|
| 6.1 | `ch9/reflection`, `ch9/optics`, `ch9/slab`, `ch9/power` | Ray diagram primitives | Ray paths with anime motion lines, normal/dashed lines, angle markers, realistic glass prism (transmission + clearcoat), lens focal points | — |
| 6.2 | `ch10/prism`, `ch10/scatter` | Primitives | White light → VIBGYOR dispersion with coloured rays, scattering by particle size (Tyndall beam), rainbow geometry | — |
| 6.3 | `ch10/eye` (vision defects) | — | Myopia/hypermetropia rays with corrective lens overlay | — |
| 6.4 | `ch11/ohm`, `ch11/resistance`, `ch11/series`, `ch11/heating` | Circuit primitives | Real battery, bulb, rheostat, ammeter/voltmeter, electron drift animation (anime), heating glow colour | — |
| 6.5 | `ch12/magnet`, `ch12/field`, `ch12/induction`, `ch12/solenoid`, `ch12/motor`, `ch12/domestic`, `ch12/flhr` | Field primitives | Iron filings pattern, solenoid field, electromagnetic induction with moving magnet + galvanometer, motor split-ring commutator, domestic wiring with fuse/earthing | — |
| 6.6 | `ix9/line`, `ix9/circular`, `ix10/forces`, `ix10/trolley`, `ix11/energy`, `ix11/machines`, `ix12/source`, `ix12/wave`, `ix12/echo` | Graphs/primitives | Motion with synchronized s-t/v-t/a-t graphs + anime motion line on object, wave longitudinal/compression animation, echo with reflected pulse, pendulum energy bar | — |
| 6.7 | Advanced: `adv6/rays`, `adv6/spectrum`, `adv9/microscope` | Microscope boxes | Compound microscope with real ray path, objective/eyepiece magnification formula overlay, LM/TEM/SEM comparison images | — |

---

## Phase 7 — Quality gates before public release

| Gate | Criterion |
|------|-----------|
| 7.1 | Biology pilot (`ch5/digestion`) reviewed by a subject teacher; current scene kept as fallback until sign-off |
| 7.2 | Every enriched scene passes the same scene contract (labels, steps, predict, quiz) in all three styles |
| 7.3 | Tested on lowest-end target Android phone — stays at "Fast" quality level ≥ 30 fps; per-lesson download within school connectivity budget |
| 7.4 | No scene teaches a wrong picture (fix `ch5/digestion`, `ix2/joint` first) |
| 7.5 | Regression suite `tests/regression.js` extended to cover style switching and cross-section |
| 7.6 | Licence record `docs/ASSET_LICENSES.md` complete for every adopted asset |

---

## Suggested order of work (first 4 weeks)

| Week | Focus |
|------|
| 1 | Architecture decision (Phase 0) + asset pipeline (Phase 1) + `docs/ASSET_LICENSES.md` |
| 2 | Rendering upgrades Phase 2 (PBR, clip plane, isolate, timeline, anime pass) |
| 3 | Biology pilot: `ch5/digestion` ultra-realistic + `ch5/heart` beating (Class X) |
| 4 | Class IX biology: `ix1/cell`, `ix2/joint` + one chemistry scene (molecule) and one physics scene (prism with anime rays); teacher review |

---

## Hindi summary (हिंदी में चरण)

**चरण 0:** ऐप का सोर्स ढूँढें या एक नया मॉड्यूल जोड़ें जिससे 3D मॉडल लोड हो सकें (GLTFLoader, एनिमेशन मिक्सर)।  
**चरण 1:** ऑफ़लाइन सपोर्ट, मैनिफेस्ट, सर्विस वर्कर और लाइसेंस रजिस्टर (`docs/ASSET_LICENSES.md`)।  
**चरण 2:** रेंडरिंग सुधार — PBR मटीरियल, सर्जिकल लाइट, ब्लूम, क्रॉस-सेक्शन कट, अंग अलग करना, टाइमलाइन स्क्रबर, एनIME आउटलाइन।  
**चरण 3–6:** बायोलॉजी पहले (दिल, पाचन, फेफड़ा, गुर्दा, तंत्रिका, आँख, जोड़), फिर केमिस्ट्री (आणविक मॉडल, अभिक्रिया), फिर फिजिक्स (प्रकाश किरणें, सर्किट, चुम्बक, तरंग) — कक्षा IX और X दोनों के लिए।  
**चरण 7:** शिक्षक की जाँच, कमज़ोर फ़ोन पर परीक्षण, रिग्रेशन टेस्ट, फिर रिलीज़।
