import type { EventBus } from "../core/EventBus";
import type { PageExecutor } from "../core/PageExecutor";
import type { GlobalStorage } from "../core/GlobalStorage";
import type { AntiDetect } from "../core/AntiDetect";

export interface OnMountContext {
    eventBus: EventBus;
    pageExec: PageExecutor;
    storage: GlobalStorage;
    antiDetect: AntiDetect;
}
