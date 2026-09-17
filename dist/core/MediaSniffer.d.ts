export declare class MediaSniffer {
    static findAudioVideo(): (HTMLAudioElement | HTMLVideoElement)[];
    static captureStream(node: HTMLVideoElement | HTMLCanvasElement): MediaStream | null;
}
