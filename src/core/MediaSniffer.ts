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
            const captureNode = node as unknown as HTMLVideoElement & {
                captureStream?: () => MediaStream;
            };
            return captureNode.captureStream?.() || null;
        }
        if ("mozCaptureStream" in node) {
            const captureNode = node as unknown as HTMLVideoElement & {
                mozCaptureStream?: () => MediaStream;
            };
            return captureNode.mozCaptureStream?.() || null;
        }
        return null;
    }
}
