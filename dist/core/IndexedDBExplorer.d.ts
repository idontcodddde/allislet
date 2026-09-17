export declare class IndexedDBExplorer {
    static readDB(dbName: string): Promise<Record<string, unknown[]>>;
    private static readStore;
}
