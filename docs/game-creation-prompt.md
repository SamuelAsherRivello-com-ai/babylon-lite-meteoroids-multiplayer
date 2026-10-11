# Asteroids Multiplayer Clone — creation brief

This is the interpreted creation brief, incorporating the confirmed follow-ups. It is separate from the verbatim original request.

```text
$ai-skills-create-game

- Title: Asteroids Multiplayer Clone
- Type: Online cooperative multiplayer for 1, 2, 3, or 4 human players on one team. Solo play uses the same hosted room and rules.
- World and camera:
  - One fixed 640 × 360 logical-pixel space arena, with a stationary orthographic camera showing the entire arena.
  - Ships, asteroids, and shots wrap across opposite edges. Collisions and interpolation account for wrapping.
  - Use the template's landscape layout, Babylon Lite with WebGPU, and its PixelPerfect2D entry API. Render original pixel artwork with nearest sampling and snapped display anchors while keeping simulation positions continuous.
- Core loop: Pilot a ship, destroy every asteroid and fragment to advance the wave, and survive increasingly difficult waves together. Track a personal score and a team total.
- Controls:
  - A/D or Left/Right rotate; W or Up thrust; Space fires.
  - Provide simultaneous on-screen turn, thrust, and fire controls for touch devices.
  - Release all local controls on focus loss, pointer cancellation, and opening settings. Settings never pause the host's shared simulation.
- Cooperative mechanics:
  - The room creator is the fixed host and sole world simulator. Guests send controls; the host resolves movement, shots, collisions, damage, fractures, lives, scoring, and waves.
  - Create or join using an editable four-character room code or shareable invitation link. Guests may join or drop at any time, including mid-wave and during the defeat countdown.
  - Maximum four connected players, including spectators. Departed guests free their connected seats.
  - A returning guest in the same browser tab recovers their room-scoped identity, score, and remaining lives, including elimination; refresh and rejoin never grant extra lives.
  - The host cannot drop and return. Actual host loss ends the session and invalidates its invitation. Do not elect a replacement host. Planned hosting connection renewals preserve the same host and world.
  - Disable friendly fire. Distinguish all four ships by both color and player number.
- Look and feel:
  - Original crisp pixel-art ships, faceted asteroids, a restrained navy starfield, readable projectiles, thrust, protection rings, fractures, and hit/death feedback.
  - Show wave, remaining asteroids, personal lives, team score, player roster, room code, connection status, and host identity inside the viewport, including fullscreen.
  - Preserve template corner roles: title upper left, project links upper right, settings lower left, version lower right. Retain the gutter layout for secondary content.
  - Provide 4–10 original event sound effects, mute checkbox, silent ?mute=true mode, and reduced-motion settings. Show a useful unsupported-WebGPU or initialization-error state.
- Gameplay requirements:
  - Wave one always starts with exactly three asteroids, regardless of player count. Each requires one hit and fractures into exactly two children. Each child requires one hit and disappears without fracturing: three parents, six children, nine successful hits total.
  - Advance only after every asteroid and descendant is gone, following a three-second intermission.
  - Later waves increase asteroid health, root count, speed, and probability of three-way fracturing within explicit caps. Use seeded deterministic randomness. Wave two begins player-count scaling; freeze the living roster at wave start, include respawning players, and exclude eliminated spectators. Hot arrivals/departures do not change the current wave's asteroids.
  - Every player starts with three lives. Each death costs exactly one life across all waves. Respawn after two seconds with two seconds of protection. At zero lives, become a noninteractive spectator while survivors continue.
  - A spectating host continues simulating. The run ends when every connected player is eliminated. After five seconds, automatically restart all connected players together at wave one with three lives and reset scores, including players who arrived during the countdown. No ready-up barrier is required.
  - Defeat takes priority if the final player and final asteroid disappear in the same simulation tick. Old-run controls must never affect a restarted run.
- Multiplayer server and smoothness:
  - Extend and release https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server before creating the game client. Isolate Asteroids rules, rooms, recovery, and protocol from existing games.
  - Use only Vercel's free Hobby plan for the backend. Provision and configure the service through available trusted credentials. Use first-party shared metadata/state facilities for cross-instance continuity; no paid or third-party hosting service.
  - Keep admission, host binding, capacity, identity recovery, validation, and connection-generation fencing on the backend. The creator browser owns gameplay simulation, as requested.
  - Predict local ship movement immediately, reconcile against acknowledged host inputs, and interpolate remote ships and asteroids with wrap-aware motion. Cosmetic local fire feedback may be immediate; damage and fractures follow host outcomes.
  - Use compact complete snapshots and bandwidth-efficient deterministic projectile motion. Cap concurrent asteroids and projectiles; prioritize stable synchronization over action density.
  - Renew connections before platform duration limits without resetting the world, changing host, reviving spectators, or losing damaged asteroids. Treat actual host loss as terminal.
  - Verify a public ten-minute two-client session across two planned renewals per participant, retaining wave, health, lives, guest identity, and sole host authority.
  - Verify real 1/2/3/4-client rooms, hot joining/dropping, spectator recovery, automatic collective restart, and terminal host loss. Play the completed game in independent WebGPU browser contexts with 150 ms simulated RTT and approximately ±50 ms jitter. Check keyboard, concurrent touch emulation, fullscreen, zoom/DPR/resize, narrow landscape layout, console errors, and assets.
- Delivery:
  - Generate the repository through the required GitHub template flow, import the shared skills with provenance, and track design, acceptance, implementation, and evidence with OpenSpec.
  - Pin the exact verified released shared-client package and secure backend endpoint; provide a credential-free local endpoint override. Do not silently substitute offline play.
  - Release the game through the checked-in workflow, deploy its static client to GitHub Pages, verify real public two-client gameplay, and put the verified live demo in the README and shared server's alphabetical demo registry.
- Inspiration link: https://en.wikipedia.org/wiki/Asteroids_(video_game)
- Inspiration screenshots: None supplied. Use the linked game for mechanical inspiration; capture screenshots of the actual completed game for documentation.
- Originality: Keep the requested title and Asteroids mechanics, using original artwork, audio, ships, effects, interface, and presentation. Do not copy commercial assets.
```
