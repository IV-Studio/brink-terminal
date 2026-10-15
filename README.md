# Brink Terminal

Production frontend: https://brink-terminal.iv.studio

The frontend runs on Cloudflare Pages. The existing game API remains on Heroku:
https://pacific-wildwood-12937-dbfccb51eaa2.herokuapp.com

## Develop

Use Node 22 (`nvm use`), then `npm ci` and `npm run dev`.
Build both the terminal and database viewer with `npm run build`.
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

## Recovery notes

Recovered from `Brink Terminal Parcel v2`, including the local 1.60 version update.
The original folder and its history remain untouched. Its history tracked dependency
and generated build folders, so this repository starts with source and a clean lockfile.
The original backend was recovered separately from Heroku; it is not changed by this workflow.

The database viewer is an existing public page. Access control and backend logging
should be reviewed before expanding functionality.
