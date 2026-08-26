import { useEffect, useState } from "preact/hooks";
import { Signal } from "@preact/signals";

export function useSignalValue<T>(sig: Signal<T>): T {
    const [value, setValue] = useState<T>(sig.value);

    useEffect(() => {
        setValue(sig.value);

        const unsubscribe = sig.subscribe((val) => {
            setValue(val);
        });

        return () => unsubscribe();
    }, [sig]);

    return sig.value;
}
