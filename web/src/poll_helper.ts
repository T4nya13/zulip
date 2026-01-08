export class ZulipPollHelper {
    constructor(public message_id: number) {}

    is_container_hidden(): boolean {
        // Always return false so the widget renders in our showcase
        return false;
    }
}
