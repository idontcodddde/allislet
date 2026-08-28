export class MediaSniffer {
    public static findAudioVideo(): (HTMLAudioElement | HTMLVideoElement)[] {
        if (typeof document === "undefined") return [];
        const mediaEls = document.querySelectorAll<
            HTMLAudioElement | HTMLVideoElement
        >("audio, video");
        return Array.from(mediaEls);
    }

    public static captureStream(
        node: HTMLVideoElement | HTMLCanvasElement,
    ): MediaStream | null {
        if (!node) return null;
        if ("captureStream" in node) {
            return (node as any).captureStream();
        }
        if ("mozCaptureStream" in node) {
            return (node as any).mozCaptureStream();
        }
        return null;
    }
}
