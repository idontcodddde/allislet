export interface Command {
    id: string;
    label: string;
    category?: string;
    icon?: string;
    shortcut?: string;
    action: () => void;
}
export declare class CommandRegistry {
    private commands;
    private subscribers;
    register(command: Command): () => void;
    unregister(id: string): void;
    execute(id: string): void;
    getCommands(): Command[];
    search(query: string): Command[];
    subscribe(callback: () => void): () => void;
    private notify;
}
export declare const commandRegistry: CommandRegistry;
