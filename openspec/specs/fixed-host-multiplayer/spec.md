# fixed-host-multiplayer

## Purpose

Provide isolated cooperative rooms whose creator owns world simulation while guests can join, leave, recover, and receive consistent state.

## Requirements

### Requirement: Private four-player rooms
Players SHALL create or join private coded rooms and share a room URL. Each room SHALL support one to four connected players including spectators. Full, invalid, expired and conflicting-code cases SHALL have explicit outcomes.

#### Scenario: Capacity reached
- **WHEN** a fifth participant tries to join four connected participants
- **THEN** admission reports full without creating an overflow room

#### Scenario: Isolated rooms and games
- **WHEN** clients join different room codes or different registered games
- **THEN** their presence, actions and world state do not mix

### Requirement: Fixed player authority
The creator SHALL remain the only gameplay simulation host for the session. The relay SHALL accept authoritative world publication only from that host. Guests SHALL send bounded input rather than authoritative damage, positions, lives or waves.

#### Scenario: Guest attempts authority
- **WHEN** a guest publishes an authoritative snapshot or forged gameplay outcome
- **THEN** the relay rejects it and preserves the latest accepted host state

#### Scenario: Ordered guest input
- **WHEN** a connected guest sends valid sequenced movement and fire input
- **THEN** the relay attributes it to that participant and delivers it to the host
- **AND** stale, malformed and excessive inputs are rejected or neutralized

### Requirement: Complete late-join synchronization
A joining guest SHALL receive a current complete baseline, shared wave, player status and remaining asteroid health before controlling their ship. Membership and world updates SHALL be ordered so a stale snapshot cannot undo an acknowledged join or drop.

#### Scenario: Join after partial asteroid damage
- **WHEN** a guest joins after an asteroid has already lost health
- **THEN** that guest sees the remaining health and current fragments
- **AND** no entity is respawned or restored by the join

#### Scenario: Old state arrives after reset
- **WHEN** a snapshot or input from a previous run arrives after collective reset
- **THEN** the client and host ignore it without restoring old ships or projectiles

### Requirement: Identity-preserving guest recovery
Guest recovery SHALL authenticate a room-scoped participant identity independent of seat or socket ID for the room session. Returning guests SHALL retain lives, score and spectator status. Tokens SHALL NOT appear in share URLs or public world state.

#### Scenario: Socket ID changes
- **WHEN** an authenticated returning guest receives a fresh socket session
- **THEN** their run ledger remains attached to the original participant identity

#### Scenario: Vacant seat used by a newcomer
- **WHEN** a genuinely new participant occupies a departed guest's seat
- **THEN** they do not inherit that guest's private recovery identity or run ledger

#### Scenario: Recovery when full
- **WHEN** a returning guest requests admission while four participants are connected
- **THEN** the system reports full without ejecting a participant

### Requirement: Terminal host loss
Intentional host departure or detected host disconnection SHALL end the session, invalidate further admission and return connected guests to the lobby with a reason. The system SHALL NOT migrate host authority or automatically create a replacement session.

#### Scenario: Host leaves
- **WHEN** the host chooses Leave Room
- **THEN** guests receive a session-ended outcome and return to the lobby
- **AND** the old room code cannot reopen the ended session

#### Scenario: Host connection lost
- **WHEN** transport liveness detects loss of the host connection
- **THEN** the room ends without electing another participant
- **AND** guest retry loops stop for that ended room

### Requirement: Responsive synchronized presentation
Local movement SHALL respond without waiting for a relay round trip. Guests SHALL reconcile to host-acknowledged input and interpolate remote entities with wrap-aware motion. Only host outcomes SHALL determine damage and progression.

#### Scenario: Latency and jitter
- **WHEN** clients play with simulated latency and jitter
- **THEN** local controls remain responsive and remote movement follows the host without edge-crossing jumps across the arena
- **AND** all clients agree on lives, fractures, wave changes and defeat

### Requirement: Local settings preserve shared play
Opening a local dialog or losing local input focus SHALL neutralize that player's controls without pausing host world simulation for other players.

#### Scenario: Host opens settings
- **WHEN** the host opens the settings dialog
- **THEN** the host ship receives neutral input
- **AND** shared simulation, guest input processing and snapshots continue

