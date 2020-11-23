import assert = require("assert");

import {
    TriggerProperty    
} from "./../../src/sparedataflow/TriggerProperty";

describe("TriggerProperty", () => {
    it("1. subscribe", () => {
        const sut1a = new TriggerProperty<string>("sut1a", "", undefined, undefined);
        const sut1b = new TriggerProperty<string>("sut1b", "", undefined, undefined);
        const u = sut1a.subscribe((value) => {
            sut1b.value = value + "2";
        });
        sut1a.value = "4";
        assert(sut1b.value === "42");
        u();
    });
})