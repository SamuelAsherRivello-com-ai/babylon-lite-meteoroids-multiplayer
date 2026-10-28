# Spec Delta

## MODIFIED Requirements

### Requirement: Landscape pixel arena
The game SHALL present the complete wrapping arena in a square pixel-perfect game view on the left side of a landscape app boundary, with sharp nearest-sampled artwork and pixel-aligned rendered anchors. Resize, zoom and display-density changes SHALL preserve the fixed logical world bounds and full-world framing. Small-screen alignment exceptions SHALL be documented.

#### Scenario: Resize and fullscreen
- **WHEN** the app boundary changes size or enters fullscreen
- **THEN** the largest square game view that fits beside the HUD remains visible with the complete world and preserved square aspect ratio
- **AND** the HUD remains visible in the right-side panel

#### Scenario: Heading changes
- **WHEN** a ship rotates
- **THEN** its visible heading remains consistent with firing direction
- **AND** the artwork retains the selected pixel rendering policy

## ADDED Requirements

### Requirement: Right-side game HUD
The app SHALL place game status, room actions, settings and applicable controls in a right-side panel beside the game view within the landscape app boundary.

#### Scenario: Active cooperative flight
- **WHEN** a flight is active
- **THEN** the right-side panel shows wave, remaining asteroids, team score, room code, host identity and connection status
- **AND** it shows every pilot's score, remaining lives and playing, respawning or spectating status

#### Scenario: Entry and settings
- **WHEN** no flight is active or a player opens settings
- **THEN** room entry, settings, title, version and relevant feedback remain usable in the right-side panel
- **AND** the panel does not cover or overlap the game view

#### Scenario: Touch play
- **WHEN** touch controls are enabled
- **THEN** rotate, thrust and fire controls remain available from the right-side panel
- **AND** intended touch actions can operate simultaneously
