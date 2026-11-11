# Asset acquisition and licensing record

Updated 2026-11-11. One row per asset actually shipped.

## Shipped binary assets

| File | Size | What | Licence | Attribution required |
|---|---|---|---|---|
| `assets/digestive/digestive.glb` | 394 kB | 61 anatomy meshes, 104,158 triangles, Draco-compressed | CC BY-SA 4.0 (derived from CC BY-SA 2.1 JP and CC BY-SA 4.0 sources) | "BodyParts3D — The Database Center for Life Science — CC BY-SA 2.1 Japan" and "Z-Anatomy — The open source atlas of anatomy — CC BY-SA 4.0"; state that the meshes were modified |
| `assets/digestive/digestive_lo.glb` | 204 kB | Same meshes, 42,481 triangles | same | same |
| `assets/digestive/parts.json`, `sizes.json` | 14 kB, 131 B | Build metadata (bounding boxes, triangle counts) | same | same |
| `assets/heart/heart.glb` | 362 kB | 64 anatomy meshes (heart chambers, valve leaflets, great vessels, coronary arteries, lungs, trachea, rib cage), 93,056 triangles, Draco | CC BY-SA 4.0 (same chain) | same |
| `assets/heart/heart_lo.glb` | 214 kB | Same meshes, 43,371 triangles | same | same |
| `assets/heart/parts.json`, `sizes.json` | 15 kB | Build metadata | same | same |
| `assets/vendor/three.module.min.js`, `loaders/GLTFLoader.js`, `loaders/DRACOLoader.js`, `utils/BufferGeometryUtils.js` | 656 kB + 160 kB | Three.js r160 (module build) | MIT | Copyright notice kept in `assets/vendor/THREE_LICENSE.txt` |
| `assets/vendor/draco/draco_decoder.{js,wasm}`, `draco_wasm_wrapper.js` | 756 kB | Draco decoder (from the Three.js distribution) | Apache-2.0 | Licence text to be added alongside the files (open item) |

All shipped files are served from the app's own origin; nothing is fetched from a third party at run time.

## Provenance of the anatomy meshes — read this

1. Original data: **BodyParts3D** (DBCLS, CC BY-SA 2.1 Japan), re-organised in the **Z-Anatomy** Blender atlas (CC BY-SA 4.0).
2. The meshes used here were taken from the Draco GLB export published in the repository **nqwrc/3d-anatomy** (`public/models/visceral.glb`, `skeletal.glb`, `muscular.glb`). That repository states its *bundle* is CC BY-NC-SA 4.0 because it also contains a kidney (CC BY-NC) and an inner-ear model (CC BY-NC-SA).
3. **Only the structures listed below were extracted.** None of the non-commercial additions (kidney, inner ear) nor the two brain models with no stated licence were copied. The extraction is reproducible: `tools/build-digestive.mjs`.
4. **Not verified at source.** The upstream Z-Anatomy repository (806 MB) could not be cloned in this session (time limit) and the BodyParts3D and Z-Anatomy websites are not reachable from it, so the CC BY-SA terms above were read from the notices shipped inside the nqwrc repository, not from the originators. Recommended before public release: re-export the same meshes from the Z-Anatomy file, confirm the licence text on z-anatomy.com, and have the owner confirm that releasing the processed meshes under CC BY-SA 4.0 is acceptable. **This is not legal advice.**
5. Share-alike consequence: the processed mesh files (and any renders or exports of them) must remain under CC BY-SA and be credited. The application code is a separate work.

## Meshes extracted

