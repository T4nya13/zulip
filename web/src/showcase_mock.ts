declare global {
    interface Window {
        blueslip: any;
        blueslip_stacktrace_default: any;
    }
}

// Mock the stacktrace function for the error logger
const blueslip_stacktrace = () => "Showcase stacktrace placeholder";
window.blueslip_stacktrace_default = blueslip_stacktrace;

// Mock the error logger
window.blueslip = {
    error: (msg: string, details?: unknown) => console.error("Blueslip Error:", msg, details),
    warn: (msg: string) => console.warn("Blueslip Warn:", msg),
    info: (msg: string) => console.log("Blueslip Info:", msg),
    debug: (msg: string) => console.log("Blueslip Debug:", msg),
    exception: (e: Error) => console.error("Blueslip Exception:", e),
};

export default blueslip_stacktrace;