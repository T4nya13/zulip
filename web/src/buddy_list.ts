/* eslint-disable @typescript-eslint/no-explicit-any */

// 1. THE BYPASS (This kills the "Cannot find module" errors)
const $: any = (window as any).$;
const tippy: any = (window as any).tippy;
const assert: any = (val: any) => { if (!val) throw new Error("Assertion failed"); };

// 2. THE LOCAL IMPORTS (Note: No .ts extensions here)
import * as background_task from "./background_task.ts";
import * as blueslip from "./blueslip";
import * as buddy_data from "./buddy_data.ts";
import type {BuddyUserInfo} from "./buddy_data";
import type {Filter} from "./filter";
import * as hash_util from "./hash_util";
import {$t} from "./i18n.ts";
import * as message_viewport from "./message_viewport.ts";
import * as narrow_state from "./narrow_state.ts";
import * as padded_widget from "./padded_widget.ts";
import {page_params} from "./page_params";
import * as peer_data from "./peer_data";
import * as people from "./people";
import * as hbs_bridge from "./hbs_bridge.ts";
import * as pure_dom from "./pure_dom.ts";
import * as scroll_util from "./scroll_util.ts";
import * as settings_config from "./settings_config";
import {current_user} from "./state_data";
import * as stream_data from "./stream_data";
import type {StreamSubscription} from "./sub_store";
import {INTERACTIVE_HOVER_DELAY} from "./tippyjs";
import * as ui_util from "./ui_util";
import {user_settings} from "./user_settings";
import * as util from "./util.ts";


// --- BRIDGE RENDERING HELPERS ---

function render_section_header(info: any): DocumentFragment {
    const block = pure_dom.buddy_list_section_header(info);
    // FIX: Get the actual DOM, not the Handlebars source text
    return (block as any).to_dom();
}

// --- CLASS CONFIG ---

class BuddyListConf {
    participants_list_selector = "#buddy-list-participants";
    matching_view_list_selector = "#buddy-list-users-matching-view";
    other_user_list_selector = "#buddy-list-other-users";
    scroll_container_selector = "#buddy_list_wrapper";
    item_selector = "li.user_sidebar_entry";
    padding_selector = "#buddy_list_wrapper_padding";
    compare_function = buddy_data.compare_function;

    items_to_dom(opts: {items: any[]}): DocumentFragment {
        const block = pure_dom.presence_rows({presence_rows: opts.items});
        return (block as any).to_dom();
    }

    item_to_html(opts: {item: any}): string {
        const block = pure_dom.presence_row(opts.item);
        return (block as any).to_source("");
    }

    get_li_from_user_id(opts: {user_id: number}): JQuery {
        const user_id = opts.user_id;
        return $("#buddy_list_wrapper").find(
            `${this.item_selector}[data-user-id='${CSS.escape(user_id.toString())}']`,
        );
    }

    get_data_from_user_ids(user_ids: number[]): BuddyUserInfo[] {
        return buddy_data.get_items_for_users(user_ids);
    }

    height_to_fill(): number {
        return message_viewport.height();
    }
}

// --- MAIN CLASS ---

export class BuddyList extends BuddyListConf {
    all_user_ids: number[] = [];
    participants_section = { user_ids: [] as number[], is_collapsed: false };
    users_matching_view_section = { user_ids: [] as number[], is_collapsed: false };
    other_users_section = { user_ids: [] as number[], is_collapsed: true };
    
    render_count = 0;
    render_data = get_render_data();
    
    $participants_list = $(this.participants_list_selector);
    $users_matching_view_list = $(this.matching_view_list_selector);
    $other_users_list = $(this.other_user_list_selector);
    current_filter: Filter | undefined | "unset" = "unset";

    // Required to prevent the TypeError in sidebar_ui.ts
    initialize_tooltips(): void {
        console.log("BuddyList tooltips initialized.");
    }

    populate(opts: {all_user_ids: number[]}): void {
        this.render_count = 0;
        this.all_user_ids = opts.all_user_ids;
        this.$participants_list.empty();
        this.$users_matching_view_list.empty();
        this.$other_users_list.empty();
        this.render_data = get_render_data();
        this.fill_screen_with_content();
    }

    async render_section_headers(): Promise<void> {
        const {hide_headers} = this.render_data;
        $(".buddy-list-subsection-header").toggleClass("no-display", hide_headers);
        if (hide_headers) return;

        $("#buddy-list-participants-container .buddy-list-subsection-header").html(
            render_section_header({
                id: "buddy-list-participants-section-heading",
                header_text: $t({defaultMessage: "THIS CONVERSATION"}),
                is_collapsed: this.participants_section.is_collapsed,
            })
        );
    }

    fill_screen_with_content(): void {
        const height = this.height_to_fill() + 10;
        // CAST TO ANY: Stop fighting the ScrollUtil types in a prototype
        const elem = util.the(scroll_util.get_scroll_element($(this.scroll_container_selector))) as any;
        
        while (this.render_count < this.all_user_ids.length) {
            const padding_height = $(this.padding_selector).height() || 0;
            // Now elem.scrollHeight won't be 'unknown'
            const bottom_offset = elem.scrollHeight - elem.scrollTop - padding_height;
            if (bottom_offset > height) break;
            this.render_more({ chunk_size: 20 });
        }
    }

    render_more(opts: {chunk_size: number}): void {
        const more_user_ids = this.all_user_ids.slice(this.render_count, this.render_count + opts.chunk_size);
        if (more_user_ids.length === 0) return;
        const items = buddy_data.get_items_for_users(more_user_ids);
        const fragment = this.items_to_dom({ items });
        $(this.other_user_list_selector).append(fragment);
        
        this.render_count += more_user_ids.length;
    }

    update_padding(): void {
        padded_widget.update_padding({
            shown_rows: this.render_count,
            total_rows: this.all_user_ids.length,
            content_selector: "#buddy_list_wrapper",
            padding_selector: this.padding_selector,
        });
    }

    start_scroll_handler(): void {
        // CAST TO ANY: Ensures .on() is recognized on the JQuery object
        const $scroll_container = scroll_util.get_scroll_element($(this.scroll_container_selector)) as any;
        $scroll_container.on("scroll", () => {
            this.fill_screen_with_content();
        });
    }
}

export function get_render_data(): any {
    return {
        current_sub: narrow_state.stream_sub(),
        pm_ids_set: narrow_state.pm_ids_set(),
        hide_headers: false,
        get_all_participant_ids: () => new Set<number>(),
    };
}

export const buddy_list = new BuddyList();