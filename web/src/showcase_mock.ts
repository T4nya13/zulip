declare global {
    interface Window {
        blueslip: any;
        page_params: any;
        blueslip_stacktrace_default: any;
    }
}

const blueslip_stacktrace = () => "Showcase stacktrace placeholder";

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

window.blueslip_stacktrace_default = blueslip_stacktrace;

export const blueslip = window.blueslip;
export const page_params = window.page_params;
export default blueslip_stacktrace;
