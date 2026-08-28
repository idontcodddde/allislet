export class ScreenCapture {
    public static async captureNode(
        node: HTMLElement,
    ): Promise<HTMLCanvasElement> {
        const rect = node.getBoundingClientRect();
        const serialized = new XMLSerializer().serializeToString(node);

        const svgString = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
                <foreignObject width="100%" height="100%">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: sans-serif;">
                        ${serialized}
                    </div>
                </foreignObject>
            </svg>
        `;

        const blob = new Blob([svgString], {
            type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const scale = window.devicePixelRatio || 1;
                canvas.width = rect.width * scale;
                canvas.height = rect.height * scale;

                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.scale(scale, scale);
                    ctx.drawImage(img, 0, 0);
                }
                URL.revokeObjectURL(url);
                resolve(canvas);
            };
            img.onerror = (err) => {
                URL.revokeObjectURL(url);
                reject(err);
            };
            img.src = url;
        });
    }
}
