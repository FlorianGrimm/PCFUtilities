import { keyLocalStoragePrefix } from "./consts";
import { HotRepositoryForType } from "./HotRepositoryForType";
import { HotReloadHostConstructor, HotReloadHostConstructorDictionary } from "./types";
import { getHotRepository } from "./HotRepository";
import { getOrAddByKey } from "./utils";
import type { ILogger } from "../logging";

export class HotRepositoryForUrl {
    reloadGuard: number;
    readonly url: string;
    readonly typesByExportName: Map<string, HotRepositoryForType>;
    socket: WebSocket | null;
    logger: ILogger;

    constructor(url: string, logger: ILogger) {
        this.reloadGuard = 0;
        this.typesByExportName = new Map();
        this.url = url;
        this.socket = null;
        this.logger = logger;
    }

    registerType<IInputs, IOutputs>(
        exportName: string,
        type: HotReloadHostConstructor<IInputs, IOutputs>
    ): [boolean, HotRepositoryForType<IInputs, IOutputs>] {
        const result = getOrAddByKey(
            this.typesByExportName,
            exportName,
            () => new HotRepositoryForType<IInputs, IOutputs>(this, exportName, type, this.logger),
            (en, instance) => instance.update(type)
        );
        return result;
    }

    enableHotReloadForTypes<Types extends HotReloadHostConstructorDictionary>(
        types: Types,
        moduleExports: Types
    ) {
        if (this.reloadGuard === 0) {
            this.logger.debug("enableHotReload within normal load.", this.url, Object.keys(types));
            if (this.url) {
                try {
                    const jsTxt = this.getFromLocalStorage();
                    this.evaluateBundleHotReload(jsTxt);
                } catch (error) {
                }
                this.fetchBundle()
                this.startWatch();
            }
        }
        for (const exportName in types) {
            if (Object.prototype.hasOwnProperty.call(types, exportName)) {
                const type = types[exportName];
                if (typeof type == "function" && type.prototype) {
                    const hotRepositoryForType = this.getByExportName(exportName);
                    if (hotRepositoryForType) {
                        hotRepositoryForType.setModuleExport(moduleExports, type);
                        continue;
                    }
                }
            }
        }
    }

    getFromLocalStorage(): string {
        try {
            const keyLocalStorage = `${keyLocalStoragePrefix}${this.url}`;
            const jsTxt = window.localStorage.getItem(keyLocalStorage);
            return jsTxt || "";
        } catch (error) {
            return "";
        }
    }

    guardReloadBundle(guard: number, block: number, action: () => void): boolean {
        if (this.reloadGuard === guard) {
            this.reloadGuard = block;
            try {
                action();
            } finally {
                this.reloadGuard = guard;
            }
            return true;
        } else {
            return false;
        }
    }

    getByExportName(name: string) {
        return this.typesByExportName.get(name);
    }

    startWatch() {
        let socket = this.socket;
        if (socket === null) {
            const r = /(?<protocol>https?\:)(?<url>\/\/[^:/]+)(?<port>(\:[0-9]+)?)/ig;
            //const r = /(?<protocol>https?\:)(?<url>\/\/127\.0\.0\.1)(?<port>(\:[0-9]+)?)/ig;
            const m = r.exec(this.url);
            const address = (m && m.groups)
                ? ((m.groups["protocol"] === "http:") ? "ws:" : "wss:") + m.groups["url"] + m.groups["port"] + "/ws"
                : "";
            if (address) {
                this.logger.debug("start socket", address)
                socket = this.socket = new WebSocket(address);
                socket.onmessage = (msg: MessageEvent) => {
                    if (msg.data == 'reload') {
                        this.fetchAndApply();
                    }
                };
                socket.onclose = (ev: CloseEvent) => {
                    this.socket = null;
                };
                socket.onerror = (ev: Event) => {
                    this.socket = null;
                    socket?.close();
                };
            }
        }
    }
    fetchAndApply() {
        getHotRepository().foreachHotControl((hotControl) => { 
            hotControl.notificationHotReload(this.url); 
        });
        this.fetchBundle().then((jsData) => {
            this.logger.debug('hot reload bundle fetched.');
            if (this.evaluateBundleHotReload(jsData)) {
                getHotRepository().foreachHotControl((hotControl) => {
                    hotControl.notificationHotReloaded(this.url);
                });
            }
        });
    }
    fetchBundle(): Promise<string> {
        return fetch(this.url, { mode: "cors", cache: "no-cache" })
            .then((response) => {
                if (response.status == 200) {
                    this.logger.debug(`Hot ${this.url} download OK Status:${response.status}`);
                    return response.text();
                } else {
                    this.logger.debug(`Hot ${this.url} download ?? Status:${response.status}`);
                    return "";
                }
            }, (reason) => {
                this.logger.debug(`Hot ${this.url} Error: ${reason}`);
                return "";
            }).then(data => {
                if (data) {
                    this.logger.debug(`Hot ${this.url} downloaded`);
                    const keyLocalStorage = `${keyLocalStoragePrefix}${this.url}`;
                    let oldData = "";
                    try {
                        oldData = window.localStorage.getItem(keyLocalStorage) || "";
                    } catch (error) {
                    }
                    if (oldData == data) {
                        return "";
                    } else {
                        window.localStorage.setItem(keyLocalStorage, data);
                        return data;
                    }
                } else {
                    this.logger.debug(`Hot ${this.url} downloaded no data.`);
                    return "";
                }
            });
    }
    evaluateBundleHotReload(jsData: string) {
        if (jsData) {
            this.guardReloadBundle(0, 1, () => {
                try {
                    this.logger.debug(`Hot reload ${this.url} evaluateBundleHotReload enter.`);
                    // the new bundle.js is evaluated now
                    this.typesByExportName.forEach((value)=>{
                        value.version=-1;
                    });
                    (new Function(jsData))();
                    this.logger.debug(`Hot reload ${this.url} evaluateBundleHotReload exit.`);
                } catch (error) {
                    this.logger.error(`Hot reload ${this.url} evaluateBundleHotReload error.`, error);
                    return;
                }
            });
            this.logger.info("evaluateBundleHotReload", true);
            return true;
        } else {
            this.logger.info("evaluateBundleHotReload", false);
            return false;
        }
    }
}