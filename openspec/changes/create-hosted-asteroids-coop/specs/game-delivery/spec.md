# Spec Delta

## Purpose

Make the game reproducible from the required template and shared multiplayer package, and require evidence of working public gameplay before delivery claims.

## ADDED Requirements

### Requirement: Traceable project foundation
The resulting project SHALL derive from the required repository template, record source revisions and skill provenance, preserve the approved planning artifacts and adapt template metadata to the game. Runtime, build and test instructions SHALL match the resulting configuration.

#### Scenario: Template establishment
- **WHEN** the future game repository is generated
- **THEN** planning files survive integration and the app has a game-specific directory
- **AND** repository URLs, build paths and version conventions identify the game

### Requirement: Compatible backend-first delivery
The Asteroids room and shared-client contract SHALL be tested, released and publicly verified before the game integrates that released package. Existing game protocols SHALL remain compatible.

#### Scenario: Consumer dependency pin
- **WHEN** the game installs its multiplayer dependency
- **THEN** it pins the exact verified release asset and commits the lockfile
- **AND** production configuration uses the verified public secure endpoint without credentials

### Requirement: Hosting evidence matches run duration
Public delivery SHALL use Vercel's free Hobby plan and verify connection renewal and room/identity continuity across hosting windows. Health checks or a four-minute relay alone SHALL NOT satisfy this gate. A session time cap or paid provider SHALL NOT replace the requirement. The shared server repository MAY deploy its Asteroids relay to a dedicated Hobby project so existing process-local games retain their existing production endpoint. The dedicated project SHALL register only Asteroids and use the same released rules and client contract.

#### Scenario: Sustained public probe
- **WHEN** two public clients run the sustained acceptance probe for at least ten minutes across two expected connection windows
- **THEN** they retain one room, one host, current wave, asteroid health and player lives through guest recovery
- **AND** any host renewal preserves one authority without masking an actual host departure

### Requirement: Meaningful gameplay verification
Verification SHALL cover one through four players, exact introductory fragmentation, later waves, lives across waves, spectators, hot join/drop, guest recovery, terminal host loss, replay, and latency/jitter. At least two real browser clients SHALL exercise shared gameplay. Physical-device testing SHALL be distinguished from emulation.

#### Scenario: Multiplayer acceptance evidence
- **WHEN** delivery is evaluated
- **THEN** recorded results include actual gameplay and public two-client synchronization
- **AND** build success alone is not presented as proof of playability

### Requirement: Verified public release
Delivery SHALL identify game and backend releases separately, confirm public assets and displayed version, preserve the actual original prompt and labeled follow-ups, and disclose unresolved limitations. Local checkouts SHALL include release-generated commits without discarding unrelated work.

#### Scenario: Release bot does not trigger Pages
- **WHEN** the version release commit does not cause a Pages deployment
- **THEN** the existing Pages workflow is explicitly dispatched for the intended revision
- **AND** public gameplay and displayed version are verified before publication is claimed

#### Scenario: Missing evidence
- **WHEN** authentication, hosting, tooling or browser capability prevents an acceptance check
- **THEN** the unfinished step is named as blocked or unverified rather than complete
