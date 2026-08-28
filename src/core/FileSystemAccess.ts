export class FileSystemAccess {
    public static async openDirectory(): Promise<FileSystemDirectoryHandle> {
        if (
            typeof window === "undefined" || !("showDirectoryPicker" in window)
        ) {
            throw new Error(
                "Native File System Access API is not supported in this browser.",
            );
        }
        return await (window as any).showDirectoryPicker();
    }
}
