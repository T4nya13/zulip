import $ from "jquery";
import * as poll_widget from "./poll_widget.ts";
import * as people from "./people.ts";

let alice_inbound: (events: any[]) => void;
let bob_inbound: (events: any[]) => void;

const virtual_server = {
    broadcast(data: any, sender_id: number): void {
        const events = [{ sender_id, data }];
        if (alice_inbound) { alice_inbound(events); }
        if (bob_inbound) { bob_inbound(events); }
        $("#submessage-feed").prepend(`<div><strong>User ${sender_id}:</strong> ${JSON.stringify(data)}</div>`);
    }
};

export function initialize(): void {
    const ALICE_ID = 111;
    const BOB_ID = 222;

    if (!people.is_known_user_id(ALICE_ID)) {
        people.add_active_user({ user_id: ALICE_ID, full_name: "Alice", email: "alice@zulip.com" });
    }
    if (!people.is_known_user_id(BOB_ID)) {
        people.add_active_user({ user_id: BOB_ID, full_name: "Bob", email: "bob@zulip.com" });
    }

    const $container = $("<div id='gsoc-showcase'>").css({
        position: "fixed", top: "60px", right: "20px", width: "400px",
        background: "white",color: "#333", border: "2px solid #100f0fff", zIndex: 9999,
        padding: "15px", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
    }).appendTo("body");

    $container.html(`
        <h3 style="margin-top:0">Multi-User Sync</h3>
        <div id="alice-zone" style="border: 1px solid #007bff; padding: 10px; margin-bottom: 10px;">
            <strong>Alice</strong> <div class="widget"></div>
        </div>
        <div id="bob-zone" style="border: 1px solid #28a745; padding: 10px;">
            <strong>Bob</strong> <div class="widget"></div>
        </div>
        <div id="submessage-feed" style="background:#eee; height:80px; overflow-y:auto; margin-top:10px; font-size:10px;"></div>
    `);

    const mock_message = {
        id: 101,
        sender_id: ALICE_ID,
        content: "What is your favorite drink?", 
        type: "out_home"
    };

    const poll_options = {
        question: "What is your favorite drink?",
    };

    alice_inbound = poll_widget.activate({
        $elem: $("#alice-zone .widget"),
        callback: (data: any) => virtual_server.broadcast(data, ALICE_ID),
        message: mock_message as any,
        extra_data: poll_options as any
    });

    bob_inbound = poll_widget.activate({
        $elem: $("#bob-zone .widget"),
        callback: (data: any) => virtual_server.broadcast(data, BOB_ID),
        message: mock_message as any,
        extra_data: poll_options as any
    });
}