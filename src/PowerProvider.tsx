import { useEffect, type ReactNode } from "react";

let initPromise: Promise<void> | null = null;

interface PowerProviderProps {
    children: ReactNode;
}

export default function PowerProvider({ children }: PowerProviderProps) {
    useEffect(() => {
        let canceled = false;
        let shouldInit = true;

        try {
            shouldInit = window.self !== window.top;
        } catch {
            shouldInit = true;
        }

        if (!shouldInit) {
            return () => {
                canceled = true;
            };
        }

        const initWithTimeout = async () => {
            try {
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
