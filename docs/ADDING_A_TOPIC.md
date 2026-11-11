# Adding a realistic CBSE IX/X topic

1. **Decide if realism helps.** Anatomy, cells, tissues, apparatus: yes. Graphs, ray diagrams, circuits, particle models: keep schematic.
2. **Find or model the assets.** Record source, author, licence and attribution in `docs/ASSET_LICENSES.md` *before* using a file. Reject untraceable origin, non-commercial or no-derivatives terms, and contradictory licences.
3. **Build the files.** Copy `tools/build-digestive.mjs`, change the `WANT` table (id → layer, source mesh name, group, triangle budget for High and Fast), run it (`npm i` inside `tools/`), and put the output in `assets/<topic>/`. Budget: ≤ 5 MB, ≤ 300 k triangles High, ≤ 80 k Fast.
4. **Write the scene** in the engine (see `Mdigest` in `index.html`): `build()` returns the primitive scene while `X9.dg`-style state is not ready, starts `import("assets/va-assets.js")`, and calls `__atlas.rebuild(key)` when loaded. Register the topic in its chapter with `topics.splice(...)`.
5. **Give every structure** an id, a bilingual label, an info card and a kind: anatomical, conceptual or microscopic. Mark anything procedural as schematic on screen.
6. **Use the shared interactions**: pick → info, isolate, transparent, cut-away, exploded where sensible, camera presets, one step per process stage, quiz bank in `cf`, real-life card in `Px`.
7. **Test**: `node tests/regression.js <url>`, block the asset URL, open from `file://`, check geometry counts after visiting ten other scenes, then a real phone.
8. **Validate**: NCERT wording, Hindi terms, accuracy checklist in `docs/TESTING.md`; a subject teacher signs off before release.
