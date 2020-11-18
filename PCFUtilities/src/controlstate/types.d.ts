export type PCFState<IInputs, IOutputs>={
	notifyOutputChanged: (() => void) | null;
	state: ComponentFramework.Dictionary | null;
	container: HTMLDivElement | null;
    context: ComponentFramework.Context<IInputs> | null;
//    outputs:IOutputs;
}

export type UpdateContextCaller = "init" | "updateView1st" | "updateView" | "hotReload";
export type UpdateContextStateIncoming = {
    isInit: boolean;
    isUpdateView: boolean;
    isUpdateView1st: boolean;
    isReload: boolean;
    noUpdatedProperties: boolean;
    dctUpdatedProperties: UpdateContextUpdatedProperties;
};
export type UpdateContextStateDerived = UpdateContextStateIncoming & {
    updateView: boolean;
    layoutChanged: boolean;
    parametersChanged: boolean;
    entityIdChanged: boolean;
    datasetChanged: string[]
};
export type UpdateContextUpdatedProperties = { [updatedProperty: string]: boolean; };

export type ControlSize = {
    width?: number | undefined,
    height?: number | undefined
};
