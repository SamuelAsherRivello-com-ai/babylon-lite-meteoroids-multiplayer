# Proposal

## Why

Create a cooperative, pixel-perfect Asteroids game for one to four players whose shared world belongs to a fixed player host. Planning before implementation is necessary because the template supplies presentation rather than gameplay, and the shared server's existing lifecycle does not provide all of the requested lives, spectator, and fixed-host semantics.

## What Changes

- Generate the future game repository from `SamuelAsherRivello/github-repository-template`, preserve this planning work, import the required shared skills with provenance, and adapt the React/Babylon Lite WebGPU shell into a landscape asteroid arena.
- Add an isolated `asteroids-coop` contract to `SamuelAsherRivello/rmc-colyseus-multiplayer-server`, reusing private room admission, player metadata, shared-client subscriptions, hot joining, and hot dropping.
- Keep the room creator as the sole gameplay simulation host, including while spectating. End the session and return guests to the lobby when that host leaves or disconnects; do not elect a successor.
- Implement asteroid damage, bounded probabilistic fracturing, and wave progression. Wave one is exactly three one-hit parents, each producing two one-hit terminal fragments. From wave two, starting counts scale with living players captured at wave start.
- Give each player three lives across the entire run; third death means spectating until a collective wave-one restart. New guests can enter mid-wave with three lives; existing eliminated identities must not regain lives by reconnecting.
- Build responsive local prediction, guest interpolation, pixel-art presentation, keyboard/touch input, and visible networking/recovery states.
- Plan backend-first verification and release, then client integration, gameplay verification, GitHub Pages delivery, and synchronized local checkouts. This invocation creates planning artifacts only.
- After team defeat, show results for five seconds and automatically restart all connected players together at wave one with three lives.
- Preserve returning guests' lives and spectator status for the room session using a room-scoped recovery identity. Require verified renewal and state continuity on the existing free hosting before public delivery.

## Capabilities

### New Capabilities

- `asteroid-waves`: Wrapping ship combat, asteroid damage/fracture rules, bounded difficulty, and player-count scaling.
- `cooperative-run-lifecycle`: Three personal lives, respawns, spectators, mid-run participation, defeat, and collective reset.
- `fixed-host-multiplayer`: Private four-seat rooms, authenticated host publication, ordered input, late-join state, guest recovery, and terminal host loss.
- `pixel-game-presentation`: Template-based landscape WebGPU presentation, pixel rendering, controls, HUD, sound, and failure recovery.
- `game-delivery`: Template provenance, compatible shared-client/backend release, meaningful verification, and Pages publication.

### Modified Capabilities

None in this newly initialized planning root. Shared-server changes must be reconciled into that repository's existing OpenSpec capabilities during a future apply; this local change does not overwrite its specs or active hosting work.

## Impact

- Future game source: renamed `asteroids/` application directory, root package/Vite configuration, documentation, `version.txt`, and release/Pages workflows.
- Future backend source: additive room registration/admission, `multiplayer-server/src/asteroids-room.ts`, browser client contract, integration tests, game registry, and deployment checks. Existing consumers retain their protocols.
- The inspected backend is version `0.9.9`, uses process-local rooms, and deploys through Vercel. Its four-minute probe does not prove an unlimited run; sustained hosting is a delivery gate, coordinated with `standardize-private-room-flow` rather than assumed complete.
- This folder originally contained no Git repository or application. No application/server code, remote repository, deployment, commit, or release is created by this proposal.
- The three follow-up interview decisions are confirmed. Tool compatibility and sustained free-hosting verification remain technical implementation/delivery gates, not permission to reduce the requested scope.
