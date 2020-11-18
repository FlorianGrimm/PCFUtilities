export interface HotReloadHost<IInputs, IOutputs> extends ComponentFramework.StandardControl<IInputs, IOutputs> {
    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     * @param hotReloadState the state from getHotReloadState
     */
    hotReload?<T = any>(context: ComponentFramework.Context<IInputs>, notifyOutputChanged?: () => void, state?: ComponentFramework.Dictionary, container?: HTMLDivElement, hotReloadState?: T): void;

    /**
     * Called before the control willbe destroyed and hotReload-ed.
     */
    getHotReloadState?<T = any>(): T;
}
export interface HotReloadHostConstructor<IInputs = any, IOutputs = any> {
    new(): HotReloadHost<IInputs, IOutputs>;
    namespace: string;
    name: string;
    version: number;
}
export type HotReloadHostConstructorDictionary = { [name: string]: HotReloadHostConstructor };