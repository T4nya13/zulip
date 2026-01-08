export function get_by_user_id(user_id: number) {
    return {
        user_id,
        full_name: user_id === 1 ? "Alice" : "Bob",
        email: user_id === 1 ? "alice@zulip.com" : "bob@zulip.com",
        avatar_url: ""
    };
}

export function is_active_user(): boolean {
    return true;
}

export function get_full_name(user_id: number): string {
    return user_id === 1 ? "Alice" : "Bob";
}
