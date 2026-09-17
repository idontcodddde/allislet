type AdminChangeListener = (isAdmin: boolean) => void;
export declare class AdminStore {
    private static _isAdmin;
    private static listeners;
    static get isAdmin(): boolean;
    /**
     * Promotes the current user session to Admin.
     * Enables the Admin Tab and administrative capabilities.
     */
    static makeAdmin(): void;
    /**
     * Revokes admin privileges from the current session.
     */
    static revokeAdmin(): void;
    static subscribe(listener: AdminChangeListener): () => void;
    private static notify;
}
export {};
