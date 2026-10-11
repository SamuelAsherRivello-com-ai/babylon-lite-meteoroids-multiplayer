# Tasks

The user explicitly requested implementation with Playwright after the three-question interview and artifact update. Checkboxes record verified completion only. Following the explicit continuation instruction, independent rules/protocol work proceeds while the hosting gate is resolved. The hosting and backend-first release gates remain binding; server tasks belong in the server repository and must preserve unrelated work.

## 1. Resolve readiness gates before apply

- [x] 1.1 Confirm the automatic five-second restart and reconcile proposal, lifecycle spec and design; verify all describe returning connected players together at wave one with three lives. Behavioral replay tests remain in 2.6.
- [x] 1.2 Reconcile the template's OpenSpec 1.13.1 pin with the installed planning CLI 1.14.0 using project-local tooling; verified strict validation, generated six Codex skill folders with matching names and generatedBy 1.13.1, .openspec-target=codex and healthy doctor output without changing global tooling or losing this change.
- [x] 1.3 Reconcile the shared server's hosting config, active proposal and accepted hosting specs in its own planning root; verify a documented sustained-session approach and host-renewal semantics on existing free hosting. Record public delivery as blocked if this cannot be proven; bounded sessions and paid hosting are excluded by the confirmed decision.
- [x] 1.4 Capture confirmed rules separately from tuning candidates and define a named immutable tuning configuration; verify wave-one exactness and review caps, respawn/intermission values, scoring, simulation rates and roster sampling against the specs.
- [x] 1.5 Recheck source revisions, repository ownership/access and current default branches; verify no matching repository is overwritten and no feature branch/worktree is used without a request. Preserve this planning root when integrating the template later.

## 2. Shared browser-safe rules core in the server repository

- [x] 2.1 Create/reconcile the scoped Asteroids OpenSpec change in the server's resolved planning root; verify it references this contract and preserves unrelated hosting and existing-game changes.
- [x] 2.2 Add the isolated browser-safe Asteroids rules export for ship movement, wrapping, projectile lifetimes and collisions; verify deterministic tests for wrapped collisions, one-hit-per-projectile, friendly-fire exclusion and stale-input neutralization.
- [x] 2.3 Add asteroid health, seeded bounded fracturing and atomic descendant insertion; verify the exact three-parent/six-child/nine-hit wave-one tree and termination/health/entity bounds over seeded later-wave tests.
- [x] 2.4 Add wave-start living-roster sampling and capped progression; verify 1/2/3/4-player scaling begins at wave two, excludes spectators, includes respawning players and never changes on mid-wave join/drop.
- [x] 2.5 Add player run ledger, deaths, safe respawns, spectator state, defeat and reset primitives; verify three deaths across waves, single charge for simultaneous collisions, noninteractive spectators, host-as-spectator and same-tick defeat priority.
- [x] 2.6 Implement automatic restart after five seconds of defeat/results; verify collective reset with 1–4 connected participants, arrival during defeat, zero stale old-run input and all spectators returning with three lives.
- [x] 2.7 Document rules, tuning, state ownership and browser-safe package export in the shared-client API and game registry; verify Node/browser imports do not pull server-only modules into the consumer.

## 3. Isolated fixed-host room and recovery contract

- [x] 3.1 Add `asteroids-coop` registration and coded create/join admission with capacity four; verify editable code collision, invalid/expired/full cases, URL joins, room isolation and existing admission regressions.
- [x] 3.2 Bind creator host authority and ordered guest input/membership events; verify forged host publication, identity spoofing, nonfinite inputs, replayed sequences and rate-limit cases are rejected while valid input reaches the host.
- [x] 3.3 Add validated compact complete snapshots and late-join baseline delivery; verify worst-case encoded frames stay below the selected wire budget within the current 16,384-byte transport ceiling, and guests receive damaged asteroids/fragments without resetting them.
- [x] 3.4 Add authenticated room-scoped guest recovery independent of seat/socket ID; verify hot drop frees connected capacity, valid return preserves lives/elimination, newcomers cannot inherit another ledger, full recovery cannot displace players and retained-ledger bounds have explicit errors.
- [x] 3.5 Add terminal host loss handling and invite invalidation; verify both explicit leave and detected socket failure end the room without host election, including when the host is spectating.
- [x] 3.6 Extend the shared client additively for Asteroids input, membership, identity recovery and terminal `sessionEnded`; verify generic retry stops on terminal closure and existing games retain their recovery/election behavior.
- [x] 3.7 Add headless-host two-client integration tests for join/drop, damaged-state late join, guest reconnect, reset ordering, host closure and capacity; verify tests run locally and through `SERVER_URL` with isolated room codes.
- [x] 3.8 Update backend README, alphabetical demo registry and shared-client API with Asteroids authority, fresh/recovered identity distinction, capacity and known limits; verify `npm run check:docs`, `npm run typecheck` and full `npm test` regressions pass.

## 4. Backend hosting and release gate

