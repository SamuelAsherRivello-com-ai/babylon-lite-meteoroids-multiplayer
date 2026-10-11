import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Content,
  GamePreferencesProvider,
  GameSettings,
} from "./content/Content.jsx";
import { App } from "./ui/App.jsx";
import "./ui/style.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GamePreferencesProvider>
      <App
        content={<Content />}
        contentPresentation={{ Settings: GameSettings }}
      />
    </GamePreferencesProvider>
  </StrictMode>,
);
