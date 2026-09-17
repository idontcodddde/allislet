import { EventBus } from '../core/EventBus';
import { PageExecutor } from '../core/PageExecutor';
import { GlobalStorage } from '../core/GlobalStorage';
import { AntiDetect } from '../core/AntiDetect';
export interface OnMountContext {
    eventBus: EventBus;
    pageExec: PageExecutor;
    storage: GlobalStorage;
    antiDetect: AntiDetect;
}
