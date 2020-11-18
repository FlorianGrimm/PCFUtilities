import assert = require("assert");

import type {
    ILoggerService
} from '../../src/logging';
import {
    LogLevel,
    getLoggerService, setLoggerService
} from '../../src/logging';

describe('logging 1. index', () => {
    it('setLoggerService', () => {
        setLoggerService(undefined!);

        getLoggerService((loggerService: ILoggerService) => {
            loggerService.setLogLevel("a", LogLevel.warn);
            assert.strictEqual(loggerService.getLogLevel("a", LogLevel.debug), LogLevel.warn);
        });
    });
});
