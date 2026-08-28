export interface ExternalLibrary {
    name: string;
    url: string;
    async?: boolean;
    defer?: boolean;
}