| Part id | Layer | Source name | Group | Triangles (high) |
|---|---|---|---|---|
| `stomach` | visceral | Stomach | organ | 8,000 |
| `liver` | visceral | Liver | organ | 8,999 |
| `gallbladder` | visceral | Gallbladder | organ | 700 |
| `pancreas` | visceral | Pancreas | organ | 3,500 |
| `pancreatic-duct` | visceral | Pancreatic duct | duct | 1,182 |
| `oesophagus` | visceral | Oesophagus | tube | 5,000 |
| `duodenum` | visceral | Duodenum | tube | 1,700 |
| `jejunum` | visceral | Jejunum | tube | 14,000 |
| `asc-colon` | visceral | Ascending colon | tube | 6,000 |
| `trans-colon` | visceral | Transverse colon | tube | 6,000 |
| `desc-colon` | visceral | Descending colon | tube | 6,000 |
| `sigmoid-colon` | visceral | Sigmoid colon | tube | 3,400 |
| `appendix` | visceral | Vermiform appendix | organ | 440 |
| `tongue` | visceral | Tongue | oral | 680 |
| `soft-palate` | visceral | Soft palate | oral | 2,000 |
| `uvula` | visceral | Uvula of palate | oral | 500 |
| `gingiva` | visceral | Gingiva | oral | 3,500 |
| `oropharynx` | visceral | Oropharynx | pharynx | 1,500 |
| `laryngopharynx` | visceral | Laryngopharynx | pharynx | 1,500 |
| `nasopharynx` | visceral | Nasopharynx | pharynx | 1,200 |
| `epiglottis` | visceral | Epiglottis | pharynx | 900 |
| `parotid-l` | visceral | Parotid gland.l | gland | 500 |
| `parotid-r` | visceral | Parotid gland.r | gland | 500 |
| `submandibular-l` | visceral | Submandibular gland.l | gland | 392 |
| `submandibular-r` | visceral | Submandibular gland.r | gland | 392 |
| `sublingual-l` | visceral | Sublingual gland.l | gland | 324 |
| `sublingual-r` | visceral | Sublingual gland.r | gland | 324 |
| `mandible` | skeletal | Mandible | jaw | 5,999 |
| `maxilla-l` | skeletal | Maxilla.l | jaw | 2,000 |
| `maxilla-r` | skeletal | Maxilla.r | jaw | 2,000 |
| `anal-sphincter-l` | muscular | External anal sphincter.l | sphincter | 202 |
| `anal-sphincter-r` | muscular | External anal sphincter.r | sphincter | 202 |
| `diaphragm` | muscular | Diaphragm | landmark | 4,000 |
| `tooth-u-medial-incisor-l` | skeletal | Upper medial incisor.l | tooth | 380 |
| `tooth-u-lateral-incisor-l` | skeletal | Upper lateral incisor.l | tooth | 377 |
| `tooth-u-canine-l` | skeletal | Upper canine.l | tooth | 380 |
| `tooth-u-premolar-1-l` | skeletal | Upper first premolar.l | tooth | 380 |
| `tooth-u-premolar-2-l` | skeletal | Upper second premolar.l | tooth | 379 |
| `tooth-u-molar-1-l` | skeletal | Upper first molar tooth.l | tooth | 380 |
| `tooth-u-molar-2-l` | skeletal | Upper second molar tooth.l | tooth | 379 |
| `tooth-l-medial-incisor-l` | skeletal | Lower medial incisor.l | tooth | 380 |
| `tooth-l-lateral-incisor-l` | skeletal | Lower lateral incisor.l | tooth | 380 |
| `tooth-l-canine-l` | skeletal | Lower canine.l | tooth | 380 |
| `tooth-l-premolar-1-l` | skeletal | Lower first premolar.l | tooth | 380 |
| `tooth-l-premolar-2-l` | skeletal | Lower second premolar.l | tooth | 379 |
| `tooth-l-molar-1-l` | skeletal | Lower first molar tooth.l | tooth | 379 |
| `tooth-l-molar-2-l` | skeletal | Lower second molar tooth.l | tooth | 379 |
| `tooth-u-medial-incisor-r` | skeletal | Upper medial incisor.r | tooth | 379 |
| `tooth-u-lateral-incisor-r` | skeletal | Upper lateral incisor.r | tooth | 377 |
| `tooth-u-canine-r` | skeletal | Upper canine.r | tooth | 380 |
| `tooth-u-premolar-1-r` | skeletal | Upper first premolar.r | tooth | 380 |
| `tooth-u-premolar-2-r` | skeletal | Upper second premolar.r | tooth | 378 |
| `tooth-u-molar-1-r` | skeletal | Upper first molar tooth.r | tooth | 380 |
| `tooth-u-molar-2-r` | skeletal | Upper second molar tooth.r | tooth | 380 |
| `tooth-l-medial-incisor-r` | skeletal | Lower medial incisor.r | tooth | 380 |
| `tooth-l-lateral-incisor-r` | skeletal | Lower lateral incisor.r | tooth | 379 |
| `tooth-l-canine-r` | skeletal | Lower canine.r | tooth | 380 |
| `tooth-l-premolar-1-r` | skeletal | Lower first premolar.r | tooth | 379 |
| `tooth-l-premolar-2-r` | skeletal | Lower second premolar.r | tooth | 380 |
| `tooth-l-molar-1-r` | skeletal | Lower first molar tooth.r | tooth | 379 |
| `tooth-l-molar-2-r` | skeletal | Lower second molar tooth.r | tooth | 379 |

Not in the source data and therefore **procedural and labelled schematic**: rectum, anal canal, bile duct, villi inset, food / secretion / nutrient particles, the flow path through the small-intestine coil, the surface bump texture. Missing from the data and not modelled: ileum (the jejunum mesh is used for the small-intestine coil), caecum, the four third molars.

## In-app credit

Home screen → "Credits & licences". The scene HUD also carries a one-line credit on every stage.

