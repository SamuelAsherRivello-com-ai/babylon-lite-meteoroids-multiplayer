# Spec Delta

## Purpose

Define the shared Asteroids combat and wave behavior so one to four cooperating players see consistent damage, fragmentation, and progression.

## ADDED Requirements

### Requirement: Shared wrapping combat
The game SHALL support rotating, thrust-driven ships and forward-firing projectiles in one fixed arena. Ships, asteroids and projectiles SHALL wrap on both axes. Player ships and friendly projectiles SHALL NOT damage teammates.

#### Scenario: Crossing an arena boundary
- **WHEN** a ship, asteroid or live projectile crosses an arena edge
- **THEN** it continues at the opposite edge with preserved velocity
- **AND** collisions and visual interpolation use wrapped distances

#### Scenario: Friendly overlap
- **WHEN** one player's ship or projectile overlaps another player's ship
- **THEN** neither player loses a life from that overlap

### Requirement: Exact introductory wave
Wave one SHALL begin with exactly three large one-hit asteroids for every supported player count. Each SHALL fracture into exactly two one-hit small asteroids, and those children SHALL disappear without further fracturing.

#### Scenario: Complete introductory wave
- **WHEN** players destroy the three parents and six children with successful shots
- **THEN** the wave has required nine successful hits
- **AND** no additional descendants exist
- **AND** the next wave is eligible only after the last child is gone

### Requirement: Damage and finite fracturing
Asteroids SHALL lose one health per successful shot and fracture only at zero health. A projectile SHALL damage at most one asteroid. Fracture depth and child count SHALL be bounded, and every descendant tree SHALL terminate.

#### Scenario: Nonlethal hit
- **WHEN** a projectile hits an asteroid with health above one
- **THEN** health decreases by one without producing children
- **AND** that projectile cannot hit another asteroid

#### Scenario: Atomic fracture
- **WHEN** a nonterminal asteroid reaches zero health
- **THEN** it is replaced by its children in the same simulation transition
- **AND** the world is never treated as empty between parent removal and child creation

#### Scenario: Terminal destruction
- **WHEN** an asteroid with no remaining fracture depth reaches zero health
- **THEN** it disappears without creating children

### Requirement: Bounded escalating difficulty
Later waves SHALL gradually increase asteroid toughness and the probability of extra fracture pieces until configured caps. Movement speed and starting counts SHALL provide further bounded progression. The wave configuration SHALL be visible in synchronized state and reproducible for seeded tests.

#### Scenario: Progression before caps
- **WHEN** the team advances through early waves
- **THEN** the configured schedule increases toughness and extra-piece probability at defined steps
- **AND** the system never exceeds its configured health, speed, count or fracture bounds

#### Scenario: Host-selected fracture outcome
- **WHEN** an asteroid fractures
- **THEN** the host selects the child count once
- **AND** every guest receives that same outcome rather than rolling independently

### Requirement: Wave-start player scaling
Wave one SHALL remain unscaled. From wave two, starting asteroid counts SHALL scale with connected players who still have lives, sampled once at wave start. Players awaiting respawn SHALL count; eliminated spectators SHALL NOT.

#### Scenario: Mid-wave membership change
- **WHEN** a guest joins or leaves during combat
- **THEN** the current wave retains its sampled count and configuration
- **AND** the next wave uses the updated living roster

#### Scenario: Spectator excluded from scaling
- **WHEN** a new wave begins with one living player and three eliminated spectators
- **THEN** its starting count uses one living player

### Requirement: Empty-world wave advancement
The game SHALL advance the shared wave only after all asteroids and fragments are gone and at least one connected player retains lives. Team defeat SHALL take priority over wave completion in the same tick.

#### Scenario: Final fragment destroyed
- **WHEN** the final fragment disappears while a connected player has lives
- **THEN** the game enters a short intermission and advances exactly one wave

#### Scenario: Simultaneous final death
- **WHEN** the last connected player's third death and last asteroid destruction occur in the same tick
- **THEN** the run enters defeat without starting another wave
