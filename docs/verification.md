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

Game v0.1.1 release run 38112234658 and Pages run 38112273340 passed. The published game ran for 600 seconds with two independent headless Edge clients. Each opened three sockets (initial plus two planned renewals). The guest received 11,229 authoritative frames. Both observed runs 1–3 and waves 1–8, including natural team elimination and collective restart with no world fixtures. They finished on run 3 with lives [3,3]; guest was 12 ticks behind the host, within the presentation buffer. Public keyboard and host-settings continuity passed, creator departure ended the guest, and there were zero page errors. The DEV game hook was absent from production.

The host probe counts outgoing frames and reflected incoming frames, so its duplicate transition observations are not interpreted as extra gameplay deaths. Guest-only observations provide the natural elimination/reset evidence. Public test instrumentation captured only public world frames, never auth or token messages.

Final acceptance review then added the missing team-score total and an explicit lower-run-ID snapshot guard. Eight tests pass, including a direct receiver regression with an old run and a higher tick. A targeted two-client browser fixture verifies the 100+50 team-score total and rejects a stale run without replacing the current roster. Final v0.1.2 publication and its short public regression are recorded below; the ten-minute renewal evidence belongs specifically to v0.1.1. The transport, hosting, scheduler and renewal logic are unchanged by the final patch.

Fullscreen entered successfully in headless Edge; opening settings neutralized held input. An independent context with WebGPU unavailable showed the expected recovery message and disabled room launch. All seven focused tests also passed under Node 24 locally.


Reproducible headless browser scenarios are in asteroids/test/browser. Use Playwright CLI run-code --filename with an existing headless Edge session. The transition harness targets the verified local port 5400 and uses explicit DEV-only fixtures; the public-continuity harness targets the shipped URL, uses only normal controls plus read-only public-frame instrumentation, runs for 600 seconds, and records no auth/token messages. It creates isolated contexts and ends its host room after verification. Run these intentionally against the free service; they are not part of every unit-test invocation.

Published renderer checks observed 1280×720 at DPR 1, 2560×1440 backing at DPR 2, and 1280×720 backing for a 640×360 CSS viewport at DPR 2, with no page errors. Native browser UI zoom and physical mobile hardware remain distinct from these emulated geometry checks.



### Final released build: v0.1.2

Release run 38113057560 and Pages run 38113092628 passed at release-generated commit f249ee8513bebc9d6f36f5804a5e170c24ab2c88. Eight Node 24 tests and production build passed in CI. The final public 12-second two-client regression verified displayed v0.1.2, team total, keyboard controls, no production DEV hook, continued host settings simulation, wave two, and terminal host loss, with zero page errors. Both clients ended the check at tick 978/run 1/lives [3,3]. It does not claim to repeat the separate 600-second v0.1.1 continuity run. Screenshots public-desktop.png and public-touch.png now show v0.1.2; public-continuity.png retains the v0.1.1 long-run evidence. Both repositories were synchronized without including unrelated Music documentation edits.


## Finalization

Five accepted game specifications passed strict validation and match their deltas. The game change is archived as 2026-10-11-create-hosted-asteroids-coop with all 44 tasks checked after supported archival. Backend add-asteroids-coop is archived separately. Both checkouts include their release-generated commits and preserve unrelated work. Original prompt share URL and Codex autocomplete UI remain unverified; physical touch and native browser UI zoom remain outside tested hardware evidence.

