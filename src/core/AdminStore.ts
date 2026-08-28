type AdminChangeListener = (isAdmin: boolean) => void;

export class AdminStore {
    private static _isAdmin = false;
    private static listeners = new Set<AdminChangeListener>();

    public static get isAdmin(): boolean {
        return AdminStore._isAdmin;
    }

    /**
     * Promotes the current user session to Admin.
     * Enables the Admin Tab and administrative capabilities.
     */
    public static makeAdmin(): void {
        if (!AdminStore._isAdmin) {
            AdminStore._isAdmin = true;
            AdminStore.notify();
            console.log("[AdminStore] Session granted admin privileges.");
        }
    }

    /**
     * Revokes admin privileges from the current session.
     */
    public static revokeAdmin(): void {
        if (AdminStore._isAdmin) {
            AdminStore._isAdmin = false;
            AdminStore.notify();
            console.log("[AdminStore] Admin privileges revoked.");
        }
    }

    public static subscribe(listener: AdminChangeListener): () => void {
        AdminStore.listeners.add(listener);
        listener(AdminStore._isAdmin);
        return () => AdminStore.listeners.delete(listener);
    }

    private static notify(): void {
        for (const listener of AdminStore.listeners) {
            try {
                listener(AdminStore._isAdmin);
            } catch (err) {
                console.error(
                    "[AdminStore] Error in subscriber listener:",
                    err,
                );
            }
        }
    }
}
