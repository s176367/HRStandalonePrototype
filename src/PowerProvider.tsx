import { useEffect, type ReactNode } from "react";

let initPromise: Promise<void> | null = null;

export async function ensurePowerInit(): Promise<void> {
    if (!initPromise) {
        const { initialize } = await import("@microsoft/power-apps/app");
        initPromise = Promise.race([
            initialize(),
            new Promise((_, reject) =>
                setTimeout(
                    () => reject(new Error('Power SDK init timed out')),
                    10000,
                ),
            ),
        ]) as Promise<void>;
    }
    await initPromise;
}

interface PowerProviderProps {
    children: ReactNode;
}

export default function PowerProvider({ children }: PowerProviderProps) {
    useEffect(() => {
        let canceled = false;

        const initWithTimeout = async () => {
            try {
                await ensurePowerInit();
                if (!canceled) {
                    console.log('Power Platform SDK initialized successfully');
                }
            } catch (error) {
                if (!canceled) {
                    console.error('Failed to initialize Power Platform SDK:', error);
                }
            }
        };

        initWithTimeout();

        return () => {
            canceled = true;
        };
    }, []);

    return <>{children}</>;
}
