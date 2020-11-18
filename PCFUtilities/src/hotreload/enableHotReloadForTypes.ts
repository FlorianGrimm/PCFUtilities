import { HotReloadHostConstructorDictionary } from "./types";
import { keyLocalStoragePrefix } from "./consts";
import { getHotRepository } from "./HotRepository";
import type { ILoggerService } from "../logging";

export function enableHotReloadForTypes<Types extends HotReloadHostConstructorDictionary>(
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
    
    const isEnabled = window.localStorage.getItem(keyEnabled) === "On";
    const url = (isEnabled) ? window.localStorage.getItem(keyUrl) : null;
    if (isEnabled && url) {
        if (!configure){
            configure = (loggerService: ILoggerService)=>{
                const keyLogger = `${keyLocalStoragePrefix}#${name}#Logger`;
                loggerService.setLogLevelFromString(name, window.localStorage.getItem(keyLogger));
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
