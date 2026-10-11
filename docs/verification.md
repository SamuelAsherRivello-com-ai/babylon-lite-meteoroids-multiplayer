# Verification evidence

## Backend release gate

Shared backend v0.9.12, immutable release target `5da24eb28d2bcf288cd6320624d94511d01d1b22`, run 38087006732 passed: 154 tests; ten-minute staged public continuity (11,508 frames, four renewals), independent four-seat/capacity/drop/recovery and terminal-host phases. Stable endpoint health is version 0.9.12. [Provenance](source-provenance.md).

## Actual game client, headless Microsoft Edge

- Four independent contexts used the real client and public relay, exercised 1–4 connected pilots, natural keyboard turn/thrust/fire, host settings while ticks continued, same-tab guest refresh retaining identity, and guest hot drop.
- Guest WebSocket send and receive callbacks were each delayed 50–100 ms (approximately 150 ms RTT, ±50 ms jitter). This application harness does not claim CDP HTTP throttling controls WebSocket latency.
- Three simultaneous CDP-emulated touch points held rotate, thrust and fire. Input observed `{turn:1,thrust:true,fire:true}`; touch cancellation observed `{turn:0,thrust:false,fire:false}`. Physical touchscreen verification is not claimed.
- A steering/shooting bot used normal game control inputs and naturally cleared wave one. Observed wave two, host score 800, host lives three (a teammate shot the remaining target). No world mutation was used for that natural progression.
- Separate explicitly prepared collision fixtures exercised three host deaths through the actual collision/loss rules, spectator propagation and continued host simulation. A team-elimination fixture exercised five-second automatic reset; guest observed wave one, lives `[3,3]`, scores `[0,0]`. These fixtures are not represented as a naturally played complete defeat.
- Explicit creator departure ended the guest with `The host left. Create a new room.`
- The initial four-client run had zero page errors. An earlier latency test exposed negative wrapped-angle atlas indexing; it was fixed with positive modulo and the scenario passed on rerun. Texture import orientation and single-owner cleanup were also corrected before acceptance.

Screenshots under `docs/screenshots` are captured actual gameplay; capture versions before release are historical test evidence. Seven focused tests pass locally; production build passes. Node 24 CI and published-game verification are recorded below after deployment. Original prompt share URL, physical touch hardware and exhaustive GPU/device/browser coverage remain unverified.

## Public game release

Pending deployment and independent verification; a green workflow alone is not gameplay proof.

Fullscreen entered successfully in headless Edge; opening settings neutralized held input. An independent context with WebGPU unavailable showed the expected recovery message and disabled room launch. All seven focused tests also passed under Node 24 locally.

