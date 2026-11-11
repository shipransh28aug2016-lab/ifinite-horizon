# 🎨 Visual Audit Report — Vigyan Atlas (Class IX & X Science 3D)

**Repository:** shipransh28aug2016-lab/ifinite-horizon  
**Branch:** arena/eae64aa8-ifinite-horizon (from main bfb67a0)  
**App:** Vigyan Atlas v2.0 — single-file static site `index.html` (1.5 MB), Three.js r160 bundled inside  
**Audit date:** 2026-11-11  
**Language:** English + हिंदी summary at the end  

---

## 1. What the app shows today (current visuals)

| Area | Finding |
|------|---------|
| **Scenes** | 118 interactive 3D scenes: Class X = 65, Class IX compulsory = 37, Class IX Advanced = 16. 34 are step-based, 84 explore-mode, 53 have selectable parts. |
| **Geometry** | **100% built from primitives** — spheres, boxes, cylinders, cones, tori, lathes, tubes. No imported mesh (GLB/GLTF/OBJ), no file texture, no skeleton, no animation clip. |
| **Materials** | Simple physical presets (glass, liquid, metal, tissue) — flat/solid colours. No PBR metalness/roughness/clearcoat/transmission, no subsurface scattering look. |
| **Lighting / post** | One directional shadow (1024²), ambient + point lights, bloom post-process (switchable), tone mapping, sRGB output. |
| **Camera** | OrbitControls with damping, idle auto-rotate. No cross-section, no isolate, no shared explode, no timeline scrubber — only step buttons + play/pause. |
| **Bilingual** | EN / हिंदी / both labels with leader lines and collision avoidance. |
| **Offline/assets** | Zero binary assets. No service worker, no manifest. Works offline only when saved as a single file. |

### Biology — where "unrealistic" hurts most (audited from docs/AUDIT.md scene inventory)

| Scene (Class) | What is drawn now | Why it looks like a diagram, not a body | Risk |
|---------------|-------------------|------------------------------------------|------|
| `ch5/heart` (X) | 4 spheres inside one ellipsoid; vessels are tubes | No chambers, no valves, no aorta arch shape, no beating | Realism would help |
| `ch5/digestion` (X) | Short flat coil; organs are ellipsoids | No teeth, tongue, pharynx, salivary glands, rectum, villi | **Risk of teaching something wrong** |
| `ch5/alveoli` (X) | Lungs/airways from spheres + tubes; alveoli inset conceptual | No bronchial tree, no capillary network | Realism would help |
| `ch5/nephron` (X) | Single bent tube; capsule = cut sphere | No glomerulus, loop of Henle, collecting duct detail | Realism would help |
| `ch6/neuron` (X) | Soma sphere + tube dendrites | No axon myelin, nodes, synapse detail | Realism would help |
| `ch6/brain` (X) | Scaled ellipsoids for lobes | No gyri/sulci, no ventricles | Realism would help |
| `ch10/eyeparts`, `ch10/eye` (X) | Nested spheres; lens/cornea not shaped | No iris, pupil, retina, optic nerve | Realism would help |
| `ch7/human` (X) | Reproductive organs as tubes + ellipsoids | Labelled schematic only | Realism would help |
| `ix1/cell` (IX) | Organelles = ellipsoids; ER = two tubes | No cristae, grana, nuclear pores, Golgi stacks | Realism would help |
| `ix1/division` (IX) | Chromosomes = cylinders; spindle not shown | Mitosis/meiosis look symbolic | Realism would help |
| `ix2/tissues` (IX) | Each tissue = cluster of boxes/spheres/cylinders | No real tissue texture or arrangement | Realism would help |
| `ix2/joint` (IX) | Elbow = two straight cylinders; muscles = ellipsoids not attached to bone | No tendon, ligament, cartilage, bone ends | **Risk of teaching something wrong** |
| `ix3/...` reproduction (IX) | Re-used X scenes (same primitives) | Same limitations as X | Re-use carries same gaps |
| `ix4/kingdoms`, `ix4/acellular` (IX) | Icons from 2–3 primitives; virus = octahedron with pins | No realistic cell/virus shapes | Realism would help |

**Bottom line:** biology today looks like a school chalkboard diagram, not like a doctor looking inside a body during surgery. Physics and chemistry scenes are *correct as diagrams*, but they also lack motion, depth, and materials that make a student feel "vastav mein virtually dekh pa raha hai" (actually seeing it virtually).

---

## 2. What "rich anime/animation" and "ultra-realistic" mean here

The app should offer a **style toggle per lesson**, because not every topic needs a surgery view:

| Style | Look | Best for | How (Three.js r160) |
|-------|------|----------|---------------------|
| **Schematic** (today) | Flat colours, primitives, labels | Exams, quick revision, low-end phones | MeshBasicMaterial, no bloom |
| **Anime / animation** | Cel shading, thick outlines, vibrant colours, motion lines, energy trails | Waves, ray optics, electron flow, blood-flow arrows, cell division steps | MeshToonMaterial + gradient map, EdgesGeometry outlines, animated dashed lines |
| **Ultra-realistic** | PBR tissues (clearcoat = wet look), transmission glass, surgical spotlight, bloom, cross-section slice, isolate/transparency, beating/pumping motion | Heart, digestion, neuron, eye, ear, joints — "surgery by doctor" feel | MeshStandardMaterial (metalness/roughness/clearcoat/transmission), clip planes + cap mesh, UnrealBloomPass, ACES tone mapping |

