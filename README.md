# Brink Terminal

Production frontend: https://brink-terminal.iv.studio

The frontend runs on Cloudflare Pages. The existing game API remains on Heroku:
https://pacific-wildwood-12937-dbfccb51eaa2.herokuapp.com

## Develop

Use Node 22 (`nvm use`), then `npm ci` and `npm run dev`.
Build the terminal with `npm run build`. The log viewer lives behind backend authentication.
Dependencies are locked; `.npmrc` uses the official registry because the local mirror lacks Rive.
The map runtime remains pinned to 2.19.0 to match its WASM; the existing keyboard/logo runtime stays unchanged.

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

Startup is coordinated by `src/js/startup.js`. Modules define game classes and content;
the coordinator constructs game objects explicitly and waits for animation inputs
before checking the API and enabling input. Repeated startup calls share one promise.

## Active game systems

- Ships and upgrades: `src/js/content/Ship/ships.ts`.
- Ship parts: `src/js/content/Ship Parts/shipParts.ts`.
- Inventory and items: `src/js/content/Items/`.
- Exploration and map content: `src/js/content/Map/`.
- Combat and enemies: `src/js/content/Combat/`.

The obsolete root JavaScript ship, inventory, parts, world, and map-data modules
were removed after tracing their consumers and comparing active gameplay behavior.
Their earlier versions remain in Git history. Keep new work in the active modules.
Shared ship behavior lives in `Ship/shipBase.ts`, independent of game construction.
Rendering dependencies are supplied during startup, so enemies extend the base class directly.

CI also boots the actual production bundle in headless Chromium before deployment.
Locally, run `npx playwright install chromium`, `npm run build`, and `npm run test:browser`.
Map enemy identifiers live in `Combat/enemyIds.ts` to avoid loading combat runtime
through static map definitions.

Startup checks also cover delayed map loading, a key-card URL, an unavailable API,
and an animation load failure. The gameplay comparison still matches the pre-cleanup
baseline for inventory, exploration, combat damage, and docking.

## API and text rendering

`src/js/api.js` owns game requests, including HTTP status checks, a 10-second
request/body timeout, and validation of command-response envelopes. It does not
retry state-changing commands. Failures appear in the terminal and release input;
unconfirmed combat logging does not stop local gameplay.

Frontend JSDoc and backend annotations reference the shared contract in
`backend/shared/api.d.ts`. These describe the existing protocol; no new transport
or player-state persistence is introduced.

Player input is kept in a plain-text buffer, independent of terminal HTML.
`backend/shared/html.cjs` escapes inserted player text on both sides, while authored
story markup remains supported. The typewriters consume complete tags and entities.
