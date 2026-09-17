export class FileSystemAccess {
    public static async openDirectory(): Promise<FileSystemDirectoryHandle> {
        if (
            typeof window === "undefined" || !("showDirectoryPicker" in window)
        ) {
            throw new Error(
                "Native File System Access API is not supported in this browser.",
            );
        }
        const pickerWindow = window as Window & {
            showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
        };
        if (!pickerWindow.showDirectoryPicker) {
            throw new Error("Directory picker is not supported.");
        }
        return await pickerWindow.showDirectoryPicker();
    }
}
