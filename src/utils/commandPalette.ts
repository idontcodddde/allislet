import { eventBus } from "../core/EventBus";

/**
 * Initializes listeners for Command Palette events.
 */
export function registerCommandPaletteUtil(): () => void {
  const unsubscribe = eventBus.on("ui:do-thing", (payload) => {
    const triggerInfo = payload?.combo
      ? ` (Triggered via ${payload.combo})`
      : "";
    console.log(`Command Palette Shown!${triggerInfo}`);
  });

  return unsubscribe;
}
