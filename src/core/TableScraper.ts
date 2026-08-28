export class TableScraper {
    public static extract(
        tableSelector: string | HTMLTableElement,
    ): Record<string, string>[] {
        const table = typeof tableSelector === "string"
            ? document.querySelector<HTMLTableElement>(tableSelector)
            : tableSelector;

        if (!table) return [];

        const rows = Array.from(table.rows);
        if (rows.length === 0) return [];

        const headers: string[] = [];
        const headerRow =
            table.querySelector<HTMLTableRowElement>("thead tr") || rows[0];
        const headerCells = Array.from(headerRow.cells);

        headerCells.forEach((cell: HTMLTableCellElement, index: number) => {
            const text = cell.textContent?.trim() || `column_${index + 1}`;
            headers.push(text);
        });

        const tbody = table.querySelector<HTMLTableSectionElement>("tbody");
        const dataRows: HTMLTableRowElement[] = tbody
            ? Array.from(tbody.rows)
            : rows.slice(1);

        return dataRows.map((row) => {
            const rowData: Record<string, string> = {};
            Array.from(row.cells).forEach(
                (cell: HTMLTableCellElement, index: number) => {
                    const key = headers[index] || `column_${index + 1}`;
                    rowData[key] = cell.textContent?.trim() || "";
                },
            );
            return rowData;
        });
    }
}
