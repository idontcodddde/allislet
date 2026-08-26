import { eventBus } from "../core/EventBus";

/**
 * Initializes listeners for Command Palette events.
 */
export function registerCommandPaletteUtil(): () => void {
  const unsubscribe = eventBus.on("ui:open-command-palette", (payload) => {
    const triggerInfo = payload?.combo ? ` (Triggered via ${payload.combo})` : "";
    alert(`Command Palette Shown!${triggerInfo}`);
  });

  return unsubscribe;
}
