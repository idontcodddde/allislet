export class IndexedDBExplorer {
    public static async readDB(dbName: string): Promise<Record<string, any[]>> {
        return new Promise((resolve, reject) => {
            if (typeof indexedDB === "undefined") {
                return reject(
                    new Error(
                        "IndexedDB is not supported in this environment.",
                    ),
                );
            }

            const request = indexedDB.open(dbName);

            request.onerror = () => reject(request.error);

            request.onsuccess = async () => {
                const db = request.result;
                const storeNames = Array.from(db.objectStoreNames);
                const result: Record<string, any[]> = {};

                try {
                    for (const storeName of storeNames) {
                        result[storeName] = await IndexedDBExplorer.readStore(
                            db,
                            storeName,
                        );
                    }
                    db.close();
                    resolve(result);
                } catch (err) {
                    db.close();
                    reject(err);
                }
            };
        });
    }

    private static readStore(
        db: IDBDatabase,
        storeName: string,
    ): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const req = store.getAll();

            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }
}