## Heart and circulation meshes (added for `ch5/heart3d`)

Same provenance route and same caveats as above (extracted from the nqwrc export of Z-Anatomy; `cardiovascular.glb`, `visceral.glb`, `skeletal.glb`, `muscular.glb`; reproducible with `tools/build-heart.mjs`). No kidney, inner-ear or brain model was taken.

| Part id | Layer | Source name | Group | Triangles (high) |
|---|---|---|---|---|
| `right-atrium` | cardiovascular | Right atrium | chamber | 3,499 |
| `left-atrium` | cardiovascular | Left atrium | chamber | 3,499 |
| `right-ventricle` | cardiovascular | Right ventricle | chamber | 4,999 |
| `left-ventricle` | cardiovascular | Left ventricle | chamber | 5,000 |
| `valve-tricuspid-1` | cardiovascular | Inferior leaflet of right atrioventricular valve | valve | 900 |
| `valve-tricuspid-2` | cardiovascular | Septal leaflet of right atrioventricular valve | valve | 900 |
| `valve-mitral` | cardiovascular | Posterior leaflet of left atrioventricular valve | valve | 900 |
| `valve-pulm-1` | cardiovascular | Anterior semilunar leaflet of pulmonary valve | valve | 500 |
| `valve-pulm-2` | cardiovascular | Left semilunar leaflet of pulmonary valve | valve | 500 |
| `valve-pulm-3` | cardiovascular | Right semilunar leaflet of pulmonary valve | valve | 500 |
| `valve-aortic-1` | cardiovascular | Left coronary leaflet | valve | 400 |
| `valve-aortic-2` | cardiovascular | Right coronary leaflet | valve | 400 |
| `valve-aortic-3` | cardiovascular | Non-coronary leaflet | valve | 300 |
| `ascending-aorta` | cardiovascular | Ascending aorta | artery | 576 |
| `aortic-arch` | cardiovascular | Aortic arch | artery | 576 |
| `thoracic-aorta` | cardiovascular | Thoracic aorta | artery | 864 |
| `abdominal-aorta` | cardiovascular | Abdominal aorta | artery | 2,016 |
| `brachiocephalic-trunk` | cardiovascular | Brachiocephalic trunk | artery | 576 |
| `pulmonary-trunk` | cardiovascular | Pulmonary trunk | artery | 230 |
| `pulmonary-artery-l` | cardiovascular | Left pulmonary artery | artery | 2,016 |
| `pulmonary-artery-r` | cardiovascular | Right pulmonary artery | artery | 576 |
| `pulmonary-vein-l1` | cardiovascular | Left superior pulmonary vein | vein | 864 |
| `pulmonary-vein-l2` | cardiovascular | Left inferior pulmonary vein | vein | 864 |
| `pulmonary-vein-r1` | cardiovascular | Right superior pulmonary vein | vein | 1,728 |
| `pulmonary-vein-r2` | cardiovascular | Right inferior pulmonary vein | vein | 576 |
| `superior-vena-cava` | cardiovascular | Superior vena cava | vein | 288 |
| `inferior-vena-cava` | cardiovascular | Inferior vena cava (thoracic part) | vein | 864 |
| `coronary-right` | cardiovascular | Right coronary artery | coronary | 2,499 |
| `coronary-circumflex` | cardiovascular | Circumflex artery of heart | coronary | 1,799 |
| `coronary-lad` | cardiovascular | Anterior interventricular artery | coronary | 1,200 |
| `lung-l-upper` | visceral | Superior lobe of left lung | lung | 6,000 |
| `lung-l-lower` | visceral | Inferior lobe of left lung | lung | 6,000 |
| `lung-r-upper` | visceral | Superior lobe of right lung | lung | 5,500 |
| `lung-r-middle` | visceral | Middle lobe of right lung | lung | 4,500 |
| `lung-r-lower` | visceral | Inferior lobe of right lung | lung | 5,999 |
| `trachea` | visceral | Trachea | airway | 1,799 |
| `bronchus-r` | visceral | Right main bronchus | airway | 288 |
| `bronchus-l` | visceral | Left main bronchus | airway | 576 |
| `sternum-body` | skeletal | Body of sternum | bone | 1,500 |
| `sternum-manubrium` | skeletal | Manubrium of sternum | bone | 899 |
| `sternum-xiphoid` | skeletal | Xiphoid process | bone | 397 |
| `clavicle-l` | skeletal | Clavicle.l | bone | 600 |
| `clavicle-r` | skeletal | Clavicle.r | bone | 600 |
| `diaphragm` | muscular | Diaphragm | landmark | 4,000 |
| `rib-1-l` | skeletal | First rib.l | rib | 700 |
| `rib-2-l` | skeletal | Second rib.l | rib | 699 |
| `rib-3-l` | skeletal | Third rib.l | rib | 699 |
| `rib-4-l` | skeletal | Fourth rib.l | rib | 700 |
| `rib-5-l` | skeletal | Fifth rib.l | rib | 699 |
| `rib-6-l` | skeletal | Sixth rib.l | rib | 700 |
| `rib-7-l` | skeletal | Seventh rib.l | rib | 699 |
| `rib-8-l` | skeletal | Eighth rib.l | rib | 699 |
| `rib-9-l` | skeletal | Ninth rib.l | rib | 700 |
| `rib-10-l` | skeletal | Tenth rib.l | rib | 700 |
| `rib-1-r` | skeletal | First rib.r | rib | 699 |
| `rib-2-r` | skeletal | Second rib.r | rib | 699 |
| `rib-3-r` | skeletal | Third rib.r | rib | 699 |
| `rib-4-r` | skeletal | Fourth rib.r | rib | 699 |
| `rib-5-r` | skeletal | Fifth rib.r | rib | 700 |
| `rib-6-r` | skeletal | Sixth rib.r | rib | 700 |
| `rib-7-r` | skeletal | Seventh rib.r | rib | 700 |
| `rib-8-r` | skeletal | Eighth rib.r | rib | 699 |
| `rib-9-r` | skeletal | Ninth rib.r | rib | 699 |
| `rib-10-r` | skeletal | Tenth rib.r | rib | 700 |

