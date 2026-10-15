# Brink Terminal backend

Source recovered from Heroku revision `daeb2e29b920fc94a869c796f67736c640c99f95`.
The frontend workflow tests this backend; backend releases are deliberately separate.
Production uses Heroku-26 with Node 22 (verified October 15, 2026).

## Configuration

- `DATABASE_URL`: supplied and maintained by the attached Heroku Postgres add-on.
- `ADMIN_USERNAME` and `ADMIN_PASSWORD`: set both in Heroku Settings → Config Vars.
  Choose a unique password and a username without a colon. Missing credentials disable
  admin routes with HTTP 503. Never commit values or put them in frontend build variables.
- `PORT`: provided by Heroku; defaults to 3001 locally.

The existing Heroku database SSL settings are retained in this change. Local development
needs a compatible Postgres connection; do not disable database transport protections
in production to accommodate a local database.

Use Node 22, `npm ci --prefix backend`, then supply environment variables and run
`npm start --prefix backend`. Run `npm test --prefix backend` for isolated access-control
and username-flow tests; these tests do not use the production database.

## Administration

Open the HTTPS API host at `/admin/logs`. The browser prompts for the configured
admin username/password. The same HTTP Basic authentication protects `/api/command-logs`.
Responses are marked `Cache-Control: no-store`; the viewer uses same-origin requests.
The former frontend `/databaseview.html` address redirects to this protected viewer.

Usernames beginning with `ivadmin` are ordinary usernames and are logged normally.
Authenticated tools can POST JSON `{ "clearanceLevel": 3 }` to `/api/admin/clearance`
to obtain a clearance/keyword response for testing; never embed the credentials in
client code. This endpoint does not persist player state or make the game's existing
client-supplied state authoritative.

## Release

1. Run backend tests and the frontend build. Commit the reviewed source to GitHub.
2. Authenticate the Heroku CLI to the existing app `pacific-wildwood-12937`.
3. From the repository root, run `npm run deploy:backend`.
4. Verify `/api/hello` returns HTTP 200, unauthenticated admin routes deny access,
   normal username/game commands work, and logging reaches Postgres.

The script exports only committed `backend/` contents into a temporary checkout of
Heroku's existing Git branch and pushes a normal descendant commit. It preserves
Heroku history without force-pushing, copies no local dependencies or secrets, and
records the GitHub source revision in `.brink-source-revision` in the deployed source.
Frontend pushes to `main` continue deploying through GitHub Actions to Cloudflare.

## Credential rotation — operator step after the secure release

In your own terminal, run:

```sh
heroku pg:credentials:rotate DATABASE_URL --app pacific-wildwood-12937
```

Heroku updates the managed `DATABASE_URL` and restarts attached apps. Do not paste
credentials into chat or manually replace the add-on-managed URL. After rotation,
verify gameplay and a new command-log entry. Rotation invalidates the credential
embedded in the historical source; removing it from new files alone is insufficient.
See https://devcenter.heroku.com/articles/heroku-postgresql-credentials.

## Rollback

Inspect releases with `heroku releases --app pacific-wildwood-12937`.
A release can be reverted with `heroku rollback vNN --app pacific-wildwood-12937`,
but review its configuration and source first: old releases restore the username
bypass, public logs, and hardcoded database credential, which must remain invalidated.
Prefer redeploying a known-good **sanitized** GitHub commit with the deployment script.
Do not roll back a database credential rotation or restore a stale `DATABASE_URL`.
No database schema or player data migration is part of this change.