- [x] 4.1 Integrate only the hosting prerequisite selected in 1.3 within the server's own authorized scope; verify real WebSocket create/join and guest recovery across relevant connection windows, with no second authority and terminal behavior for actual host loss.
- [x] 4.2 Add Asteroids live probes to staged/public deployment verification; verify at least ten minutes of two-client shared state across two expected connection windows, guest recovery and consistent wave/lives/asteroid health, or retain an explicit delivery blocker.
- [x] 4.3 Run `npm ci`, docs/type/test checks and client package dry-run from the server root; verify the package includes the Asteroids export and existing consumers still import their unchanged APIs.
- [x] 4.4 Run the inspected server Release workflow with a new version only after apply/delivery authorization and prior gates pass; verify staged tests, promotion, stable health version, public Asteroids probe, tag and client tarball before recording a usable package URL.
- [x] 4.5 Record server commit/release/client asset/endpoint and hosting evidence in server docs and this design; verify the local server checkout fast-forwards to release-generated commits and keeps unrelated staged changes outside all scoped commits.

## 5. Establish the template-based game after backend verification

- [x] 5.1 Generate the destination with GitHub's template flow if it does not already exist; verify template provenance, fresh bootstrap history before project changes, correct origin/default branch and preservation of this OpenSpec change during staged local integration.
- [x] 5.2 Rename the app directory to `asteroids/` and adapt root scripts, Vite base/root, ignores, docs and Pages artifact paths; verify no unintended `project-name` paths remain and baseline install/test/build commands work.
- [x] 5.3 Import required real skill files from the recorded skills-library revision with provenance, licensing and collision review; verify generated OpenSpec skills use supported tooling and no global or customized files are silently overwritten.
- [x] 5.4 Pin the exact verified shared-client tarball and secure production endpoint, provide a credential-free local override example; verify lockfile installation and successful public private-room admission without offline fallback.
- [x] 5.5 Update README original prompt/follow-up blocks, project identity and credits; verify quoted user text is not replaced with the generated brief and mark the missing source share URL as unverified rather than inventing it.

## 6. Game integration and presentation

- [x] 6.1 Integrate host rules and guest prediction/reconciliation with monotonic fixed-step scheduling independent of rendering/dialogs; verify local movement responds immediately, host settings do not pause guests and bounded catch-up handles host stalls visibly.
- [x] 6.2 Add wrap-aware remote interpolation, input acknowledgements, run-ID flushing and immediate cosmetic fire feedback; verify a 150 ms simulated RTT with approximately ±50 ms jitter and document observed corrections, state agreement and remaining limits.
- [x] 6.3 Replace the showcase with original landscape pixel-art sprites and directional ship frames through the template pixel entry API; verify fixed framing, nearest sampling, snapped anchors, zoom/DPR/resize/fullscreen and documented small-screen fractional fit.
- [x] 6.4 Add keyboard and concurrent touch controls, focus/cancel release and safe input ownership; verify thrust/turn/fire together, no stuck input and no shell shortcut interception of gameplay keys.
- [x] 6.5 Add React roster/lives/wave/asteroid/score HUD, spectator and defeat views, code sharing and terminal/recovery states while preserving corner roles; verify readability at desktop and narrow landscape sizes and with four players.
- [x] 6.6 Add original hit/fracture/death/protection feedback, event sounds, mute and reduced-motion settings; verify silent `?mute=true`, user-controlled audio, readable damage and failure messages when WebGPU initialization fails.
- [x] 6.7 Document controls, multiplayer flow, fixed-host behavior, anonymous-recovery limits, tuning and renderer constraints; verify setup/run/test/build commands against the actual configuration and capture representative in-game screenshots under `docs/`.

## 7. Integrated verification and delivery

- [x] 7.1 Play a full loop with at least two independent WebGPU browser clients and exercise 1/2/3/4-player rooms; verify wave progression, lives across waves, spectators, approved collective replay, mid-wave join/drop and terminal host loss against the specs.
- [x] 7.2 Exercise latency/jitter, host settings/background behavior, guest refresh/recovery, wrap edges, touch emulation, desktop/mobile layouts and console/asset errors; verify recorded outcomes distinguish emulation from physical-device evidence.
- [x] 7.3 Run the current library's creation-triage analysis gate, apply only authorized bounded behavior-preserving standardization and analyze again; verify final packet/scores and deferred architectural candidates without unsolicited structural refactoring.
- [ ] 7.4 Complete template usage checks and run scoped game tests plus production build; verify Pages subpath assets, endpoint configuration, links and version source, and record each checklist outcome honestly.
- [ ] 7.5 Commit/push only requested files on the default branches and run the adapted game Release/Pages workflows when authorized; verify release tag, release-generated version commit and explicit Pages dispatch if the bot commit does not trigger deployment.
- [ ] 7.6 Run public two-client gameplay against the published game and verified backend; verify controls, assets, displayed version, hot joining, lives and spectators, and report game/backend releases separately with all remaining limitations.
- [ ] 7.7 Fetch and safely fast-forward both checkouts, then finalize the completed OpenSpec changes through their supported workflows; verify accepted specs, task completion, clean scoped status and local/remote revision alignment without discarding unrelated work.





