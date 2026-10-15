# Brink Terminal

Production frontend: https://brink-terminal.iv.studio

The frontend runs on Cloudflare Pages. The existing game API remains on Heroku:
https://pacific-wildwood-12937-dbfccb51eaa2.herokuapp.com

## Develop

Use Node 22 (`nvm use`), then `npm ci` and `npm run dev`.
Build the terminal with `npm run build`. The log viewer lives behind backend authentication.
Dependencies are locked; `.npmrc` uses the official registry because the local mirror lacks Rive.
Rive runtimes remain pinned to 2.19.0 to match the map's WASM.

## Deployment

GitHub Actions builds pull requests. Pushes to `main` and manual workflow runs on
`main` also deploy `dist` to the Cloudflare Pages project `brink-terminal`.

One-time setup:

1. Create a Cloudflare Pages **Direct Upload** project named `brink-terminal`.
2. In GitHub Settings → Secrets and variables → Actions, add repository secrets:
   - `CLOUDFLARE_ACCOUNT_ID`: the account hosting the Pages project.
   - `CLOUDFLARE_API_TOKEN`: a token with Account → Cloudflare Pages → Edit,
     scoped to that account.
3. Run the “Build and deploy Brink Terminal” GitHub workflow on `main`.
4. In Pages → brink-terminal → Custom domains, add `brink-terminal.iv.studio`.
   If DNS is external, add the CNAME Cloudflare supplies after associating the domain.
5. Verify HTTPS, the username screen, command responses, animations, and a chapter URL.

Client-side chapter URLs use `public/_redirects` to serve the terminal shell.
The API accepts cross-origin requests. External Rive, images, audio, and fonts
continue using the original CDN addresses.

## Verification

The production build and an isolated Chromium startup check pass: the terminal boots,
shows the username prompt, and loads its external assets without browser errors.
The Heroku `/api/hello` endpoint returns HTTP 200. Full gameplay is not yet verified.

## Recovery notes

Recovered from `Brink Terminal Parcel v2`, including the local 1.60 version update.
The original folder and its history remain untouched. Its history tracked dependency
and generated build folders, so this repository starts with source and a clean lockfile.
The recovered backend is now in `backend/`; see [backend deployment and administration](backend/README.md).

The former public database-viewer address redirects to the authenticated backend viewer.
Backend deployments are separate from the automatic frontend release.

Startup repairs defer the enemy subclass until imports finish and evaluate the ship
parts label when read. This avoids circular-import initialization failures in Parcel 2.
