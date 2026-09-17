export declare class Clipboard {
    static write(text: string): Promise<void>;
    static read(): Promise<string>;
}
