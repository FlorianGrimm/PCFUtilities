import { HotRepositoryForUrl } from "./HotRepositoryForUrl";
import { HotReloadHostConstructor } from "./types";
import { HotControl } from "./HotControl";
import { getHotRepository } from "./HotRepository";
import type { ILogger } from "../logging";

export class HotRepositoryForType<IInputs = any, IOutputs = any> {
    hotRepositoryForUrl: HotRepositoryForUrl;
    exportName: string;
    type: HotReloadHostConstructor<IInputs, IOutputs>;
    usedWrappedType: HotReloadHostConstructor<IInputs, IOutputs>;
    wrappedType: HotReloadHostConstructor<IInputs, IOutputs>;
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
        this.wrappedType = this.generateHotReloadHostType(type);
        this.usedWrappedType = type;
    }

    update(nextType: HotReloadHostConstructor<IInputs, IOutputs>): HotReloadHostConstructor<IInputs, IOutputs> {
        if ((this.hotRepositoryForUrl.guardReloadBundle)
            || (this.type && nextType && this.version <= nextType.version)) {
            this.type = nextType;
            this.usedWrappedType = this.generateHotReloadHostType(nextType);
            this.usedWrappedType = nextType;
            this.version = nextType.version;
            return nextType;
        } else {
            return this.type;
        }
    }

    generateHotReloadHostType<IInputs, IOutputs>(
        type: HotReloadHostConstructor<IInputs, IOutputs>
    ) {
        const hotRepositoryForType: HotRepositoryForType = this;
        const logger = this.logger;
        const result = function () {
            const resultType = (hotRepositoryForType.type) || type;
            const that = new (resultType as any)();
            const hotControl = new HotControl(that, hotRepositoryForType, logger);
            getHotRepository().addHotControl(hotControl);
            return hotControl;
        } as any;
        Object.defineProperty(result, "name", { value: type.name });
        Object.defineProperty(result, "namespace", { value: type.namespace });
        Object.defineProperty(result, "version", { value: type.version });
        function __(this: object) { this.constructor = result; }
        __.prototype = type.prototype;
        result.prototype = new (__ as any)();

        return result as HotReloadHostConstructor<IInputs, IOutputs>;
    }

    getWrappedType(): HotReloadHostConstructor<IInputs, IOutputs> {
        if (this.usedWrappedType !== this.type || this.version !== this.type.version) {
            const wrappedType = this.generateHotReloadHostType(this.type);
            this.usedWrappedType = this.type;
            this.wrappedType = wrappedType;
            this.version = this.type.version
            return wrappedType;
        } else {
            return this.wrappedType;
        }
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
                return  hotRepositoryForType.getWrappedType();
            }
        });
    }
}