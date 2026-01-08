export function get_by_user_id(user_id: number) {
    const name = user_id === 111 ? "Alice" : "Bob";
    return {
        user_id,
        full_name: name,
        email: `${name.toLowerCase()}@zulip.com`,
        avatar_url: ""
    };
}

export function is_active_user(): boolean {
    return true;
}

export function get_full_name(user_id: number): string {
    return user_id === 111 ? "Alice" : "Bob";
}

export function is_my_user_id(user_id: number): boolean {
    return user_id === 111;
}
