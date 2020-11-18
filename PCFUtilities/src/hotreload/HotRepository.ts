import { HotControl } from "./HotControl";
import { HotRepositoryForUrl } from "./HotRepositoryForUrl";
import { HotReloadHostConstructorDictionary } from "./types";
import { getOrAddByKey } from "./utils";
import type { ILogger, ILoggerService } from "../logging";
import { getLoggerService } from "../logging";

export function getHotRepository(name?:string, configure?: (loggerService: ILoggerService) => void): HotRepository {
    const root = window as any;
    return (root._HotRepository as HotRepository) || (root._HotRepository = new HotRepository(name, configure));
}

export class HotRepository {
    readonly hotControls: HotControl[];
    readonly typesByUrl: Map<string, HotRepositoryForUrl>;
    logger:ILogger;

    constructor(loggerName?:string, configure?: (loggerService: ILoggerService) => void) {
        this.hotControls = [];
        this.typesByUrl = new Map();
        this.logger = (getLoggerService(configure)?.createLogger(loggerName ?? "PCFUtils")) || console;
    }

    registerTypes<Types extends HotReloadHostConstructorDictionary>(url: string, types: Types): HotRepositoryForUrl {
        const [created, result] = getOrAddByKey(
            this.typesByUrl,
            url,
            (u) => new HotRepositoryForUrl(url, this.logger));
        for (const name in types) {
            if (Object.prototype.hasOwnProperty.call(types, name)) {
                const type = types[name];
                if (typeof type == "function" && type.prototype) {
                    const activeType = result.registerType(name, type);
                }
            }
        }
        return result;
    }

    // main entry
    enableHotReloadForTypes<Types extends HotReloadHostConstructorDictionary>(
        url: string,
        types: Types,
        moduleExports: Types
    ) {
        try {
            this.logger.warn("enableHotReloadForTypes is activated:", url, types);
            const hotRepositoryForUrl = this.registerTypes(url, types);
            hotRepositoryForUrl.enableHotReloadForTypes(types, moduleExports);
        } catch (err) {
            this.logger.error("enableHotReload", err);
        }
    }

    getTypesByUrl(url: string): HotRepositoryForUrl | undefined {
        return this.typesByUrl.get(url);
    }

    addHotControl(hotControl: HotControl) {
        this.hotControls.push(hotControl);
        this.logger.debug("addHotControl", this.hotControls.length);
    }
    removeHotControl(hotControl: HotControl) {
        const idx = this.hotControls.indexOf(hotControl);
        if (0 <= idx) {
            this.hotControls.splice(idx, 1);
        }
        this.logger.debug("removeHotControl", this.hotControls.length);
    }
    foreachHotControl(action: ((hotControl: HotControl) => void)) {
        this.logger.debug("foreachHotControl.enter", this.hotControls.length);
        let idx = 0;
        while (idx < this.hotControls.length) {
            const hotControl = this.hotControls[idx];
            let remove = false;
            if (hotControl === null || hotControl === undefined || !hotControl.isValid()) {
                remove = true;
            } else {
                try {
                    action(hotControl);
                } catch (error) {
                    this.logger.error(error)
                }
            }
            if (remove) {
                this.hotControls.splice(idx, 1);
            } else {
                idx++;
            }
        }
        this.logger.debug("foreachHotControl.exiting", this.hotControls.length);
    }
}