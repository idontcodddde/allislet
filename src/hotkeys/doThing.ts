import { eventBus } from "allislet";

export function RegisterDoThingHotkey(): void {
    eventBus.on("ui:do-thing", (data) => {
        console.log("[Hotkey] Triggered ui:do-thing via Alt+K!", data);
    });
}
