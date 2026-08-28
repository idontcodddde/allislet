export class CSVExporter {
    public static download(
        filename: string,
        data: Record<string, any>[] | any[][],
    ): void {
        if (!data || !data.length) return;

        let csvContent = "";
        if (Array.isArray(data[0])) {
            csvContent = (data as any[][])
                .map((row) => row.map(CSVExporter.escapeCell).join(","))
                .join("\n");
        } else {
            const objArray = data as Record<string, any>[];
            const headers = Array.from(
                new Set(objArray.flatMap((obj) => Object.keys(obj))),
            );
            const headerLine = headers.map(CSVExporter.escapeCell).join(",");
            const rowLines = objArray.map((obj) =>
                headers.map((h) => CSVExporter.escapeCell(obj[h] ?? "")).join(
                    ",",
                )
            );
            csvContent = [headerLine, ...rowLines].join("\n");
        }

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        CSVExporter.triggerDownload(
            filename.endsWith(".csv") ? filename : `${filename}.csv`,
            blob,
        );
    }

    private static escapeCell(value: any): string {
        const str = String(value ?? "");
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    }

    private static triggerDownload(filename: string, blob: Blob): void {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

export class JSONExporter {
    public static download(filename: string, data: any): void {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], {
            type: "application/json;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename.endsWith(".json")
            ? filename
            : `${filename}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}
