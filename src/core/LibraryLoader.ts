import type { ExternalLibrary } from "../types/libs";

export class LibraryLoader {
    private static loadedScripts = new Set<string>();

    public static load(lib: ExternalLibrary): Promise<void> {
        return new Promise((resolve, reject) => {
            if (typeof document === "undefined") {
                return resolve();
            }

            if (
                LibraryLoader.loadedScripts.has(lib.url) ||
                document.querySelector(`script[src="${lib.url}"]`)
            ) {
                LibraryLoader.loadedScripts.add(lib.url);
                return resolve();
            }

            const script = document.createElement("script");
            script.src = lib.url;
            script.type = "text/javascript";
            script.setAttribute("data-library-name", lib.name);
            if (lib.async !== false) script.async = true;
            if (lib.defer) script.defer = true;

            script.onload = () => {
                LibraryLoader.loadedScripts.add(lib.url);
                resolve();
            };

            script.onerror = () => {
                reject(
                    new Error(
                        `[LibraryLoader] Failed to load library "${lib.name}" from ${lib.url}`,
                    ),
                );
            };

            document.head.appendChild(script);
        });
    }

    public static async loadAll(
        libraries: ExternalLibrary[] = [],
    ): Promise<void[]> {
        return Promise.all(libraries.map((lib) => LibraryLoader.load(lib)));
    }
}
