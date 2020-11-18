import { HotRepositoryForUrl } from "./HotRepositoryForUrl";
import { HotReloadHostConstructor } from "./types";
import { HotControl } from "./HotControl";
import { getHotRepository } from "./HotRepository";
import type { ILogger } from "../logging";

export class HotRepositoryForType<IInputs = any, IOutputs = any> {
    hotRepositoryForUrl: HotRepositoryForUrl;
    exportName: string;
    type: HotReloadHostConstructor<IInputs, IOutputs>;
    hostControlType: HotReloadHostConstructor<IInputs, IOutputs>;
    name: string;
    namespace: string;
    version: number;
    logger:ILogger;

    constructor(
        hotRepositoryForUrl: HotRepositoryForUrl,
        exportName: string,
        type: HotReloadHostConstructor<IInputs, IOutputs>,
        logger:ILogger) {
        this.hotRepositoryForUrl = hotRepositoryForUrl;
        this.exportName = exportName;
        this.type = type;
        this.name = type.name;
        this.namespace = type.namespace || "";
        this.version = type.version || 0;
        this.logger= logger;
        this.hostControlType = this.generateHotControlForType(type);
    }

    update(nextType: HotReloadHostConstructor<IInputs, IOutputs>): HotReloadHostConstructor<IInputs, IOutputs> {
        if ((this.hotRepositoryForUrl.reloadGuard === 1 && nextType)
            || (this.type && nextType && this.version < nextType.version)) {

            this.type = nextType;
            this.hostControlType = this.generateHotControlForType(nextType);
            this.version = nextType.version;
            return nextType;
        } else {
            return this.type;
        }
    }

    generateHotControlForType<IInputs, IOutputs>(
        type: HotReloadHostConstructor<IInputs, IOutputs>
    ) {
        const hotRepositoryForType: HotRepositoryForType = this;
        const logger = this.logger;
        const result = function (this:any) {
            const resultType = (hotRepositoryForType.type) || type;
            const that = new (resultType as any)();
            const hotControl = (HotControl as any).apply(this, [that, hotRepositoryForType, logger]) || this;            
            getHotRepository().addHotControl(hotControl);
            return hotControl;
        } as any;
        Object.defineProperty(result, "name", { value: type.name });
        Object.defineProperty(result, "namespace", { value: type.namespace });
        Object.defineProperty(result, "version", { value: type.version });
        function __(this: object) { this.constructor = result; }
        //__.prototype = type.prototype;
        __.prototype = HotControl.prototype;
        result.prototype = new (__ as any)();

        return result as HotReloadHostConstructor<IInputs, IOutputs>;
    }

    setModuleExport<IInputs, IOutputs>(
        moduleExports: object,
        type: HotReloadHostConstructor<IInputs, IOutputs>
    ) {
        //const c = this.generateHotReloadHostType(type);
        const hotRepositoryForType: HotRepositoryForType = this;
        Object.defineProperty(moduleExports, this.exportName, {
            enumerable: true,
            get: function get() {
                return  hotRepositoryForType.hostControlType;
            }
        });
    }
}