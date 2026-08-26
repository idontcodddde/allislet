import { createContext, ComponentChildren } from "preact";
import { useContext, useState, useRef, useEffect } from "preact/hooks";
import { MacroRecorder } from "../macro/MacroRecorder";
import { EventBus, eventBus } from "../core/EventBus";
import { HotkeyManager } from "../features/hotkeys";
import { AllisletConfig } from "../config";

interface AllisletContextType {
  config: AllisletConfig;
  recorder: MacroRecorder;
  bus: EventBus;
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
}

const AllisletContext = createContext<AllisletContextType | null>(null);

interface AllisletProviderProps {
  config: AllisletConfig;
  children: ComponentChildren;
}

export function AllisletProvider({ config, children }: AllisletProviderProps) {
  const recorderRef = useRef(new MacroRecorder());
  const busRef = useRef(eventBus);
  const [activeTab, setActiveTab] = useState(config.activeTabs?.[0] || "macro-recorder");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!config.hotkeys || config.hotkeys.length === 0) return;

    const manager = new HotkeyManager(busRef.current, config.hotkeys);
    manager.start();

    return () => {
      manager.stop();
    };
  }, [config.hotkeys]);

  return (
    <AllisletContext.Provider
      value={{
        config,
        recorder: recorderRef.current,
        bus: busRef.current,
        activeTab,
        setActiveTab,
        isCollapsed,
        setIsCollapsed,
      }}
    >
      {children}
    </AllisletContext.Provider>
  );
}

export function useAllislet() {
  const context = useContext(AllisletContext);
  if (!context) {
    throw new Error("useAllislet must be used within an AllisletProvider");
  }
  return context;
}
