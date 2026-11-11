# Vigyan Atlas — Realism Demo (`public/realism-demo.html`)

Standalone proof-of-concept showing what enriched visuals can look like for Class IX & X science. Built with **three.js r160** (same version bundled in `index.html`) — no build step, open `public/realism-demo.html` directly or serve the `public/` folder.

## Three style modes
1. **Schematic** — today's app look: flat primitives, clear for exams.
2. **Anime** — cel shading, gradient map, thick outlines, animated motion/dash lines. Best for waves, ray optics, electron flow, blood-flow arrows.
3. **Ultra-realistic** — PBR tissue (clearcoat wet look), surgical spotlight + fill + rim lights, bloom, ACES tone mapping. **Biology goal:** look like a doctor viewing inside the body during surgery.

### PBR tissue presets (built-in three.js r160 — no external package)
In Ultra-realistic mode, the **PBR tissue preset** picker swaps the heart material between built-in `MeshStandardMaterial`/`MeshPhysicalMaterial` presets — no npm install required:
- **Skin** — `MeshStandardMaterial` with clearcoat sheen approximating subsurface scattering (warm flesh).
- **Wet mucosa** — `MeshPhysicalMaterial` with strong clearcoat + slight transmission (glossy wet organ surface).
- **Bone** — `MeshStandardMaterial` matte, non-metallic, porous.
- **Glass** — `MeshPhysicalMaterial` with transmission + clearcoat + IOR refraction.

## Features demonstrated
- **Subjects:** Biology (beating heart), Chemistry (molecule with covalent bonds), Physics (prism dispersion into VIBGYOR).
- **Cross-section slider:** slice the heart open live like a surgeon's view.
- **Isolate / transparency:** focus on one organ or see through others.
- **Play/pause:** beating animation, molecule rotation, flowing ray motion lines.
- **Labels:** bilingual-ready 3D labels tracking parts (heart chambers, aorta, pulmonary artery, vena cava, coronary vessels).

## How to merge into the app
The demo is procedural (no external models). For the real app:
1. Decide architecture (recover original source + build, OR add a lazily loaded asset module) — see `docs/VISUAL_AUDIT_REPORT.md` §3 and §10.
2. Add the asset pipeline: GLTFLoader + DRACO + AnimationMixer + fetch/cache (three.js r160).
3. Port the style system (Schematic / Anime / Ultra-realistic) per scene, keeping the existing label/step/predict/quiz contract.
4. Record every adopted asset's licence in `docs/ASSET_LICENSES.md`.

## Files
- `realism-demo.html` — the demo
- `lib/three.module.js` — three.js r160 ESM (from npm `three@0.160.0`)
- `lib/three.min.js` — three.js r160 UMD bundle
- `lib/*.js` — OrbitControls, EffectComposer, RenderPass, ShaderPass, UnrealBloomPass, CopyShader, LuminosityHighPassShader

**Note:** `lib/` is third-party code (three.js, MIT). It is not part of the minified `index.html` bundle yet — do not commit binary model textures here; keep the repo light for school connectivity.
