export interface Command {
    id: string;
    label: string;
    category?: string;
    icon?: string;
    shortcut?: string;
    action: () => void;
}

export class CommandRegistry {
    private commands: Map<string, Command> = new Map();
    private subscribers: Set<() => void> = new Set();

    public register(command: Command): () => void {
        this.commands.set(command.id, command);
        this.notify();
        return () => this.unregister(command.id);
    }

    public unregister(id: string): void {
        if (this.commands.delete(id)) {
            this.notify();
        }
    }

    public execute(id: string): void {
        const cmd = this.commands.get(id);
        if (cmd) {
            cmd.action();
        }
    }

    public getCommands(): Command[] {
        return Array.from(this.commands.values());
    }

    public search(query: string): Command[] {
        const q = query.toLowerCase().trim();
        if (!q) return this.getCommands();
        return this.getCommands().filter(
            (cmd) =>
                cmd.label.toLowerCase().includes(q) ||
                (cmd.category && cmd.category.toLowerCase().includes(q)),
        );
    }

    public subscribe(callback: () => void): () => void {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    private notify(): void {
        this.subscribers.forEach((cb) => cb());
    }
}

export const commandRegistry = new CommandRegistry();
