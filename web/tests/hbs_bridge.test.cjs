"use strict";

const assert = require("node:assert/strict");

const {JSDOM} = require("jsdom");

const {set_global, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");

const dom = new JSDOM(`<!DOCTYPE html>`);
set_global("document", dom.window.document);
// global.Node = dom.window.Node;

const hbs = zrequire("hbs_bridge");
const h = zrequire("html");

run_test("trusted_if_else_string", () => {
    function test(b, expected_val) {
        const spec = h.trusted_if_else_string({
            bool: h.bool_var({
                label: "some_bool",
                b: b,
            }),
            yes_val: h.trusted_simple_string("yes"),
            no_val: h.trusted_simple_string("no"),
        });
        assert.equal(spec.render_val(), expected_val);
        assert.equal(
            spec.to_source(),
            `{{#if some_bool}}yes{{else}}no{{/if}}`,
        );
    }
    test(true, "yes");
    test(false, "no");
});
