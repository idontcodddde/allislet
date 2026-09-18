import type { AllisletConfig } from "./types/config";
import type { WindowConfig } from "./windows/types";
import { mountAllislet, type MountResult } from "./main";
import { storage, type GlobalStorage } from "./core/GlobalStorage";
import { windowManager } from "./core/WindowManager";
import { destroyNetworkEngine } from "./core/Engine";
import type { AllisletSDKOptions } from "./types/runtime";
import {
    registerView,
    unregisterView,
    type ViewDefinition,
} from "./views";

export class AllisletSDK {
    public readonly config: AllisletConfig;
    private lifecycle: MountResult | null = null;
    private mounted = false;

    public constructor(
        config: AllisletConfig,
        private readonly options: AllisletSDKOptions = {},
    ) {
        this.config = config;
    }

    public static create(
        config: AllisletConfig,
        options?: AllisletSDKOptions,
    ): AllisletSDK {
        return new AllisletSDK(config, options);
    }

    public async mount(): Promise<void> {
        if (this.mounted) return;
        const ownerDocument = this.options.document || document;
        const existing = ownerDocument.getElementById(this.config.id || "allislet-root");
        if (existing) {
            throw new Error(`[Allislet] A mount already exists for "${existing.id}".`);
        }

        this.lifecycle = await mountAllislet(this.config, this.options);
        this.mounted = true;
    }

    public destroy(): void {
        if (!this.lifecycle) return;
        this.lifecycle.stopRenderer();
        this.lifecycle.stopPositionTracking();
        destroyNetworkEngine();
        windowManager.destroy();
        this.lifecycle.mount.destroy();
        this.config.onCleanup?.();
        this.lifecycle = null;
        this.mounted = false;
    }

    public openWindow(id: string, options: Omit<WindowConfig, "id">): void {
        windowManager.openWindow({ ...options, id });
    }

    public closeWindow(id: string): void {
        windowManager.closeWindow(id);
    }

    public getStorage(): GlobalStorage {
        return this.options.services?.storage || storage;
    }

    public addView(view: ViewDefinition): () => void {
        return registerView(view);
    }

    public registerView(view: ViewDefinition): () => void {
        return this.addView(view);
    }

    public removeView(id: string): boolean {
        return unregisterView(id);
    }

    public unregisterView(id: string): boolean {
        return this.removeView(id);
    }
}
