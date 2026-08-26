export class BearerTokenExtractor {
    private currentToken: string | null = null;
    public enabled: boolean = false;

    /**
     * Sniffs Authorization headers and extracts Bearer JWT tokens if enabled.
     */
    extractFromHeader(headerValue?: string | null): void {
        if (!this.enabled || !headerValue) return;

        const match = headerValue.match(/Bearer\s+([A-Za-z0-9\-\._~\+\/]+=*)/i);
        if (match && match[1]) {
            this.currentToken = match[1];
        }
    }

    /**
     * Retrieves the currently active Bearer JWT token.
     */
    get(): string | null {
        return this.currentToken;
    }

    set(token: string | null): void {
        this.currentToken = token;
    }
}

export const BearerExtractor = new BearerTokenExtractor();
