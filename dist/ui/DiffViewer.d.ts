export interface DiffViewerProps {
    oldText: string;
    newText: string;
    titleOld?: string;
    titleNew?: string;
}
export declare function DiffViewer({ oldText, newText, titleOld, titleNew, }: DiffViewerProps): import("preact").JSX.Element;
