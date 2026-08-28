export class WorkerOffloader {
    public static async run<T>(
        fn: (...args: any[]) => T,
        args: any[] = [],
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            const workerCode = `
                self.onmessage = async function(e) {
                    try {
                        const fn = ${fn.toString()};
                        const result = await fn(...e.data);
                        self.postMessage({ success: true, result });
                    } catch (error) {
                        self.postMessage({ success: false, error: error.message || String(error) });
                    }
                };
            `;

            const blob = new Blob([workerCode], {
                type: "application/javascript",
            });
            const workerUrl = URL.createObjectURL(blob);
            const worker = new Worker(workerUrl);

            worker.onmessage = (event) => {
                const { success, result, error } = event.data;
                worker.terminate();
                URL.revokeObjectURL(workerUrl);

                if (success) {
                    resolve(result);
                } else {
                    reject(new Error(error));
                }
            };

            worker.onerror = (err) => {
                worker.terminate();
                URL.revokeObjectURL(workerUrl);
                reject(err);
            };

            worker.postMessage(args);
        });
    }
}
