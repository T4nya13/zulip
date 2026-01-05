// 1. Tell TypeScript about the globals
declare global {
    interface Window {
        DEVELOPMENT: boolean;
        ZULIP_VERSION: string;
        blueslip: any;
        page_params: any;
        blueslip_stacktrace_default: any;
    }
}

// 2. Define the Environment Flags
window.DEVELOPMENT = false; // Set to false for the production build
window.ZULIP_VERSION = "showcase-demo";

// 3. Define the stacktrace function
const blueslip_stacktrace = () => "Showcase stacktrace placeholder";
window.blueslip_stacktrace_default = blueslip_stacktrace;

// 4. Attach Zulip Engine dependencies to window
window.blueslip = {
    error: (msg: string, details?: unknown) => console.error("Blueslip Error:", msg, details),
    warn: (msg: string) => console.warn("Blueslip Warn:", msg),
    info: (msg: string) => console.log("Blueslip Info:", msg),
    debug: (msg: string) => console.log("Blueslip Debug:", msg),
    exception: (e: Error) => console.error("Blueslip Exception:", e),
};

window.page_params = {
    is_admin: false,
    realm_uri: "https://zulip.com",
    full_name: "Showcase User",
    user_id: 1,
    realm_poll_widgets_enabled: true
};

// 5. Exports for the bundler
export const blueslip = window.blueslip;
export const page_params = window.page_params;
export default blueslip_stacktrace;