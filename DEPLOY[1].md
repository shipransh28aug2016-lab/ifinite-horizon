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
