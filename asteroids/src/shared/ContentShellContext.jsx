import { createContext, useContext } from "react";

const ContentShellContext = createContext({ paused: false, panelTarget: null });

export function ContentShellProvider({ paused, panelTarget = null, children }) {
  return (
    <ContentShellContext.Provider value={{ paused, panelTarget }}>
      {children}
    </ContentShellContext.Provider>
  );
}

export function useContentShell() {
  return useContext(ContentShellContext);
}

export function ContentPanelProvider({ target, children }) {
  const shell = useContext(ContentShellContext);
  return (
    <ContentShellContext.Provider value={{ ...shell, panelTarget: target }}>
      {children}
    </ContentShellContext.Provider>
  );
}
