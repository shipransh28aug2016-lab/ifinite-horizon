# Class IX coverage report — Vigyan Atlas v2.0

Source: *Class IX Science 2026–27 — Complete Syllabus & 3D Model Brief* (Compulsory Science 086 + Science at Advanced Level, Optional).
Machine-readable twin: [`class9-coverage.json`](class9-coverage.json) (generated from the running app).

## Totals

| Item | Built |
|---|---|
| Compulsory (086) topics | **12 / 12** (exact Part B order) |
| Advanced (Optional) chapters | **10 / 10** (exact Part E order, persistent *Optional* badge) |
| Compulsory practicals | **13 / 13** in the Virtual Practical Lab (aim, materials, safety, procedure, editable observation table, conclusion, link to a 3D model) |
| Competency reference CG 1–8 | Built as a separate overlay, **not** presented as chapters |
| Interactive 3D model pages | **53** = 44 newly built scenes + 9 re-used (8 Class X scenes for Reproduction, Xylem/Phloem, Ionic and Covalent bonding; 1 Class IX scene re-used for Rutherford vs Bohr) — 37 compulsory, 16 advanced |
| Key concepts / subtopics listed in app | 154 (shown in every module’s *Syllabus 2026–27* panel) |

Tracks never mix: Class X · Class IX (Compulsory) · IX Advanced (Optional) are separate tabs, separate chapter lists, separate progress counts.
Advanced marks / periods are shown as **not stated in the source PDF**; nothing was invented.

## Which concepts have a dedicated 3D/graph scene, and which are text only

**Compulsory**

| Topic | 3D / graph scenes | Syllabus text only (honest gaps) |
|---|---|---|
| 1 Cell | plant / animal / bacterium explorer with explode; osmosis & diffusion particle simulation; mitosis & meiosis | biomolecule call-outs, cancer, “recent advances”, slide-preparation scene (practical 4 is text + link) |
| 2 Tissues | 12-tissue gallery (6 plant, 6 animal); bone–muscle–joint rig (4 joint types); xylem/phloem (re-used) | meristem types other than apical (source does not name them — flagged), posture / injury / yoga panels, apical-meristem growth graph |
| 3 Reproduction | binary fission, budding, vegetative, flower & fertilisation, human reproduction (re-used from Class X); seed-dispersal agents | separate pollination-agent animation, reproductive health & birth-control panels |
| 4 Diversity | five-kingdom tree + three domains + binomial builder; virus / lichen / size comparison | major divisions of plants & animals (not enumerated in the source — flagged) |
| 5 Mixtures | solution–colloid–suspension (torch, filter, settle); 7-technique separation lab; concentration calculator + solubility graph | paperfuge / distillation-unit build models |
| 6 Atom | Z = 1–18 builder (shells, valency, isotopes, isobar, mystery-element game); Dalton → Thomson → Rutherford (α-scattering) → Bohr | “Journey inside the atom” role-play |
| 7 Atoms & molecules | conservation of mass + constant proportion; 11 molecules/ionic compounds with mass calculators; ionic and covalent bonding (re-used) | Dalton’s postulates as a dedicated scene |
| 8 Earth | five spheres; EM spectrum; latitude/tilt/albedo heating; sea-land-mountain-valley winds; 4 biogeochemical cycles + human impact | traditional-knowledge reflection |
| 9 Motion | 1-D motion with synchronized s–t, v–t, a–t graphs; uniform circular motion | inclined-plane rig of practical 13 (modelled as 1-D track) |
| 10 Force | friction, Newton I/II/III scenes; trolley–pulley–hanging mass with F–a graph | — |
| 11 Work & energy | free fall, pendulum, work & power; lever, inclined plane, pulleys | derivations shown as formulae, not animated |
| 12 Sound | vibrating string / membrane / air column; longitudinal wave + 2 graphs + media + vacuum; echo, reverberation, echolocation | intensity, musical-instrument gallery |

**Advanced (Optional)**

| Chapter | 3D / graph scenes | Text only (gaps) |
|---|---|---|
| 1 Measurement | ruler & units, conversion problems, SI base-unit explorer, estimate vs measure | classroom-floor group activity |
| 2 Motion experience | frames of reference (inertial / non-inertial), vector addition, route problem, nth-second | graph subtraction, bicycle experiment |
| 3 Newton’s laws | pseudo force (bus, lift, orbit, bob), g vs altitude/depth, air/vacuum drop, torque | — |
| 4 Advanced machines | wheel & axle with efficiency, gear train, Atwood pulley with free-body arrows | truck animation (numeric example only) |
| 5 Work & energy | Hooke’s law with F–x graph and work area, spring release, conservative vs friction | closed-loop path animation |
| 6 Structure of atom | cathode / canal rays, Chadwick, timeline, line spectra, hydrogen series, Rutherford vs Bohr | — |
| 7 Chemical bonding | Lewis dots, octet exceptions (HF, BF₃, SF₆, NO), metallic electron sea | ionic/covalent/metallic side-by-side comparison |
| 8 Mixtures | column chromatography, fractional distillation, crude-oil tower | simple-vs-fractional split view |
| 9 Microscopy | clickable compound microscope with ray path and M = m_obj × m_eye; resolution vs magnification, LM / TEM / SEM comparison | monocot/dicot epidermal peel scene, slide-preparation steps, fluorescence / phase-contrast comparison, history timeline |
| 10 Biotechnology | bioreactor with growth-curve simulator (batch / continuous); recombinant-insulin workflow | Bt crops, Golden Rice, food processing, bio-enzymes, bioremediation, ethics panel (in the syllabus panel as text) |

## Source flags shown inside the app

* **Advanced p. 21** — printed altitude formula appears to omit `R +`. The app uses `g_h = GM/(R+h)²`, `g_h/g = R²/(R+h)²`, with a visible *Teacher validation* note.
* Meristem type names and plant/animal divisions are not enumerated in the compulsory PDF — nothing invented.
* Compulsory PDF page numbers were not in the brief; each module shows “page reference to be confirmed with the school copy”. Advanced chapters show the printed page ranges.
* Centrifugal force is described as an apparent force of the rotating frame.
* Albedo, solubility and spectrum values are approximate textbook data (marked in the scenes).

## Not done / out of scope of this change

* The brief proposed React + Three Fiber + TypeScript. This repository is a single minified static `index.html` with its own Three.js bundle, so the work was added **inside the existing engine** (same helpers, materials, label / step / predict / quiz contract) as requested. There is therefore no TypeScript project, lint or unit-test setup; verification was done with headless-browser tests (all 118 models load; 468 control clicks; no console errors; Class X regression suite passes).
* Teacher dashboard per-chapter columns still list Class X only; Class IX progress is stored and shown on the home cards.
* Hindi labels exist for scene labels, steps, practical titles and chapter briefs; syllabus lists are English-only (source-faithful).
* `vercel.json` still points at `public/`, which this repository does not contain (pre-existing).
