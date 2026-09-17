import { ExternalLibrary } from '../types/libs';
export declare class LibraryLoader {
    private static loadedScripts;
    static load(lib: ExternalLibrary): Promise<void>;
    static loadAll(libraries?: ExternalLibrary[]): Promise<void[]>;
}
