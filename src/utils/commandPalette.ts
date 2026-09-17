import { eventBus } from "../core/EventBus";

/**
 * Initializes listeners for Command Palette events.
 */
export function registerCommandPaletteUtil(): () => void {
  const unsubscribe = eventBus.on("ui:do-thing", (payload: unknown) => {
    const combo = isHotkeyPayload(payload) ? payload.combo : undefined;
    const triggerInfo = combo
      ? ` (Triggered via ${combo})`
      : "";
    console.log(`Command Palette Shown!${triggerInfo}`);
  });

  return unsubscribe;
}

function isHotkeyPayload(payload: unknown): payload is { combo: string } {
  return Boolean(payload) &&
    typeof payload === "object" &&
    typeof (payload as { combo?: unknown }).combo === "string";
}
