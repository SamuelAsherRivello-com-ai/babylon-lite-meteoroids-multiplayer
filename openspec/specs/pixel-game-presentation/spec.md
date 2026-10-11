# pixel-game-presentation

## Purpose

Present a readable original pixel-art Asteroids game with usable controls, spectator feedback, and consistent framing across browser sizes.

## Requirements

### Requirement: Landscape pixel arena
The game SHALL use one stationary landscape view of the entire arena, sharp nearest-sampled artwork and pixel-aligned rendered anchors. Resize, zoom and display-density changes SHALL preserve logical world bounds. Small-screen alignment exceptions SHALL be documented.

#### Scenario: Resize and fullscreen
- **WHEN** the viewport changes size or enters fullscreen
- **THEN** the same world remains visible with preserved aspect ratio
- **AND** the HUD remains inside the visible game viewport

#### Scenario: Heading changes
- **WHEN** a ship rotates
- **THEN** its visible heading remains consistent with firing direction
- **AND** the artwork retains the selected pixel rendering policy

### Requirement: Concurrent desktop and touch controls
Players SHALL rotate with A/D or Left/Right, thrust with W or Up, and fire with Space. Touch users SHALL have simultaneous rotate, thrust and fire controls. Focus loss and pointer cancellation SHALL release held input.

#### Scenario: Concurrent touch actions
- **WHEN** a player holds thrust and fire while rotating through touch controls
- **THEN** all intended actions can operate together without stuck buttons

### Requirement: Team and spectator HUD
The HUD SHALL show wave, remaining asteroids, team score, room code, host identity and connection status. Each participant SHALL have distinguishable ship/roster styling, score, remaining lives and playing, respawning or spectating status.

#### Scenario: Spectator watches survivor
- **WHEN** an eliminated player spectates a surviving teammate
- **THEN** the HUD clearly distinguishes their own elimination from team defeat
- **AND** the teammate's remaining lives and current wave remain visible

### Requirement: Original feedback and settings
The game SHALL use original ship, asteroid, effect, UI and sound assets. Asteroid damage, fracture, death and temporary protection SHALL be readable. Sound SHALL have UI mute and a documented silent-testing URL option; reduced motion SHALL be available.

#### Scenario: Silent verification
- **WHEN** the game opens with its documented mute URL option
- **THEN** no game sounds play until the user explicitly enables them

### Requirement: Useful initialization failure
Unsupported rendering capability or initialization failure SHALL display a useful message while leaving the surrounding interface usable.

#### Scenario: WebGPU unavailable
- **WHEN** the browser cannot initialize the required renderer
- **THEN** it shows a clear browser/capability recovery message rather than a blank canvas

