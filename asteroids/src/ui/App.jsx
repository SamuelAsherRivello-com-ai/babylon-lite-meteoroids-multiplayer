import { useEffect, useState } from "react";
import versionText from "../../../version.txt?raw";
import { ContentShellProvider } from "../shared/ContentShellContext.jsx";
import { BrowserSurface } from "./BrowserSurface.jsx";
import { Dialog } from "./Dialog.jsx";
export function App({ content, contentPresentation }) {
  const [open, setOpen] = useState(false),
    [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    const sync = () => setFullscreen(Boolean(document.fullscreenElement));
    const key = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("fullscreenchange", sync);
    window.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      window.removeEventListener("keydown", key);
    };
  }, []);
  const toggle = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setFullscreen(false);
    }
  };
  const Settings = contentPresentation.Settings;
  return (
    <ContentShellProvider paused={open}>
      <BrowserSurface
        header={
          <>
            <b className="panel_brand">
              ASTEROIDS <span>CO-OP</span>
            </b>
            <a
              className="panel_link"
              href="https://github.com/SamuelAsherRivello/babylon-lite-asteroids-multiplayer-clone"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          </>
        }
        footer={
          <>
            <button onClick={() => setOpen(true)}>Settings</button>
            <span className="panel_version">
              v
              {versionText
                .trim()
                .replace(/^version=/, "")
                .replace(/^v/, "")}
            </span>
          </>
        }
        ui={
          <>
            {open && (
              <Dialog title="Flight settings" onClose={() => setOpen(false)}>
                <label>
                  <input
                    type="checkbox"
                    checked={fullscreen}
                    onChange={toggle}
                  />{" "}
                  Fullscreen
                </label>
                <Settings />
                <p>
                  The flight continues while settings are open. Your controls
                  are released.
                </p>
              </Dialog>
            )}
          </>
        }
      >
        {content}
      </BrowserSurface>
    </ContentShellProvider>
  );
}
