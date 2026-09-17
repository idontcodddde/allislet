export declare class BearerTokenExtractor {
    private currentToken;
    enabled: boolean;
    /**
     * Sniffs Authorization headers and extracts Bearer JWT tokens if enabled.
     */
    extractFromHeader(headerValue?: string | null): void;
    /**
     * Retrieves the currently active Bearer JWT token.
     */
    get(): string | null;
    set(token: string | null): void;
}
export declare const BearerExtractor: BearerTokenExtractor;
