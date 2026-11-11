# Phase 2 — Reference repositories: metadata pass (NOT yet a verified shortlist)

Checked 2026-11-11 through the GitHub search API only: licence field, last push, stars, size, archived flag.
**No README, source file or asset folder has been opened yet**, so no asset has been approved and no model origin has been traced. The verdicts below are provisional and can only get stricter.

`NOASSERTION` means GitHub found a licence file it could not match to a standard licence — it must be read by a person. "None" means no licence file was detected: by default all rights are reserved.

| Repository | Licence (GitHub) | Last push | Stars | Size | Provisional verdict | Why |
|---|---|---|---|---|---|---|
| yihalem123/Human-Organ3D | None | 2025-09-23 | 10 | 84 MB | Reject for assets unless a licence appears | No licence; large size suggests bundled models of unknown origin |
| Grypa-JJ/anatomy-atlas-3d | Unrecognised | 2026-09-12 | 8 | 1.3 MB | Inspect | Active; licence text must be read; small size suggests models load from elsewhere |
| nqwrc/3d-anatomy | Unrecognised | 2026-09-21 | 5 | 34 MB | Inspect | Active; licence text and model sources must be read |
| iamtechartist/human-cell-visualizer | MIT | 2026-07-28 | 33 | 40 kB | Inspect — technique candidate | MIT; at 40 kB it is code, not model files (likely procedural) — relevant to the cell lesson |
| srmk/frog-anatomy | None | 2023-01-04 | 4 | 280 MB | Reject | No licence, inactive since 2023, and frog anatomy is not in the Class IX/X scope here |
| Meteorkid/skeleton-anatomy | Unrecognised | 2026-08-26 | 5 | 13 MB | Inspect | Relevant to the skeletal / joints lesson; licence must be read |
| cellrishi-code/3D-Biology-model | MIT | 2026-02-27 | 0 | 9 kB | Likely reject | MATLAB, 9 kB — not a web asset source |
| lebarba/WebGLVolumeRendering | None | 2026-06-08 | 310 | 25 MB | Technique only, and only by reading | No licence, so no code may be copied; volume rendering of CT/MRI is not needed for the pilot |
| RolandR/VolumeRayCasting | AGPL-3.0 | 2019-10-15 | 67 | 63 MB | Reject | AGPL would oblige the whole app to be released under AGPL; inactive since 2019 |
| JaneliaSciComp/web-vol-viewer | Unrecognised | 2026-06-08 | 12 | 27 MB | Out of scope for now | Volume viewer for microscopy data; no lesson needs volumetric data yet |
| KitwareMedical/vtk.js-examples | None | 2024-11-07 | 30 | 185 kB | Reject | Archived; vtk.js is a second rendering engine, not compatible with keeping the existing Three.js app |
| josdirksen/threejs-cookbook | None | 2015-08-31 | 454 | 112 MB | Reject | 2015 code for a Three.js version ~90 releases older than r160; no licence |
| gkjohnson/urdf-loaders | Apache-2.0 | 2026-10-31 | 822 | 14 MB | Out of scope | Well maintained, but it loads robot descriptions; no syllabus topic needs it |
| janelia-cellmap/cellmap-segmentation-challenge | BSD-3-Clause | 2026-07-10 | 43 | 6.9 MB | Out of scope | Python research tooling for electron-microscopy segmentation, not web assets |

## Inspection pass — four repositories opened (2026-11-11)

Shallow clones, read only. Licence, notice and attribution files were read; model files were listed and one was parsed.

| Repository | What is actually in it | Licence as written by the author | Verdict |
|---|---|---|---|
| nqwrc/3d-anatomy | Seven Draco-compressed GLB files (`visceral` 1.8 MB, `cardiovascular` 5.6 MB, `muscular` 4.5 MB, `nervous` 3.8 MB, `skeletal` 1.9 MB, `joints` 0.9 MB, `lymphatic` 0.4 MB), exported from the Z-Anatomy Blender file. `visceral.glb`: 105 separate named meshes, 690,351 triangles, 14 materials, **no textures, no animations**. It contains Stomach, Liver (with segments), Gallbladder, Pancreas and ducts, Oesophagus, Duodenum, Jejunum, the four parts of the colon, Appendix, Tongue, Parotid glands, and the three parts of the pharynx | Code MIT-style, but **the distribution as a whole is CC BY-NC-SA 4.0** — the author states the non-commercial clause comes from two added models (a kidney, CC BY-NC; an inner ear, CC BY-NC-SA). Two brain models have no stated licence | **Do not take the files from here.** Use it as proof that the upstream data has the organs we need, as separate meshes, at a usable size |
| Grypa-JJ/anatomy-atlas-3d | Application code and a Blender-to-GLB extraction pipeline (Python). The GLB layers themselves are **not in the repository** (git-ignored; ~29 MB, ~2,500 structures per its README) | Code MIT. Geometry CC BY-SA, adapted from BodyParts3D and Z-Anatomy; a clear `ATTRIBUTION.md` | **Technique only**: the extraction scripts show how to export named layers from the Z-Anatomy file |
| Meteorkid/skeleton-anatomy | One 16 MB skeleton GLB taken from a Sketchfab model | LICENSE file is a "source-available, non-commercial" licence that permits viewing only; the README badge says AGPL v3. The two disagree, and the Sketchfab model's own terms are not reproduced | **Reject** — contradictory licence and an unverified third-party model |
| iamtechartist/human-cell-visualizer | A single 120 kB HTML file; the cell is generated in code, with Three.js loaded from a CDN. No model files | MIT | **Technique only** — a reference for procedural organelle detail when the cell lesson is upgraded; cannot be dropped in (it depends on a CDN, and this app must work offline) |

### The real finding: the upstream source

Both anatomy repositories trace to the same two openly licensed sources:

- **BodyParts3D** — The Database Center for Life Science — **CC BY-SA 2.1 Japan**
- **Z-Anatomy** — the open-source atlas of anatomy — **CC BY-SA 4.0**

Share-alike with attribution permits redistribution, including commercially, provided the models and anything derived from them stay under the same licence and both sources are credited. That is a workable basis for this app. Neither source has been opened directly yet; their terms must be read on their own pages before any file is adopted.

### Gaps the upstream data will not fill (seen in `visceral.glb`)

- No mesh named for teeth, the oral cavity, the ileum, the rectum or the anal canal was found in this file. Teeth are probably in the skeletal layer and the others may exist upstream under different names — **not checked**.
- No villi (microscopic; must be modelled separately).
- No textures: organs are flat-coloured. "Realistic surface materials" will have to be authored.
- No animation: peristalsis, churning and food movement must be built in the engine.
- 690,351 triangles for one layer is far above the phone budget; the digestive subset needs extracting and simplifying.

## What this means for the digestive pilot

None of the fourteen repositories is itself a source to copy from. The inspection did identify the upstream data (BodyParts3D / Z-Anatomy) that can supply most digestive organs under CC BY-SA, with the gaps listed above.

## Still to do

1. Read the BodyParts3D and Z-Anatomy licence terms at source and confirm share-alike is acceptable to the owner.
2. Obtain the digestive subset from upstream (not from the non-commercial bundle), confirm which of teeth, ileum, rectum and anal canal exist, and record each mesh in `docs/ASSET_LICENSES.md`.
3. The ten repositories not opened keep their provisional verdicts above; none is needed for the pilot.