Procedural in this scene: blood particles, the link through the body capillaries, the flow path through the lungs, schematic valve opening and closing. The red / blue colouring is the NCERT convention for oxygenated / deoxygenated blood, not tissue colour. The mitral valve is represented by its posterior leaflet only and the tricuspid by two leaflets (the other leaflets are not in the source data under those names).
# Asset Licence Register — Vigyan Atlas

**Rule:** no 3D model, texture, image, audio, or code snippet is adopted into the app until it has one row here, the licence text has been read by a person, and the owner has cleared commercial use (if the app is ever sold/bundled, non-commercial assets are prohibited — see docs/AUDIT.md §11 Q2).

Status today: **partially populated.** No external 3D model, texture, image, audio, or code snippet has been adopted from outside the repo. All `public/2d/**/images/*.png` files are AI-generated in-session by the agent (no external asset, no external licence). Three.js r160 in `public/lib/` is from npm `three@0.160.0` (MIT).

| Asset | Source repo | Licence (GitHub field) | Licence text read? | Origin traced to author? | Cleared for app? | Date | Notes |
|-------|-------------|------------------------|--------------------|--------------------------|------------------|------|-------|
| 2D AI images — Class IX Biology (20 images) | In-session generation (this repo) | AI generation tool terms | N/A — generated in-session, no external asset adopted | N/A — created by agent in-session | Yes, per generation tool terms (re-verify before any commercial sale/bundle) | 2026-11-11 | public/2d/class9/biology/images/ |
| 2D AI images — Class X Biology (15 images) | In-session generation (this repo) | AI generation tool terms | N/A — generated in-session, no external asset adopted | N/A — created by agent in-session | Yes, per generation tool terms (re-verify before any commercial sale/bundle) | 2026-11-11 | public/2d/class10/biology/images/ |
| 2D AI images — Class IX Chemistry (7 images) | In-session generation (this repo) | AI generation tool terms | N/A — generated in-session, no external asset adopted | N/A — created by agent in-session | Yes, per generation tool terms (re-verify before any commercial sale/bundle) | 2026-11-11 | public/2d/class9/chemistry/images/ |
| 2D AI images — Class X Chemistry (10 images) | In-session generation (this repo) | AI generation tool terms | N/A — generated in-session, no external asset adopted | N/A — created by agent in-session | Yes, per generation tool terms (re-verify before any commercial sale/bundle) | 2026-11-11 | public/2d/class10/chemistry/images/ |
| 2D AI images — Class IX Physics (5 images) | In-session generation (this repo) | AI generation tool terms | N/A — generated in-session, no external asset adopted | N/A — created by agent in-session | Yes, per generation tool terms (re-verify before any commercial sale/bundle) | 2026-11-11 | public/2d/class9/physics/images/ |
| Three.js r160 + addons | npm `three@0.160.0` | MIT | Yes (MIT, npm registry) | Yes (npm / mrdoob/three) | Yes | 2026-11-11 | public/lib/ |

How to add a row:
1. Open the candidate repository (needs it attached read-only, or owner's go-ahead).
2. Read the LICENCE file. "None" = all rights reserved; "NOASSERTION" = read the file text personally.
3. Trace each model to its original author and terms (asset pages often carry their own licence).
4. Fill one row per adopted asset; keep a copy of the licence text in `docs/licences/<asset-name>/` if possible.
