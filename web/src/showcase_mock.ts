// This file mocks global variables that Zulip expects to exist.
// It prevents "ReferenceError" during the standalone bundle process.

(window as any).page_params = {
    is_admin: false,
    user_id: 9, // Alice
    development_environment: true,
};

(window as any).blueslip = {
    warn: (msg: string) => console.warn("Blueslip Mock:", msg),
    error: (msg: string) => console.error("Blueslip Mock:", msg),
};

(window as any).DEVELOPMENT = true;
(window as any).ZULIP_VERSION = "GSoC-Showcase";

// Fix for the blueslip stacktrace crash
export const blueslip = {
    error: (msg: string, details?: unknown) => console.error("Blueslip Error:", msg, details),
    warn: (msg: string) => console.warn("Blueslip Warn:", msg),
    info: (msg: string) => console.log("Blueslip Info:", msg),
    debug: (msg: string) => console.log("Blueslip Debug:", msg),
    exception: (e: Error) => console.error("Blueslip Exception:", e),
};

// Mock a default export for the stacktrace utility
export default function blueslip_stacktrace() {
    return "Showcase stacktrace placeholder";
}