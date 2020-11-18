import { HotReloadHostConstructorDictionary } from "./types";
import { keyLocalStoragePrefix } from "./consts";
import { getHotRepository } from "./HotRepository";
import { ILoggerService, LogLevel } from "../logging";

export function enableHotReloadForTypes<Types extends HotReloadHostConstructorDictionary>(
    isHotReloadAllowed: boolean,
    name: string,
    types: Types,
    moduleExports: any,
    configure?: (loggerService: ILoggerService) => void
) {
    const keyEnabled = `${keyLocalStoragePrefix}#${name}#enabled`;
    const keyUrl = `${keyLocalStoragePrefix}#${name}#Url`;
    /*
    console.log("Keys", keyEnabled, keyUrl);
    window.localStorage.setItem("HotReload#GuidelinesControl#enabled", "On");
    window.localStorage.setItem("HotReload#GuidelinesControl#Url", "http://127.0.0.1:8181/bundle.js");
    */
    
    const isEnabled = (isHotReloadAllowed) ? (window.localStorage.getItem(keyEnabled) === "On") : false;
    const url = (isEnabled) ? window.localStorage.getItem(keyUrl) : null;
        
    if (isEnabled){
        console.info("hotreload config", "keyEnabled", keyEnabled , isEnabled, "keyUrl", keyUrl , url);
    }
    if (isEnabled && url) {
        if (!configure){
            configure = (loggerService: ILoggerService)=>{
                const keyLogger = `${keyLocalStoragePrefix}#${name}#Logger`;
                const logLevel = window.localStorage.getItem(keyLogger);
                loggerService.setLogLevelFromString(name, logLevel ?? LogLevel.debug);
            }
        } 
        getHotRepository(name, configure).enableHotReloadForTypes(url, types, moduleExports);
    } else {
        Object.defineProperty(moduleExports, "__esModule", { value: true });
        for (const key in types) {
            Object.defineProperty(moduleExports, key, { enumerable: true, value: (types as any)[key] });
        }
    }
}
