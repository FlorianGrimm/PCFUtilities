import assert = require("assert");

import {
    ticksPerDay,
    ticksPerWeek,
    getWeekStartDate,
    getNextWeekStartDate
} from "./../../src/utilities/dateutilities";

describe("consts", () => {
    it("1. ticksPerDay", () => {        
        assert(ticksPerDay>0);
    });
    it("2. ticksPerWeek", () => {        
        assert(ticksPerWeek>0);
    });
    it("3. getWeekStartDate", () => {                
        assert.deepStrictEqual(getWeekStartDate(new Date("2000-01-10"), 1), new Date("2000-01-10"));  // monday
        assert.deepStrictEqual(getWeekStartDate(new Date("2000-01-09"), 1), new Date("2000-01-03"));  // sunday
        assert.deepStrictEqual(getWeekStartDate(new Date("2000-01-08"), 1), new Date("2000-01-03"));
        assert.deepStrictEqual(getWeekStartDate(new Date("2000-01-07"), 1), new Date("2000-01-03"));
        assert.deepStrictEqual(getWeekStartDate(new Date("2000-01-06"), 1), new Date("2000-01-03"));
        assert.deepStrictEqual(getWeekStartDate(new Date("2000-01-05"), 1), new Date("2000-01-03"));
        assert.deepStrictEqual(getWeekStartDate(new Date("2000-01-04"), 1), new Date("2000-01-03"));
        assert.deepStrictEqual(getWeekStartDate(new Date("2000-01-03"), 1), new Date("2000-01-03")); // monday
    });
    it("3. getNextWeekStartDate", () => {                
        assert.deepStrictEqual(getNextWeekStartDate(new Date("2000-01-10"), 1), new Date("2000-01-17"));  // monday
        assert.deepStrictEqual(getNextWeekStartDate(new Date("2000-01-09"), 1), new Date("2000-01-10"));  // sunday
        assert.deepStrictEqual(getNextWeekStartDate(new Date("2000-01-08"), 1), new Date("2000-01-10"));
        assert.deepStrictEqual(getNextWeekStartDate(new Date("2000-01-07"), 1), new Date("2000-01-10"));
        assert.deepStrictEqual(getNextWeekStartDate(new Date("2000-01-06"), 1), new Date("2000-01-10"));
        assert.deepStrictEqual(getNextWeekStartDate(new Date("2000-01-05"), 1), new Date("2000-01-10"));
        assert.deepStrictEqual(getNextWeekStartDate(new Date("2000-01-04"), 1), new Date("2000-01-10"));
        assert.deepStrictEqual(getNextWeekStartDate(new Date("2000-01-03"), 1), new Date("2000-01-10")); // monday
    });
    
})