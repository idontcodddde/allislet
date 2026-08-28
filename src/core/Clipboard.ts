export class Clipboard {
    public static async write(text: string): Promise<void> {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return;
        }

        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (!successful) {
            throw new Error(
                "Clipboard write failed using execCommand fallback.",
            );
        }
    }

    public static async read(): Promise<string> {
        if (navigator.clipboard && navigator.clipboard.readText) {
            return await navigator.clipboard.readText();
        }
        throw new Error(
            "Clipboard read is not supported or permission was denied.",
        );
    }
}
