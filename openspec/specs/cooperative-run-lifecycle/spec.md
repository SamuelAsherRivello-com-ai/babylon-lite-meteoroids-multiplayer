# cooperative-run-lifecycle

## Purpose

Define individual lives, cooperative survival, spectator participation, and collective run reset without granting unintended lives through membership changes.

## Requirements

### Requirement: Three lives across a run
Each player SHALL start with three personal lives. An asteroid collision SHALL consume exactly one life per death. Lives SHALL persist across waves and SHALL NOT increase through score, revives, or wave completion.

#### Scenario: Deaths in separate waves
- **WHEN** a player dies once in wave one and twice in later waves
- **THEN** that player's third total death eliminates them for the run

#### Scenario: Overlapping collisions
- **WHEN** multiple asteroids overlap a ship during its death transition
- **THEN** exactly one life is charged for that death

### Requirement: Respawn before elimination
After the first and second deaths, a connected player SHALL respawn after a short delay at a safe location with visibly indicated temporary invulnerability. A player awaiting respawn SHALL count as having lives for team survival.

#### Scenario: Safe return
- **WHEN** a player with remaining lives completes the respawn delay
- **THEN** their ship returns safely with a visible protection indicator
- **AND** overlapping hazards do not immediately charge another life during protection

### Requirement: Noninteractive spectators
A player's third death SHALL remove their ship and put them in spectator mode until collective restart. Spectators SHALL observe the full arena and teammate status without affecting gameplay.

#### Scenario: Teammate survives longer
- **WHEN** one player exhausts three lives and another still has lives
- **THEN** the run continues for the survivor
- **AND** the eliminated player sees live gameplay but cannot move, shoot or collide

#### Scenario: Host eliminated
- **WHEN** the host loses their third life while a guest survives
- **THEN** the host spectates while continuing to simulate the world

### Requirement: Mid-run guest participation
New guests SHALL join combat immediately with three lives and safe-spawn protection. Hot dropping SHALL remove their interactive ship without resetting the world. An authenticated returning participant SHALL retain their current-run lives, score and elimination status.

#### Scenario: Newcomer joins a damaged field
- **WHEN** a new participant joins during a wave
- **THEN** they enter that wave with three lives
- **AND** existing asteroid health, fragment trees, scores and wave number remain unchanged

#### Scenario: Eliminated guest returns
- **WHEN** a guest rejoins using their valid room-scoped recovery identity after elimination
- **THEN** they remain a spectator until collective restart

#### Scenario: Guest drops mid-wave
- **WHEN** a guest disconnects while the host remains connected
- **THEN** their ship and active inputs are removed
- **AND** existing asteroid state and the current wave configuration remain unchanged

### Requirement: Team defeat and collective reset
The run SHALL end when no connected player has lives remaining. After a five-second results countdown, the game SHALL automatically restart all connected participants, including spectators, together at wave one with three lives and reset scores.

#### Scenario: All connected players eliminated
- **WHEN** every connected participant is eliminated
- **THEN** the game enters defeat, stops combat progression and begins a five-second results countdown

#### Scenario: Collective replay
- **WHEN** the five-second defeat countdown expires
- **THEN** all connected participants return together with three lives
- **AND** wave, score, world entities and pending old-run inputs are reset

#### Scenario: Arrival during defeat
- **WHEN** a new guest joins after team defeat but before reset
- **THEN** they wait for the next collective restart rather than reopening the defeated run

#### Scenario: Solo defeat
- **WHEN** the only connected player dies for the third time
- **THEN** the same defeat and collective-reset rules apply

