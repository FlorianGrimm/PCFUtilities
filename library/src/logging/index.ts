import type { ILogggerTarget, ILoggerService, ILoggerFactory , ILogger } from "./types";
import { LogLevel } from './LogLevel'
import { LoggerService } from "./LoggerService";

const singletons = {

} as {
    loggerService?: LoggerService | undefined
};

function getLoggerService(configure?: (loggerService: ILoggerService) => void): ILoggerService {
    return (singletons.loggerService) || (singletons.loggerService = new LoggerService()).configure(configure);
}

function setLoggerService(value: ILoggerService): ILoggerService {
    return value;
}
export { ILogggerTarget, ILoggerService, ILoggerFactory , ILogger,  LogLevel, getLoggerService, setLoggerService };