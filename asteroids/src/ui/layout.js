export function fitAppLayout(surfaceWidth, surfaceHeight) {
  if (
    ![surfaceWidth, surfaceHeight].every(
      (value) => Number.isFinite(value) && value >= 0,
    )
  ) {
    throw new Error(
      "Browser surface dimensions must be finite nonnegative CSS pixel values.",
    );
  }

  const gap = Math.min(24, Math.max(12, surfaceWidth * 0.03));
  const inset = Math.min(24, Math.max(8, surfaceWidth * 0.03));
  const minGameSize = Math.min(surfaceHeight, Math.max(96, surfaceWidth * 0.28));
  const preferredPanelWidth = Math.min(
    420,
    Math.max(160, Math.min(surfaceWidth * 0.34, surfaceHeight * 0.55)),
  );
  const panelWidth = Math.min(
    preferredPanelWidth,
    Math.max(120, surfaceWidth - minGameSize - gap - inset * 2),
  );
  const gameSize = Math.max(
    0,
    Math.min(surfaceHeight, surfaceWidth - panelWidth - gap - inset * 2),
  );
  const contentWidth = gameSize + gap + panelWidth;

  return {
    x: (surfaceWidth - contentWidth) / 2,
    y: 0,
    width: contentWidth,
    height: surfaceHeight,
    gameSize,
    gameY: (surfaceHeight - gameSize) / 2,
    panelWidth,
    gap,
    panelX: gameSize + gap,
  };
}
