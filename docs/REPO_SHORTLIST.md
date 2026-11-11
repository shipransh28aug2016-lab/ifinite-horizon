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

## What this means for the digestive pilot

On metadata alone, **none of the fourteen is a confirmed source of a redistributable digestive-system model.** Four deserve a real inspection (anatomy-atlas-3d, 3d-anatomy, skeleton-anatomy, human-cell-visualizer); the first two are the only ones that might contain digestive organs.

## Still to do before this is a "verified shortlist"

1. Open each "Inspect" repository: read the licence text, list model files, and trace each model to its original author and terms.
2. Look beyond this list for openly licensed anatomy with clear provenance, checking the licence on each asset's own page.
3. Start `docs/ASSET_LICENSES.md` with one row per asset actually adopted. It is empty today because nothing has been adopted.

Access note: this session can search GitHub but can read files only in repositories attached to it. Inspecting the four candidates needs them attached (read-only) or the owner's go-ahead to do so.
