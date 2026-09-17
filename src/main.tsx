import { render } from "preact";
import { AppShell } from "./components/AppShell";
import { eventBus } from "./core/EventBus";
import { antiDetect } from "./core/AntiDetect";
import { pageExec } from "./core/PageExecutor";
import { storage } from "./core/GlobalStorage";
import { stateRegistry } from "./core/StateRegistry";
import { windowManager } from "./core/WindowManager";
import { AllisletProvider } from "./context/AllisletContext";
import { configureSignals, overlayPositionSignal } from "./core/Signals";
import { getPositionStyles } from "./utils/position";
import { ModalContainer } from "./ui/Modal";
import { initAllislet } from "./core/init";
import type { AllisletConfig } from "./types/config";
import { HostReset, ShadowMount, type ShadowMountHandle } from "./core/ShadowMount";
import type {
    AllisletRenderer,
    AllisletRuntimeContext,
    AllisletSDKOptions,
} from "./types/runtime";

export interface MountResult {
    mount: ShadowMountHandle;
    renderTarget: HTMLElement;
    stopPositionTracking: () => void;
    stopRenderer: () => void;
}

export async function mountAllislet(
    config: AllisletConfig,
    options: AllisletSDKOptions = {},
): Promise<MountResult> {
    const runtimeEventBus = options.services?.eventBus || eventBus;
    const runtimeStorage = options.services?.storage || storage;
    const runtimePageExec = options.services?.pageExec || pageExec;
    const runtimeAntiDetect = options.services?.antiDetect || antiDetect;
    configureSignals(config);
    await runtimeStorage.init(config.storage);
    await stateRegistry.hydrateAll();
    await initAllislet(config);

    const shadowMount = ShadowMount.create(
        config.id || "allislet-root",
        getPositionStyles(overlayPositionSignal.value),
        {
            document: options.document,
            parent: options.mountTarget || options.document?.body,
        },
    );
    HostReset.apply(shadowMount.host);
    const renderTarget = document.createElement("div");
    renderTarget.id = "allislet-render-target";
    shadowMount.root.appendChild(renderTarget);

    const stopPositionTracking = overlayPositionSignal.subscribe((newPosition) => {
        HostReset.apply(shadowMount.host);
        Object.assign(shadowMount.host.style, getPositionStyles(newPosition));
        windowManager.resetPosition();
    });

    windowManager.attach(shadowMount.host, shadowMount.root);
    const runtimeContext: AllisletRuntimeContext = {
        config,
        eventBus: runtimeEventBus,
        pageExec: runtimePageExec,
        storage: runtimeStorage,
        antiDetect: runtimeAntiDetect,
        host: shadowMount.host,
        root: shadowMount.root,
        renderTarget,
    };
    const renderer: AllisletRenderer = options.renderApp ||
        ((context) => {
            if (options.builtInUI === false) return;
            render(
                <AllisletProvider
                    config={context.config}
                    eventBus={context.eventBus}
                    pageExec={context.pageExec}
                    storage={context.storage}
                    antiDetect={context.antiDetect}
                >
                    <ModalContainer />
                    <AppShell />
                </AllisletProvider>,
                context.renderTarget,
            );
            return () => render(null, context.renderTarget);
        });
    const rendererCleanup = renderer(runtimeContext);
    config.onMount?.({
        eventBus: runtimeEventBus,
        pageExec: runtimePageExec,
        storage: runtimeStorage,
        antiDetect: runtimeAntiDetect,
    });

    return {
        mount: shadowMount,
        renderTarget,
        stopPositionTracking,
        stopRenderer: rendererCleanup || (() => render(null, renderTarget)),
    };
}

export async function mount(
    config: AllisletConfig,
    options?: AllisletSDKOptions,
): Promise<MountResult> {
    return mountAllislet(config, options);
}
