# Deploy Vigyan Atlas on Vercel (static, no build step, no dependencies)

**Option A — drag & drop / CLI (2 minutes)**
1. Install Node 18+ once, then in this `vercel/` folder run: `npx vercel login` → `npx vercel --prod`
2. Questions: Set up and deploy? **Y** · Link to existing project? **N** · Directory? **./** · Override settings? **N**
3. Open the printed `https://….vercel.app` URL on the projector PC. First load online once; after that it works offline (PWA).

**Option B — GitHub**
Push the `vercel/` folder to a repo → vercel.com → Add New Project → Import → Framework: *Other* → Deploy. (`vercel.json` already sets output = `public`.)

**Rebuild after code changes:** `bash tools/make-vercel.sh` (in the full source), then redeploy.

Notes: no env vars, no API keys, no backend, no database. HTTPS (automatic on Vercel) enables the **Install app** button and offline mode. Student reports stay in each browser (no server).
Keys: **N** chapters panel · **P** lesson panel · **H** home · **F** fps · ←/→ steps · Space play/pause · Esc close.

## 3D | 2D switch (one screen)
The app is the root `index.html`. The **3D | 2D** switch sits in its top bar and on Home (key **V**); 2D shows the labelled image for the *current* topic in the same stage, with the same chapters and lesson panel. Code + topic→image map: `assets/va-2d.js`; images: `public/2d/<class>/<subject>/images/`. Deep link: `index.html?view=2d#ch5/heart`.
Deploy the **repository root** (GitHub Pages: branch root; Vercel: `outputDirectory` is `.`). `public/index.html` and `public/science/index.html` only forward old links to the app.
