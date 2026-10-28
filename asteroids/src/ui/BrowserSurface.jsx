import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ContentPanelProvider } from "../shared/ContentShellContext.jsx";
import { fitAppLayout } from "./layout.js";
import { fitPresentationFrame } from "./presentation.js";

export function BrowserSurface({ children, header, footer, ui }) {
  const surfaceRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [panelTarget, setPanelTarget] = useState(null);
  const attachPanel = useCallback(setPanelTarget, []);
  const [fullscreen, setFullscreen] = useState(
    () => typeof document !== "undefined" && Boolean(document.fullscreenElement),
  );
  const [screenSize, setScreenSize] = useState(() => ({
    width: typeof window === "undefined" ? 0 : window.innerWidth,
    height: typeof window === "undefined" ? 0 : window.innerHeight,
  }));

  useLayoutEffect(() => {
    const sync = () => {
      setFullscreen(Boolean(document.fullscreenElement));
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", sync);
    document.addEventListener("fullscreenchange", sync);
    return () => {
      window.removeEventListener("resize", sync);
      document.removeEventListener("fullscreenchange", sync);
    };
  }, []);

  useLayoutEffect(() => {
    const surface = surfaceRef.current;
    const measure = () =>
      setSize({ width: surface.clientWidth, height: surface.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(surface);
    return () => observer.disconnect();
  }, []);

  const frame = fullscreen
    ? fitPresentationFrame(screenSize.width, screenSize.height)
    : null;
  const layout = fitAppLayout(size.width, size.height);

  return (
    <div className="surface-shell">
      <div
        ref={surfaceRef}
        id="browser_surface"
        data-fullscreen={fullscreen}
        style={
          frame
            ? { width: `${frame.width}px`, height: `${frame.height}px` }
            : undefined
        }
      >
        <div
          id="app_composition"
          style={{
            left: layout.x,
            width: layout.width,
            height: layout.height,
            "--game-size": `${layout.gameSize}px`,
            "--game-y": `${layout.gameY}px`,
            "--panel-x": `${layout.panelX}px`,
            "--panel-width": `${layout.panelWidth}px`,
          }}
        >
          <section id="game_region" aria-label="Asteroids game">
            <div className="arena_frame">
              <ContentPanelProvider target={panelTarget}>
                <div id="content_layer">{children}</div>
              </ContentPanelProvider>
            </div>
          </section>
          <aside id="hud_panel" aria-label="Game information and controls">
            <div className="panel_header">{header}</div>
            <div id="content_panel" ref={attachPanel} />
            <div className="panel_footer">{footer}</div>
            {ui}
          </aside>
        </div>
      </div>
    </div>
  );
}
