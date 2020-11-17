import type { LogLevel } from "./LogLevel";

export type ILogggerTarget = {
    log(level: LogLevel, source: string, message?: any, ...optionalParams: any[]);
}

export type ILoggerFactory = {
    createLogger(source: string): ILogger;
}

export interface ILoggerService {
    loggerConfiguration: Map<string, LogLevel>;
    targets: ILogggerTarget[];

    log(level: LogLevel, source: string, message?: any, ...optionalParams: any[]);
    createLogger(source: string): ILogger;
    getLogLevel(source: string, fallback: LogLevel): LogLevel;
    setLogLevel(source: string, level: LogLevel): void;
}

export type ILogger = {
    debug(message?: any, ...optionalParams: any[]): void;

    info(message?: any, ...optionalParams: any[]): void;

    warn(message?: any, ...optionalParams: any[]): void;

    error(message?: any, ...optionalParams: any[]): void;

    createLogger?(source: string): ILogger;
}