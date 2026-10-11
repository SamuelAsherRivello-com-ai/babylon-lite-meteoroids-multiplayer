# Design

## Context

See `proposal.md` for the requested outcome. This is a greenfield application: the destination was empty and not a Git checkout. OpenSpec 1.14.0 was initialized with `--tools none`; no template, generated skills, game code, or backend checkout has been installed.

### Inspected sources (2026-10-10)

All three repositories have default branch `main`. These commit IDs identify the inspected baselines; recheck them before applying.

| Source | Revision | Evidence and implication |
| --- | --- | --- |
| [Template](https://github.com/SamuelAsherRivello/github-repository-template) | `49d6c20741f2aaac509f7954392d72526614aca6` | `AGENTS.md`, usage checklist, layout guide, `Content.jsx`, pixel-grid entry, Vite config, tests/scripts and release/Pages workflows: React shell, Babylon Lite 1.32.0, root npm project, `project-name/` app, WebGPU-only rendering. |
| [Shared server](https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server) | `d01a2d6c567d0504727b10dc106d083b276d1075` | README, AGENTS, registry, client source/API, private-code room, server admission, participant-host relay, Rabbits/admission tests, package/config and workflows: version 0.9.9, Node 24, Colyseus 0.17, coded rooms and fresh reconnect. |
| [Skills library](https://github.com/SamuelAsherRivello/ai-skills-library) | `f3700fdd4fab4cde2047a99a305ae3ac57e3d0c5` | Create-game skill now lives under `.agents/skills/ai-skills-create/ai-skills-create-game/`; it also adds a creation-triage gate absent from the installed copy. |

The multiplayer skill reference names old server paths. The actual registry and client README are under `multiplayer-server/documentation/` and `multiplayer-server/packages/client/`. Planning follows the actual files.

`ParticipantHostRelay` and its tests automatically elect the longest-connected participant. That behavior conflicts with the confirmed fixed-host game rule, so it cannot be reused unchanged. Shared-client `onLeave` normally schedules a fresh join; Asteroids needs a terminal session-ended path. SDK same-session recovery currently applies only to selected game keys, not to every new game.

Hosting evidence is deliberately limited: backend rooms are process-local; the release workflow stages Vercel, runs game tests and a 240-second relay, promotes, and verifies the public alias. The active hosting proposal explicitly allows bounded current sessions; cross-instance continuity is future work. Server config retains stronger hosting constraints, so reconcile that repository's current proposal/spec/config during its own future planning. The historical Render file selects a resource tier and is not evidence of a free or authorized alternative.

## Goals / Non-Goals

**Goals:**

- One simulation owner, a reusable browser-safe rules core, and testable boundaries between physics, transport, presentation, and run lifecycle.
- Reuse shared admission/client capabilities while adding only missing Asteroids semantics.
- Keep world state coherent through guest membership changes and make host loss terminal.
- Deliver only after live tests demonstrate the selected hosting approach can support the intended run.

**Non-Goals:**

- No host migration, game-server physics authority, account service, durable run history, competitive anti-cheat guarantee, or automatic revival.
- No implementation, source imports, external deployment, release, or commit during this proposal invocation.
- No dungeon, loot, bosses, upgrades, saucers, or unrelated game changes.

## Decisions

### 1. Preserve the template shell and replace its showcase

Generate the requested GitHub destination using the template flow during apply, only after the server contract is released and verified. Check for an existing matching repository before creation; a name collision is not permission to replace it. Since this directory now holds planning files, stage generated contents separately and merge tracked files deliberately, preserving this OpenSpec root and change. Never clone destructively over this folder.

Rename `project-name/` to `asteroids/`; update Vite root, tests, ignores, docs and Pages artifact path. Set Vite base to `/babylon-lite-asteroids-multiplayer-clone/`. Keep root npm configuration, four corner roles, gutters, `version.txt`, and existing Release/Deploy live demo workflows. Add a production build gate to release if needed.

Import the shared skill files required by the invoked create-game workflow with source commit/license records and collision review. Do not overwrite generated OpenSpec skills or local customizations. The invoked skill requires the library import even though the generic template favors selected optional skills. No global skill updates are part of this work.

The template pins generated OpenSpec tooling to 1.13.1 while this machine has 1.14.0. Resolve this as a project-local tooling gate before generating skills or applying: test the planning files with the required version, use its supported generation workflow, verify `.openspec-target` and doctor output, and preserve artifacts. Do not downgrade global tooling silently. Current proposal validation uses 1.14.0 and does not certify that compatibility.

Alternative: rebuilding the shell or changing renderers would discard useful layout/lifecycle behavior and violate the selected stack.

### 2. Use a fixed creator host with an isolated Colyseus room

Register `asteroids-coop` with a new `AsteroidsRoom` and the existing coded create/join route. Capacity is four connected participants, including spectators. Reuse code normalization, collision/rate-limit responses, ordered seats/colors, share-link helpers, subscriptions, and teardown.

The server binds `hostId` to the room creator's connection. It validates guest input and host snapshots, orders membership/input messages, stores the latest validated full snapshot, and relays it. Only the host client simulates physics, hits, RNG, fractures, lives, waves and reset. A spectator host keeps running that simulation.

On intentional host leave or detected host socket loss, atomically close admission, emit `sessionEnded` with `host-left` or `host-disconnected`, stop retry/recovery for that room, remove the invite, and dispose the room. Detection uses transport liveness; physical network loss is not instantly detectable. Do not call the migrating relay's election path. Preserve its existing consumers/tests unchanged.

Guest departure removes the ship and neutralizes its input, without erasing asteroids or rescaling the current wave. Guests do not keep a defeated run alive while offline. New guests receive three lives during combat; guests joining an already defeated run wait for restart.

Alternatives: moving gameplay to the backend contradicts player-host ownership; automatic election contradicts the explicit host-departure decision.

### 3. Add room-scoped recovery identity rather than treating a seat as a person

Use an opaque server-issued participant token, separate from replaceable socket/session IDs and seats. Keep the host's run ledger keyed by participant identity. The server maps authenticated membership to that key; guests cannot supply another player's authoritative ID. Store a guest token in session storage scoped by endpoint, room and game; do not put it in share URLs or snapshots.

Hot drop frees a connected seat immediately. Returning with the same valid token restores lives, score and eliminated status, even if the socket ID changes. When four participants are connected, recovery receives full status rather than displacing a guest. Reuse token and SDK patterns where suitable, but do not use the current arbitrary vacant-seat replacement as proof of identity. Bound retained disconnected records and fail admission clearly if the ledger is full; never evict an eliminated record into a fresh identity automatically.

This is anonymous session continuity, not durable accounts. Clearing browser storage or using a new browser can look like a genuinely new participant; document that limitation instead of claiming comprehensive life-reset prevention. The user confirmed room-session preservation of returning guests' lives and spectator status. Automatic transport retry can use the current 15-second SDK window, but the authenticated run ledger persists for the entire room session, including later manual returns from the same browser.

### 4. Define a versioned, bounded input and snapshot contract

Proposed messages:

| Direction | Message | Contract |
| --- | --- | --- |
| Guest to relay to host | `input` | Protocol version, run ID, monotonically increasing sequence, turn axis in [-1,1], thrust/fire booleans; relay stamps sender identity. |
| Relay to host | `participantJoined` / `participantLeft` | Ordered membership serial, participant key, seat metadata, recovery/new classification. |
| Host to relay to clients | `hostSnapshot` / `gameState` | Protocol version, run ID, host tick/time, last consumed membership serial, per-player input acknowledgements, wave/phase/config, players, asteroids, projectiles, RNG state and effect serials. |
| Relay to clients | `sessionEnded` | Terminal reason; suppress automatic retries and clear stale world state. |

Snapshots use compact bounded arrays and remain below a proposed 12 KiB encoded budget, including message-envelope overhead. The current transport limit is 16,384 bytes: the Rabbits helper's 48,000-character bound cannot be copied as a safe wire budget. Enforce finite coordinates, array/entity limits, unique IDs, current run/tick ordering and rate limits. Retain complete snapshots for late join; do not deliver deltas before their baseline.

Process membership and combat at deterministic host tick boundaries. A late join sees the latest world and waits for host acknowledgement before its ship becomes controllable. Reject stale snapshots that predate acknowledged membership or publish impossible membership identities. Reset changes run ID, flushes pending inputs and events, and prevents old shots from reappearing. The relay authenticates authority and bounds messages; it does not independently prove host gameplay fairness.

### 5. Keep simulation independent from rendering and network scheduling

Place the browser-safe rules core in the shared-client package under an additive Asteroids export, with room validation/transport in server source. This permits backend-first rule/integration tests using a headless host before creating the visual client. The game uses that exact released artifact for host simulation and guest movement prediction.

Proposed rates are 60 Hz fixed simulation, 20 Hz inputs/snapshots, and 300 ms stale-input neutralization. Use a bounded accumulator and monotonic clock; never invent elapsed ticks from callback counts. Interpolate guests about 100 ms behind host state; predict only local movement/fire cosmetics, reconcile acknowledged input, and use shortest wrapped displacement. Collisions, damage and fracture results stay host-only. Gate these proposed rates with actual latency tests.

The host simulation and networking must remain independent of React dialogs and renderer pause. The template showcase stops its engine when a dialog opens; copying that behavior into the authoritative loop would pause everyone. Zero the local ship's controls while settings are open, but continue world ticks. If a host background tab becomes throttled, expose a stall and use capped catch-up rather than a burst of unbounded simulation.

### 6. Make difficulty bounded and roster sampling explicit

Wave-one rules are exact, including nine successful one-hit destructions/fractures. Replace the earlier unbounded health formulas with a capped tuning function. Fracture rolls occur only on the host, are seeded for tests, and decrease remaining depth. Apply parent removal and child insertion atomically before checking for an empty world.

Proposed tuning baseline, subject to playtesting rather than a claimed user-approved formula:

- Wave one: three parents, one HP, one fracture depth, exactly two one-HP terminal children.
- Later waves: starting parents `min(8, 3 + floor((wave - 1) / 2) + livingPlayers - 1)`.
- Parent HP `min(5, 1 + floor(wave / 2))`; child HP `min(3, max(1, ceil(parentHP / 2)))`.
- Depth one through wave four, depth two thereafter; two children normally, three with probability `min(0.6, 0.1 * (wave - 1))`.
- Root speed rises gradually to a tested cap; children are moderately faster with their own cap. After health/branching caps, progression uses speed and starting counts until those caps too are reached; no infinite-difficulty promise.

At most eight roots and three-way branching over depth two yield at most 72 simultaneously living descendants. Limit live projectiles to a proposed 32 with per-player quotas and short lifetimes. Preserve all actual asteroid state rather than deleting rocks to meet a cap.

Sample connected non-eliminated players, including those awaiting respawn, once per wave. Hot joining/dropping and deaths never alter that wave's captured configuration. Record the sampled count in snapshots. If the final asteroid and final player disappear in the same tick, resolve team defeat first.

### 7. Use explicit run and player states

World phases: `lobby`, `combat`, `intermission`, `defeat`, and terminal `session-ended`. Player states: `playing`, `respawning`, `spectating`, plus connection status. First and second deaths consume one life and schedule a safe respawn; third death leaves no interactive ship. Proposed respawn/intermission values are two seconds plus two seconds of protection, and three seconds respectively.

Elimination is personal; remaining teammates continue, including a guest while the host spectates. Disconnected players do not prevent defeat; respawning connected players do. After defeat, show results for exactly five seconds and automatically reset lives, scores, RNG seed, wave and entities while keeping the room and host. All connected participants, including spectators and newcomers waiting during defeat, restart together at wave one with three lives. This restart rule is confirmed by the follow-up interview.

### 8. Keep raster art pixel aligned

Use landscape 640×360 as the proposed logical arena, fixed framing, nearest texture/target sampling, no mipmaps/MSAA, and integer fit when possible. Follow the template's entry wrapper for sprite creation, movement and view updates. Keep continuous angles in physics but choose authored directional frames (for example 32 ship headings) for visible ships, avoiding arbitrary sprite rotation that weakens pixel alignment. Small-screen fractional fit must be disclosed as an alignment exception and tested; do not change world dimensions when zoom/DPR changes.

Keep React HUD, spectator status, touch controls and corner roles inside the viewport/fullscreen. Use original sprites and 4–10 event sound effects with mute UI and `?mute=true`. Local keyboard/touch input must support concurrent actions and clear on blur/cancel. WebGPU failure shows useful recovery text; no renderer substitution.

### 9. Treat sustained hosting as a dependency, not a successful health check

Use the server's current staged release/promotion workflow and existing free-provider constraints as the baseline. A 240-second relay cannot certify runs that may exceed five minutes. The user confirmed preserving long runs on the existing free hosting: integrate and verify connection renewal and room/state continuity before public delivery. Bounded sessions and paid-provider substitution are excluded. Do not silently impose a time limit or provision a paid alternative from the historical Render file.

An intentional guest socket renewal must preserve participant identity/lives. Any host transport-renewal strategy must distinguish planned renewal from terminal host loss without allowing a second authority; if the existing hosting work cannot guarantee that, the public release remains blocked. A suitable sustained-session probe runs at least 10 minutes, spans two expected connection windows, forces a guest reconnect, and proves one room/host and uninterrupted wave/lives state. Longer sessions remain subject to documented provider limits.

## Risks / Trade-offs

- [Anonymous identities can be reset outside the application] → Keep authenticated room-scoped recovery and document the new-browser limitation; no account-system scope creep.
- [Host device performance/background throttling affects everyone] → Fixed-step accumulator, bounded density, liveness/stall UI and real browser tests; no hidden migration.
- [Newcomers can prolong a run and spectators can wait] → This is the confirmed choice; clearly show who remains alive.
- [Two-way relay latency increases guest correction] → Predict local movement, acknowledge inputs, smooth wrap-aware corrections, and measure under jitter.
- [Pixel alignment at arbitrary angles or fractional display scale] → Authored heading frames and documented small-screen fallback.
- [Shared-server changes can interrupt other games] → Additive protocol, full regressions, staged verification, rollback and pinned consumer package.
- [Artifact existence can appear complete despite pending technical gates] → Preserve explicit readiness gates in proposal/tasks and report implementation status accurately.

## Migration Plan

1. Carry the three confirmed follow-up decisions into all artifacts, then enter the explicitly requested apply-with-Playwright workflow. Keep this planning work intact.
2. Reconcile an Asteroids change in the server's own OpenSpec root; preserve unrelated hosting changes. Implement and test rules, isolated room, token/recovery additions, terminal close and headless public probes.
3. Complete hosting prerequisites and run server checks: `npm ci`, `npm run check:docs`, `npm run typecheck`, `npm test`, package dry-run and live probes. Release/deploy through inspected workflows only when apply/delivery is authorized. Verify tag, tarball, staged and stable endpoint versions and game behavior.
4. Generate/merge the game template, reconcile local tooling/skills, pin the verified client tarball, implement presentation and controls, then run game/build/browser checks and creation triage.
5. Release the client through its adapted Release workflow, explicitly dispatch Pages for the release commit if needed, verify public multiplayer and displayed version, then fast-forward both checkouts. Preserve default branches and task-only commits.
6. On failed backend public checks, use the existing promotion rollback path. Do not publish the game against an unverified contract; on client failure, restore the last working Pages revision while retaining the compatible backend.

## Confirmed Follow-ups and Technical Gates

- Confirmed: automatic collective restart after a five-second defeat/results countdown.
- Confirmed: returning guests retain lives, score and spectator status for the current room session.
- Confirmed hosting requirement: preserve long runs on existing free hosting with verified renewal and continuity. Host-renewal semantics and live proof remain technical work; bounded sessions are not an accepted substitute.
- Tool compatibility verified: OpenSpec 1.13.1 strict validation and doctor passed; six local Codex skills were generated with matching folder/frontmatter names and generatedBy 1.13.1. Global tooling was unchanged. Codex autocomplete after reopening remains unverified and is not needed to invoke the already loaded workflows.
- Tuning proposals: exact resolution, damage/speed/count caps, input rates, respawn protection and scoring values are engineering baselines, subject to acceptance/playtesting. They are not verbatim original user requirements.
- Documentation source URL: preserve the actual initiating request and separately label follow-ups; no share URL has been supplied, so do not invent a README prompt link.

The three-question interview is complete. Implementation is explicitly requested after this artifact update; technical gates remain tracked and cannot be marked complete without evidence.

## Apply Evidence and Current Blocker — 2026-10-10

- Confirmed decisions were reconciled across proposal, lifecycle/network/delivery specs, design and tasks. Strict validation passed with both planning CLI 1.14.0 and template-pinned 1.13.1.
- The sibling server is on main at d01a2d6c567d0504727b10dc106d083b276d1075. The unrelated untracked openspec/changes/add-tetris-duel/ directory was observed and left untouched. No server source was changed by this attempt.
- Ran the existing diagnostic from the server root: node --import tsx --test multiplayer-server/test/feasibility/cross-instance-baseline.mjs. Its negative-baseline test passed: remoteJoin=404 and duplicateClaimStatuses=[200,200]. This is evidence of missing continuity, not a successful gameplay acceptance check.
- The active shared-server hosting change tasks 3.1–3.4 and 4.3 remain unchecked. Its design excludes third-party runtime/storage and treats cross-instance coordination/renewal as future work. The existing vercel.json sets maxDuration=300.
- Current official documentation confirms that sockets close at function duration and new connections may reach a different instance: https://vercel.com/docs/functions/websockets. The present process-local room implementation cannot satisfy the confirmed long-run continuity requirement by adding a reconnect loop alone.
- GitHub CLI authentication works outside the restricted sandbox; the configured Vercel project was found through the connected Vercel tool. The game repository lookup returned 404; no game repository was created. This is not an authentication-only blocker.
- Playwright CLI 0.1.22 was verified outside the network-restricted sandbox. No application exists yet, so no browser gameplay validation has run.
- Apply stopped at task 1.3 as required by the loaded apply workflow's instruction to pause on blockers. A consistent shared-state/room-routing design within the existing free-provider constraints must be implemented and proven before backend-first client creation/release proceeds. Do not substitute bounded sessions, host migration, a paid provider, fresh-room reset or mock browser verification.
- Progress is 2/44 tasks verified. The goal remains incomplete; this evidence does not claim the shared-state migration is impossible, only that the current approved prerequisite is absent and its negative baseline is reproduced.

## Continued Apply Evidence — 2026-10-10

The user's explicit instruction to continue through a shipped README demo authorizes delivery and continued independent implementation while hosting is resolved. Hosting remains unverified and no capped-session substitute is accepted. Earlier stopping evidence above describes the prior attempt, not the current state.

- Created isolated browser-safe `asteroids-v1` tuning/rules, fixed-host room and additive client modules in the sibling server. Twelve deterministic rule tests pass, including exact nine-hit wave one for 1–4 players, finite branching, per-wave roster capture, three personal lives, host spectator simulation, simultaneous hit protection, stale input rejection, defeat priority, and five-second restart including arrivals.
- Real local Colyseus integration passed: four seats, damaged-state late joining, guest drop/recovery retaining eliminated status, host publication only, private recovery token distinct from public player ID, capacity and terminal host closure. Additional validation/regression/public acceptance remains pending.
- Server-scoped `add-asteroids-coop` planning artifacts were created and strict validation passed. Existing Combat, Music and Tetris concurrent edits are preserved.
- Credentialed hosting diagnostic run 38079249214 succeeded using GitHub-held Vercel credentials; sanitized results show Fluid Compute enabled, no project environment variables and no integrations. No credential values were logged or exported. Connected Vercel app access returned 403, so GitHub Actions was used successfully.
- No game repository/client, backend release or public gameplay verification exists yet. Twelve rules tests and one local integration test are evidence of backend progress only.

### Free-plan continuation and regression evidence

The user reaffirmed that Vercel free hosting is mandatory and rejected alternatives; do not ask again. First-party cache feasibility is being measured with preview deployments; the production alias is not used for capability probes. Automatic approval rejected a proposed production-mode probe retry, so the workflow was changed to preview-only, which was approved. This does not change the game's eventual production release authorization.

Focused Node 24.21.0 verification now passes thirteen rules tests plus the real Colyseus integration test. Strict snapshot validation and a worst-case full frame (four UUID players, 72 asteroids, 32 projectiles) are covered. Docs check and client package dry-run pass, with both Asteroids exports present. The full mutable shared-checkout regression attempt finished 111/117 tests passing, with failures in Garden/Gauntlet/Gungeon/private admission/Ring Rivals/Tetris; do not claim full regressions pass. Another run was disrupted by concurrent dependency installation. These failures need isolated diagnosis on the reconciled revision before release.
## Asteroids-only first-party continuity migration

The user requires Vercel Hobby and authorizes implementation and delivery without provider alternatives. The existing bounded hosting release is preserved for existing games. Asteroids adds its own cross-instance path rather than claiming the existing process-local Colyseus reservation is portable.

The shared server's WebSocket transport dispatches `/asteroids` to a JSON message extension; all other paths still use the unchanged Colyseus handshake. The browser-safe Asteroids connection API chooses the advertised transport. Production refuses a process-local fallback when shared storage is absent. Authentication occurs in the first socket message, never a token-bearing URL. Thus HTTP admission and the following WebSocket may reach different Functions.

Private Vercel Blob owns code uniqueness, hashed recovery identities, connected seats, creator identity, membership serial, and socket generation. Exclusive creation and ETag conditional writes serialize admission across instances. Consistent uncached reads supply the latest registry. Runtime Cache holds short-lived complete frames, guest input, and immutable registry revisions; it cannot create or elect a host. Host browser memory retains the full simulation, random state and recovery ledger. Cache loss fails closed rather than resetting a run.

Each socket generation has separate frame/input keys, preventing an old socket from overwriting a renewed socket's data. Planned renewal every 210 seconds uses the existing secret identity and current generation to acquire a new generation through CAS, then authenticates a replacement socket before closing the old one. The host browser keeps its world throughout. An old generation's close cannot remove the new generation. Actual host closure ends the room and invalidates invites; guests are never elected. Guest reattachment keeps its public player ID and therefore the host's lives/score ledger.

The preview Runtime Cache probe passed 20 fresh cross-function reads with distinct instance UUIDs. Credentialed setup confirmed Hobby and provisioned a private `iad1` Blob store connected to the existing project; no credentials were logged. Seven injected-store concurrency/lifecycle tests and one real two-socket-server integration test pass. Public multi-renewal evidence is pending; this design alone does not satisfy the sustained-session gate.

Blob writes occur on creation, admission, departure and renewal, never on simulation ticks. A two-player ten-minute session needs approximately eleven metadata writes including two renewals per participant and final closure, plus membership reads (one per connected socket per fifteen seconds). Frames and input use Runtime Cache at no more than twenty Hz per participant. This remains a quota-limited Hobby demo, not an unlimited service. Blob's published Hobby allowance is 2,000 advanced and 10,000 simple operations monthly; Runtime Cache, Function memory and transfer allowances also apply. No upgrade or paid overage is enabled. Service failures must surface honestly and fail closed.

References: https://vercel.com/docs/vercel-blob/using-blob-sdk; https://vercel.com/changelog/vercel-blob-now-supports-consistent-reads-on-private-storage; https://vercel.com/docs/vercel-blob/usage-and-pricing; https://vercel.com/docs/functions/websockets.


### Verified local backend gate

The complete shared-server suite passed 129/129 tests under Node 24.21.0 after the concurrent source reconciliation. The earlier six failing checks now pass. Locked installation (`npm ci --ignore-scripts`), docs validation (17 games), type checking and package dry-run pass; the package includes all three Asteroids browser modules. Nine continuity unit tests and one real independent-socket-server integration test pass after additional duplicate-generation and abandoned-admission hardening. The preview workflow performs its own Node 24 `npm ci` and typecheck before deployment. The current ten-minute public preview run is 38081604433; its result remains pending. Microsoft Edge launched through Playwright CLI and successfully returned a WebGPU adapter. No client game has been created yet; original procedural pixel artwork is prepared separately in staging.

### Free Vercel continuity evidence (2026-10-10 UTC)

The first-party private Blob + Runtime Cache migration is isolated to Asteroids. The provisioned project was verified as Hobby; no third-party or paid service was enabled. Preview run 38081604433 sustained two clients for 600 seconds, delivered 11,539 frames and performed four planned socket renewals while retaining wave 3, asteroid health 2 and an eliminated guest's zero lives. Actual creator loss invalidated the invitation.

Expanded four-player verification found a production-only Blob behavior: compressed larger registry reads return a weak ETag, making every conditional update fail. Cross-instance probe 38083589232 verified that requesting `Accept-Encoding: identity` returns the strong object ETag and preserves exclusive creation and conditional-write atomicity. Commit 34180e0 applies that read option. Actual server preview run 38083689441 then passed four connected seats, fifth-seat rejection, hot drops, damaged-state delivery, private guest recovery and terminal host loss at https://rmc-colyseus-multiplayer-server-9s22fgwjy.vercel.app. This short diagnostic does not substitute for the 600-second release gate. Release run 38083805995 targets unpublished v0.9.11 and repeats that full gate before promotion.

Native browser transport proof also passed with two independent Microsoft Edge contexts: acknowledged guest input, preserved spectator identity, planned host/guest renewal and terminal creator loss. This is protocol verification; gameplay browser acceptance remains unchecked until the actual game exists.

Additional verification after the strong-ETag fix: four independent Microsoft Edge contexts passed synchronized four-player presence, acknowledged guest input, recovery of an eliminated identity, manual planned host/guest renewal and terminal host loss against the actual preview. `staging/browser-four-relay-result.log` contains the result (transport only, not gameplay). The prescribed sequential Node 24 full backend regression suite passed 141/141 tests in 284.45 seconds. An earlier direct concurrent invocation was invalid for integration tests sharing local process resources; its failures are excluded, and the prescribed full suite was rerun successfully.

The corrected actual backend passed the fresh 600-second public acceptance run 38084287501: https://rmc-colyseus-multiplayer-server-r3o5u3ru2.vercel.app, 11,824 frames, four planned renewals (two per sustained participant), preserved wave 3/asteroid health 2/eliminated guest lives 0, recovery and terminal creator loss. Its opening phase also exercised four simultaneous seats, rejected a fifth participant and hot-dropped extra guests. This replaces reliance on the earlier two-client-only continuity evidence. The unpublished release was restarted as run 38084815998 to include concurrent shared-client Ring Rivals/Tetris reservation retry fixes; run 38083805995 was cancelled before promotion. No new release number was minted for the retry.

### Dedicated Hobby deployment decision

Release run 38084815998 passed 147 local regressions and its Asteroids live check, then failed legacy Bomberman/Combat/Ring Rivals admissions on the shared staged deployment. These process-local games retain known instance-routing limits; relaxing their assertions or deploying their unverified staged behavior would not establish a safe Asteroids release. The Asteroids backend therefore uses a dedicated project on the same required Vercel Hobby account, built and released from this shared server repository. `ASTEROIDS_ONLY=1` restricts registration/admission to the isolated shared-state relay. The existing shared production endpoint and default release target remain intact. The Release workflow gains an explicit `asteroids` target with full-source regression preparation, isolated registration verification, real four-seat tests, 600-second continuity, promotion and a stable-endpoint probe before publishing the exact shared-client artifact. No provider alternative, paid feature, or third-party runtime service is introduced.

The scoped local isolation integration test passed: only `asteroids-coop` is registered, legacy Combat admission returns 404, and Asteroids admission succeeds. Vercel project provisioning is automated through existing trusted GitHub secrets and asserts Hobby before creating any resource. The candidate stable endpoint is https://rmc-asteroids-coop.vercel.app; it remains unverified until the dedicated release succeeds.

## Verified backend release and game integration

Backend v0.9.12 is shipped at https://rmc-asteroids-coop.vercel.app on Vercel Hobby. Release run 38087006732 and immutable target 5da24eb28d2bcf288cd6320624d94511d01d1b22 passed 154 tests and ten-minute/four-renewal staged continuity. The exact released tarball is pinned in root package/lockfile. See docs/source-provenance.md and docs/verification.md for final contract and actual client evidence. Template generation/bootstrap and shared-skill import are complete; publication of the playable client remains the final delivery gate.


## Final delivery evidence

Game v0.1.2 release run 38113057560 and Pages run 38113092628 passed; release commit f249ee8513bebc9d6f36f5804a5e170c24ab2c88 is synchronized locally. Eight Node 24 tests and targeted independent two-client public controls/team-HUD/wave/synchronization/terminal-host checks passed with zero page errors. The earlier published v0.1.1 completed 600 seconds, two planned renewals per client, waves 1–8 and natural collective restarts; the final patch adds only team-total display and an explicit old-run receive guard, covered separately. Details, screenshots, source provenance and triage packets are in docs/. Physical touchscreen hardware, native browser UI zoom and Codex autocomplete UI are explicitly unverified; original prompt share URL remains unavailable. Backend documentation lists the published game, and its Asteroids change is archived separately. Unrelated shared-backend Music edits were preserved outside every Asteroids commit.


