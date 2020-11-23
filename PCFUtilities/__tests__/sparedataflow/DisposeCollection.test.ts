import assert = require("assert");

import {
    DisposeCollection
} from "./../../src/sparedataflow/DisposeCollection";

describe("DisposeCollection", () => {
    it("1. add", () => {
        const steps: string[] = [];
        var sut = new DisposeCollection();
        sut.add(() => {
            steps.push("1a");
            if (steps.length > 0) {
                throw new Error("1b");
            }
            steps.push("1c");
        });
        sut.add(() => {
            steps.push("2");
        });
        assert.deepStrictEqual(steps, []);
        sut.dispose();
        assert.deepStrictEqual(steps, ["1a", "2"]);
    });
})