The user's core ask — **biology ultra-realistic, like surgery by a doctor** — maps to the **Ultra-realistic** style with a cross-section slider (slice the heart/lung/stomach open live) and isolate-organ mode.

---

## 3. Missing technical capabilities (audit of the bundle)

Three.js r160 is bundled as `__THREE__` inside an IIFE — `THREE` is not exposed globally. The bundle has OrbitControls, EffectComposer, UnrealBloomPass, but **not**:

- `GLTFLoader`, `DRACOLoader`, `MeshoptDecoder` — cannot import realistic models
- `AnimationMixer` / `AnimationClip` / `SkinnedMesh` animation — no beating heart, no peristalsis, no nerve impulse
- `fetch` / caching layer — no external assets, no offline asset cache
- Texture loaders (KTX2, Basis) — no PBR texture maps

**Consequence (from docs/AUDIT.md §3):** imported models need a loader, decoder, animation mixer, and fetch/caching layer compiled against r160. Two clean routes:

1. **Recover the original source** (`tools/make-vercel.sh`, `vercel/` folder referenced in DEPLOY.md are missing) — rebuild with Vite/esbuild, add the asset pipeline, redeploy.
2. **Add a second, lazily loaded module** that receives the engine's classes from the bundle (GLTFLoader, DRACO, AnimationMixer, fetch cache) — no rebuild needed; proven first with one small openly licensed model before any anatomy.

---

## 4. GitHub-repository skills to use (from docs/REPO_SHORTLIST.md)

These repos were located via the GitHub search API. **Licences must be read before any asset or code is adopted** — several are "None"/"NOASSERTION" (all rights reserved by default).

| Purpose | Repository | Licence (GitHub) | What it offers |
|---------|------------|------------------|----------------|
| Anatomy reference (skeleton/joints) | Meteorkid/skeleton-anatomy | Unrecognised | Skeletal anatomy — relevant to joints/bones lesson; inspect licence |
| Anatomy reference (organs) | Grypa-JJ/anatomy-atlas-3d | Unrecognised | Active repo; may contain organ meshes; read licence text |
| Anatomy reference (organs) | nqwrc/3d-anatomy | Unrecognised | Active; inspect model sources and licence |
| Cell technique (MIT code) | iamtechartist/human-cell-visualizer | MIT | Procedural cell visualisation — technique candidate for `ix1/cell` |
| Rendering technique | three.js official examples (github.com/mrdoob/three.js) | MIT | OrbitControls, EffectComposer, UnrealBloomPass, MeshToonMaterial, EdgesGeometry, outline passes — copy technique, not necessarily code |
| Volume rendering (technique only, do not copy) | lebarba/WebGLVolumeRendering | None | CT/MRI-style volume rendering — technique reference only; no licence, do not copy |

**Rule:** nothing is adopted until its licence is recorded in `docs/ASSET_LICENSES.md` (created empty today). If the app is ever sold or bundled commercially, non-commercial assets cannot be used — owner decision needed (docs/AUDIT.md §11 Q2).

---

## 5. What must survive any visual upgrade (working features)

Three class tabs & progress, bilingual labels (EN / हिंदी / both), step player, predict-first cards, quizzes, "Test yourself", student report codes, teacher dashboard, quality switch, FPS meter, device test, collapsible panels, chapter map, syllabus panels, virtual practical lab, deep links by `#key`, keyboard shortcuts, light theme, large-text mode. The upgrade enriches **visuals only** — the learning contract (labels, steps, tools, pickables, predict, quiz) stays identical.

---

## 6. Hindi summary (हिंदी सारांश)

आज का ऐप (Vigyan Atlas) सारे सीन प्रिमिटिव्स (गोला, बेलन, घन) से बना है — जीव विज्ञान में दिल, पाचन तंत्र, गुर्दा, मस्तिष्क, तंत्रिका, आँख सब कार्टून/डायग्राम जैसे दिखते हैं, असली शरीर जैसे नहीं। बायोलॉजी में दो सीन (पाचन तंत्र, कोहनी का जोड़) गलत समझ भी सकते हैं।

ज़रूरत: **स्टाइल स्विच** — स्केमैटिक (आज का) · एनIME (रंगीन रेखाएँ, मोशन लाइनें) · अल्ट्रा-रियलिस्टिक (चमड़ी जैसा PBR मटीरियल, सर्जिकल लाइट, क्रॉस-सेक्शन कट, अंग अलग करना) — ताकि विद्यार्थी को लगे "वास्तव में virtually देख पा रहा हूँ", और बायोलॉजी डॉक्टर की सर्जरी जैसे दिखे।

टेक्निकल गैप: मॉडल लोडर, एनिमेशन मिक्सर, टेक्सचर, एसेट पाइपलाइन और ऑफलाइन सपोर्ट नहीं है। गिटहब रेपोज़िटरी से एनाटॉमी रेफरेंस ले सकते हैं, पर लाइसेंस जाँचकर ही इस्तेमाल करें।

चरणबद्ध योजना अगले दस्तावेज़ में: `docs/REALISM_STEP_BY_STEP_ROADMAP.md`।

---

## 7. Immediate recommendation

1. Treat this report as the audit baseline (no code was changed to produce it).
2. Decide the architecture (recover source vs. lazy module) — owner question in docs/AUDIT.md §11 Q1.
3. Start the biology pilot with `ch5/digestion` (the scene flagged as risky), keeping the current scene as fallback.
4. Create `docs/ASSET_LICENSES.md` before adopting any GitHub model.
