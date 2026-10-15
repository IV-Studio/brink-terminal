# Brink Terminal cleanup

Reviewed October 15, 2026. The site is live, automated frontend deployment works,
and gameplay has been checked by Zac. Preserve that behavior while cleaning up.

## 1. Backend credentials, access, and source control

- [x] Replace hardcoded database connection strings with Heroku environment configuration.
- [x] Rotate the embedded database credential and verify logging still works.
- [x] Protect `/api/command-logs` and its database viewer with appropriate access control.
- [x] Replace the username-based `ivadmin` override with an explicit, protected development/admin mechanism.
- [x] Bring the sanitized backend into this repository; exclude dependencies, secrets, and generated files.
- [x] Document backend deployment and rollback alongside the existing Cloudflare workflow.

The backend review used source recovered from the `pacific-wildwood-12937`
Heroku Git repository. Sanitized source is now in `backend/`.

Verified October 15, 2026: admin credentials are configured, anonymous admin/log
requests return HTTP 401, authenticated requests return HTTP 200, and normal
username requests are logged using the rotated database credential. See `backend/README.md`.

## 2. Confirmed bugs and regression coverage

- [x] Fix `src/js/statemanager.js`: nested writes must check `currentState`, not the root `SM.state`. Reproduced: setting `ship.inventory.capacity`, then `ship.inventory.items`, deletes `capacity`.
- [x] Fix backend combat logging: destructuring strings such as `const { context } = 'kill'` produces `undefined`; assign the intended values directly.
- [x] Handle rejected logging promises without unhandled rejections.
- [x] Fix the logging query error path that references an unavailable Express `res` object.
- [x] Add regression tests for these failures before refactoring surrounding code.

## 3. Duplicate systems and startup dependencies

- [x] Trace references to the older `src/js/ships.js`, `items.js`, `world.js`, and `shipParts.js` implementations.
- [x] Consolidate ships, inventory, and exploration onto the active TypeScript implementations. Some older modules still run at startup; do not delete them blindly.
- [ ] Introduce one explicit startup function for state, game objects, animation readiness, and networking.
- [ ] Remove import-time construction and side effects where they cause circular dependencies.
- [ ] Replace the restoration workaround that defers the enemy subclass once initialization is reliable.
- [ ] Preserve chapter/key-card URL behavior and existing command responses.

Legacy cleanup verified October 15, 2026: removed five obsolete JavaScript modules
and the unused startup calls. An isolated browser comparison matched startup,
station access, inventory capacity/add/remove behavior, exploration, combat damage,
and docking before and after removal. Active content and balancing are unchanged.

## 4. API requests and rendering

- [ ] Centralize the backend URL and API calls in one client module.
- [ ] Check HTTP status, validate response shapes, and add request timeouts.
- [ ] Show useful connection failures in the terminal, with reliable loading-state cleanup.
- [ ] Share command/request/response types where practical.
- [ ] Escape player-supplied text before inserting it into HTML; preserve intentional markup in authored content.

## 5. Verification and types

- [ ] Add repeatable browser smoke checks to CI for startup, username entry, and chapter links.
- [ ] Cover inventory transfers, purchases/credits, and combat damage with focused tests.
- [ ] Introduce a TypeScript configuration and type checking incrementally.
- [ ] Keep deployment checks separate from gameplay behavior checks; compilation alone does not verify startup.

## 6. Content organization

- [ ] Extract tile definitions from the roughly 1,700-line `src/js/content/Map/map.ts` into content modules.
- [ ] Separate enemy definitions, item definitions, and upgrade tables from game mechanics.
- [ ] Review historical campaign dates before changing release/clearance behavior.
- [ ] Decide whether the armory's debug stock additions are intentional before removing them.

## 7. Housekeeping and assets

- [ ] Standardize filenames, folder casing, and import conventions.
- [ ] Add consistent formatting and linting; remove dead comments and debug logs.
- [ ] Centralize asset URLs and version configuration.
- [ ] Align Rive runtime versions in a separate change with keyboard, logo, map, and combat animation checks.
- [ ] Revisit build optimization settings after circular-import cleanup and regression coverage.

## Working approach

Work in small, reviewable changes in the order above. Keep gameplay and content
unchanged unless a change is explicitly called out. Run focused tests and a build
for each relevant change, then smoke-check the deployed terminal after release.

Use files, terminal commands, and APIs. Ask Zac to perform any required dashboard
or desktop interactions; do not take over the computer.
