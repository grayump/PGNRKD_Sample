# NRKD Chito-ryu — clickable PWA prototype

A no-database, installable click-through of the club portal, for showing the
instructor. Sample data only; "changes" are kept in the browser's
`localStorage` and can be wiped with **Reset demo data** (top banner).

This folder is fully self-contained (plain HTML/CSS/JS, Bootstrap bundled
locally) and changes nothing in `../src` (the real .NET app).

## Run it locally

Service workers need `http://`, not `file://`, so open it through a tiny
static server rather than double-clicking `index.html`:

```powershell
# From the repo root, using Node (no install needed):
npx serve prototype
#   or
npx http-server prototype -p 8123
```

Then open the printed URL (e.g. http://localhost:8123). In VS Code you can
also right-click `index.html` → **Open with Live Server**.

Sign in with anything (demo gate). Try: tick a member's curriculum items and
watch the **Grading** screen update; tick attendance; assign lesson plans in a
**Session Plan**; record a payment and watch **Dues** drop.

## Publish to GitHub Pages (only this folder)

A workflow at `../.github/workflows/pages.yml` uploads **only** `prototype/`
as the Pages artifact — the .NET app is never built or served.

1. Push to `master`.
2. Repo **Settings → Pages → Source = "GitHub Actions"** (one-time).
3. The workflow deploys to `https://<user>.github.io/<repo>/`, which installs
   as an app on a phone ("Add to Home Screen") and works offline.
