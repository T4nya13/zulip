declare global {
    interface Window {
        blueslip: any;
        page_params: any;
    }
}
// 1. Mock the global Zulip objects
window.blueslip = {
    error: (msg: string, details?: unknown) => console.error("Blueslip Error:", msg, details),
    warn: (msg: string) => console.warn("Blueslip Warn:", msg),
    info: (msg: string) => console.log("Blueslip Info:", msg),
    debug: (msg: string) => console.log("Blueslip Debug:", msg),
    exception: (e: Error) => console.error("Blueslip Exception:", e),
};

window.page_params = {
    is_admin: false,
    realm_uri: "http://localhost:9991",
    full_name: "Showcase User",
    user_id: 1,
    realm_poll_widgets_enabled: true
};

// 2. Mock the default export for the stacktrace utility
// This prevents the "blueslip_stacktrace_default is not a function" error
const blueslip_stacktrace = () => "Showcase stacktrace placeholder";
export default blueslip_stacktrace;

// 3. Export the blueslip object for named imports
export const blueslip = window.blueslip;
export const page_params = window.page_params;