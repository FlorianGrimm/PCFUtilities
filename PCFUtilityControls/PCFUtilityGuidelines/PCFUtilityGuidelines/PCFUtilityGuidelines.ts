/// <reference path="../../../PCFUtilities/src/controlstate/ComponentFramework.types.d.ts" />

import React = require("react");
import ReactDOM = require("react-dom");

import { initPCFState, transferParameters, updateContextInit } from "PCFUtilities/controlstate";
import { ControlSize, PCFState } from "PCFUtilities/controlstate/types";
import { getControlAllocatedSize, isEqualControlSize } from "PCFUtilities/controlstate/triggerSizeChanged";
import { TriggerProperty, DisposeCollection } from "PCFUtilities/sparedataflow";
import { getLoggerService, ILogger, LogLevel } from "PCFUtilities/logging";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import type {  State } from "./types";
import { GetOutputsState } from './GetOutputsState';
import GuidelinesControlView, { GuidelinesControlViewProps } from "./GuidelinesControlView";
import { calcFormula, parseFormula } from "./formula";

export class PCFUtilityGuidelines implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	static namespace = "PCFUtility";
	static version = 10006;
	pcfState: PCFState<IInputs, IOutputs>;
	state: State;
	disposables: DisposeCollection;
	logger: ILogger;

	/**
	 * Empty constructor.
	 */
	constructor() {
		getLoggerService().setLogLevel("PCFUtilityGuidelines", LogLevel.warn);
		this.logger = getLoggerService().createLogger("PCFUtilityGuidelines");
		this.pcfState = {
			notifyOutputChanged: null,
			state: null,
			container: null,
			context: null
		};
		this.disposables = new DisposeCollection();
		this.state = {
			isAuthoringMode: new TriggerProperty<boolean>("isAuthoringMode", false, undefined, this.logger),
			allocatedSize: new TriggerProperty<ControlSize>("controlSize", { width: undefined, height: undefined }, isEqualControlSize, this.logger),
			controlSize: new TriggerProperty<ControlSize>("controlSize", { width: undefined, height: undefined }, isEqualControlSize, this.logger),
			triggerOutputs: new TriggerProperty<boolean>("triggerOutputs", false, undefined, this.logger),
			triggerGetOutputs: new TriggerProperty<GetOutputsState>("triggerGetOutputs", GetOutputsState.Init, undefined, this.logger),
			triggerUpdateView: new TriggerProperty<boolean>("triggerUpdateView", false, undefined, this.logger),
			calcNeeded: new TriggerProperty<boolean>("calcNeeded", true, undefined, this.logger),
			inProps: {
				InX: new TriggerProperty<number>("InX", 0, undefined, this.logger),
				InY: new TriggerProperty<number>("InY", 0, undefined, this.logger),
				InW: new TriggerProperty<number>("InW", 0, undefined, this.logger),
				InH: new TriggerProperty<number>("InH", 0, undefined, this.logger),
			},
			fxProps: {
				FxX1: new TriggerProperty<string>("FxX1", "", undefined, this.logger),
				FxX2: new TriggerProperty<string>("FxX2", "", undefined, this.logger),
				FxX3: new TriggerProperty<string>("FxX3", "", undefined, this.logger),
				FxX4: new TriggerProperty<string>("FxX4", "", undefined, this.logger),
				FxX5: new TriggerProperty<string>("FxX5", "", undefined, this.logger),
				FxY1: new TriggerProperty<string>("FxY1", "", undefined, this.logger),
				FxY2: new TriggerProperty<string>("FxY2", "", undefined, this.logger),
				FxY3: new TriggerProperty<string>("FxY3", "", undefined, this.logger),
				FxY4: new TriggerProperty<string>("FxY4", "", undefined, this.logger),
				FxY5: new TriggerProperty<string>("FxY5", "", undefined, this.logger),
			},
			resultProps: {
				X1: new TriggerProperty<number>("X1", 0, undefined, this.logger),
				X2: new TriggerProperty<number>("X2", 0, undefined, this.logger),
				X3: new TriggerProperty<number>("X3", 0, undefined, this.logger),
				X4: new TriggerProperty<number>("X4", 0, undefined, this.logger),
				X5: new TriggerProperty<number>("X5", 0, undefined, this.logger),
				Y1: new TriggerProperty<number>("Y1", 0, undefined, this.logger),
				Y2: new TriggerProperty<number>("Y2", 0, undefined, this.logger),
				Y3: new TriggerProperty<number>("Y3", 0, undefined, this.logger),
				Y4: new TriggerProperty<number>("Y4", 0, undefined, this.logger),
				Y5: new TriggerProperty<number>("Y5", 0, undefined, this.logger),
				W1: new TriggerProperty<number>("W1", 0, undefined, this.logger),
				W2: new TriggerProperty<number>("W2", 0, undefined, this.logger),
				W3: new TriggerProperty<number>("W3", 0, undefined, this.logger),
				W4: new TriggerProperty<number>("W4", 0, undefined, this.logger),
				W5: new TriggerProperty<number>("W5", 0, undefined, this.logger),
				H1: new TriggerProperty<number>("H1", 0, undefined, this.logger),
				H2: new TriggerProperty<number>("H2", 0, undefined, this.logger),
				H3: new TriggerProperty<number>("H3", 0, undefined, this.logger),
				H4: new TriggerProperty<number>("H4", 0, undefined, this.logger),
				H5: new TriggerProperty<number>("H5", 0, undefined, this.logger),
			}
		};

		// update the view
		const setUpdateView = (evt: any, sender: any) => {
			this.logger.info("setUpdateView", evt, sender.name)
			this.state.triggerUpdateView.value = true;
		};

		// isAuthoringMode changes the view
		this.disposables.add(
			this.state.isAuthoringMode
				.subscribe(setUpdateView));

		// // controlSize changes the view
		// this.unsubscripes.add(
		// 	this.state.controlSize
		// 		.subscripe(setUpdateView));

		// recalc
		const setCalcNeeded = (evt: any, sender: any) => {
			this.logger.info("setCalcNeeded", evt, sender.name)
			this.state.calcNeeded.value = true;
		};
		[
			this.state.controlSize,
			this.state.inProps.InX, this.state.inProps.InY, this.state.inProps.InW, this.state.inProps.InH,
			this.state.fxProps.FxX1, this.state.fxProps.FxX2, this.state.fxProps.FxX3, this.state.fxProps.FxX4, this.state.fxProps.FxX5,
			this.state.fxProps.FxY1, this.state.fxProps.FxY2, this.state.fxProps.FxY3, this.state.fxProps.FxY4, this.state.fxProps.FxY5
		].forEach((tp) => {
			this.disposables.add(tp.subscribe(setCalcNeeded));
		});

		const setUpdateOutput = (evt: any, sender: any) => {
			this.logger.info("setUpdateOutput", evt, sender.name)
			this.state.triggerUpdateView.value = true;
			this.state.triggerOutputs.value = true;
		}
		[
			this.state.resultProps.X1, this.state.resultProps.W1, this.state.resultProps.Y1, this.state.resultProps.H1,
			this.state.resultProps.X2, this.state.resultProps.W2, this.state.resultProps.Y2, this.state.resultProps.H2,
			this.state.resultProps.X3, this.state.resultProps.W3, this.state.resultProps.Y3, this.state.resultProps.H3,
			this.state.resultProps.X4, this.state.resultProps.W4, this.state.resultProps.Y4, this.state.resultProps.H4,
			this.state.resultProps.X5, this.state.resultProps.W5, this.state.resultProps.Y5, this.state.resultProps.H5,
		].forEach((tp) => {
			this.disposables.add(tp.subscribe(setUpdateOutput));
		});
		this.disposables.add(
			this.state.triggerOutputs.subscribe(() => {
				if (this.state.triggerOutputs.value) {
					if (this.state.triggerGetOutputs.value == GetOutputsState.Silent){
						this.state.triggerGetOutputs.value = GetOutputsState.Trigger;
					}
				}
			}));
		this.disposables.add(
			this.state.triggerGetOutputs.subscribe((value:GetOutputsState)=>{
				if (this.state.triggerGetOutputs.value == GetOutputsState.Silent){
					this.state.triggerOutputs.value=false;
					return;
				}
				if (this.state.triggerGetOutputs.value == GetOutputsState.Trigger){
					if (this.pcfState.notifyOutputChanged) {
						this.logger.info("notifyOutputChanged()");
						this.pcfState.notifyOutputChanged();
					}
					return;
				}
			}));
	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		this.logger.debug("init()", context.updatedProperties);
		context?.mode?.trackContainerResize(true);
		initPCFState(this.pcfState, notifyOutputChanged, state, container);
		this.updateContext(context, "init");
		this.startReact();
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		this.logger.debug("updateView()", context.updatedProperties);
		if (this.state.triggerGetOutputs.value == GetOutputsState.Init){
			this.state.triggerGetOutputs.value = GetOutputsState.Silent;
			this.updateContext(context, "updateView1st");
		} else if (this.state.triggerGetOutputs.value == GetOutputsState.GetOutouts){
			this.logger.info("skip updateContext");
			this.state.triggerGetOutputs.value = GetOutputsState.Silent;
		} else {
			this.updateContext(context, "updateView");
		}
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		this.state.triggerGetOutputs.value = GetOutputsState.GetOutouts;
		const result = {};
		const resultProps = this.state.resultProps;
		for (const name in resultProps) {
			if (Object.prototype.hasOwnProperty.call(resultProps, name)) {
				(result as any)[name] = ((resultProps as any)[name] as TriggerProperty<number>).value as number;
			}
		}		
		this.logger.debug("getOutputs", result);
		return result;
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		this.disposables.dispose();
		const container = this.pcfState.container;
		if (container) {
			this.pcfState.container = null;
			ReactDOM.unmountComponentAtNode(container);
		}
	}

	startReact() {
		const container = this.pcfState.container;
		if (container) {
			const props: GuidelinesControlViewProps = {
				getState: () => this.state,
			};
			ReactDOM.render(React.createElement(GuidelinesControlView, props), container);
		}
	}

	updateContext(context: ComponentFramework.Context<IInputs>, mode: "init" | "updateView1st" | "updateView" | "hotReload") {
		this.logger.info("updateContext", mode, context.updatedProperties);
		this.pcfState.context = context;
		const resumes = [
			this.state.triggerUpdateView.pause(),
			this.state.triggerOutputs.pause(),
		];
		try {
			const state = this.state;
			const ucs = updateContextInit(context, mode, {});

			this.logger.info("updateContextInit ucs:", ucs, mode);
			if (ucs.isInit || ucs.isReload) {
				context.mode.trackContainerResize(true);
			}
			state.isAuthoringMode.value = (context.mode.isAuthoringMode ?? true);
			state.allocatedSize.value = getControlAllocatedSize(context);

			if (ucs.isInit || ucs.isReload || ucs.parametersChanged || ucs.layoutChanged || ucs.noUpdatedProperties) {
				transferParameters(null, context.parameters, this.state.inProps);
				transferParameters(null, context.parameters, this.state.fxProps);
				//transferParameters(null, context.parameters, this.state.resultProps, (c, s) => { s.internalValue = c.raw; });

				//transferParameters(["InH", "InW", "InX", "InY"], context.parameters, this.state.inProps);
				//transferParameters(["FxX1","FxX2","FxX3","FxX4","FxX5","FxY1","FxY2","FxY3","FxY4","FxY5"], context.parameters, this.state.fxProps);
				//transferParameters(["X1","X2","X3","X4","X5","Y1","Y2","Y3","Y4","Y5","W1","W2","W3","W4","W5","H1","H2","H3","H4","H5"], context.parameters, this.state.resultProps);
			}
			const inProps = state.inProps;
			if (ucs.isInit
				|| ucs.isReload
				|| state.allocatedSize.hasChanged
				|| inProps.InW.hasChanged
				|| inProps.InH.hasChanged
			) {
				const w = inProps.InW.getNoMoreTriggeredValue();
				const h = inProps.InH.getNoMoreTriggeredValue();
				const inSize: ControlSize = {
					width: (w > 0) ? w : undefined,
					height: (h > 0) ? h : undefined
				};
				const allocatedSize = state.allocatedSize.getNoMoreTriggeredValue();
				this.state.controlSize.value = {
					width: ((inSize.width && inSize.width > 0) ? inSize.width : allocatedSize.width) || 0,
					height: ((inSize.height && inSize.height > 0) ? inSize.height : allocatedSize.height) || 0
				};
			}

			if (this.state.calcNeeded.value) {
				this.state.calcNeeded.internalValue = false;
				const controlSize = this.state.controlSize.value;
				const boundsXW = {
					offset: this.state.inProps.InX.value || 0,
					size: controlSize.width || 0,
				};
				const boundsYH = {
					offset: this.state.inProps.InY.value || 0,
					size: controlSize.height || 0,
				}
				this.logger.debug("boundsXW", boundsXW);
				this.logger.debug("boundsYH", boundsYH);
				const screenBreaks = [1200, 1800, 2400]; // todo how to get the real numbers
				const mode = (boundsXW.size < screenBreaks[0]) ? 0
					: (boundsXW.size < screenBreaks[1]) ? 1
						: (boundsXW.size < screenBreaks[2]) ? 2
							: 3;
				this.state.resultProps.X1.value = calcFormula(parseFormula(this.state.fxProps.FxX1.value), mode, boundsXW);
				this.state.resultProps.X2.value = calcFormula(parseFormula(this.state.fxProps.FxX2.value), mode, boundsXW);
				this.state.resultProps.X3.value = calcFormula(parseFormula(this.state.fxProps.FxX3.value), mode, boundsXW);
				this.state.resultProps.X4.value = calcFormula(parseFormula(this.state.fxProps.FxX4.value), mode, boundsXW);
				this.state.resultProps.X5.value = calcFormula(parseFormula(this.state.fxProps.FxX5.value), mode, boundsXW);

				this.state.resultProps.W1.value = this.state.resultProps.X2.value - this.state.resultProps.X1.value;
				this.state.resultProps.W2.value = this.state.resultProps.X3.value - this.state.resultProps.X2.value;
				this.state.resultProps.W3.value = this.state.resultProps.X4.value - this.state.resultProps.X3.value;
				this.state.resultProps.W4.value = this.state.resultProps.X5.value - this.state.resultProps.X4.value;
				this.state.resultProps.W5.value = (boundsXW.offset + boundsXW.size) - this.state.resultProps.X5.value;

				this.state.resultProps.Y1.value = calcFormula(parseFormula(this.state.fxProps.FxY1.value), mode, boundsYH);
				this.state.resultProps.Y2.value = calcFormula(parseFormula(this.state.fxProps.FxY2.value), mode, boundsYH);
				this.state.resultProps.Y3.value = calcFormula(parseFormula(this.state.fxProps.FxY3.value), mode, boundsYH);
				this.state.resultProps.Y4.value = calcFormula(parseFormula(this.state.fxProps.FxY4.value), mode, boundsYH);
				this.state.resultProps.Y5.value = calcFormula(parseFormula(this.state.fxProps.FxY5.value), mode, boundsYH);

				this.state.resultProps.H1.value = this.state.resultProps.Y2.value - this.state.resultProps.Y1.value;
				this.state.resultProps.H2.value = this.state.resultProps.Y3.value - this.state.resultProps.Y2.value;
				this.state.resultProps.H3.value = this.state.resultProps.Y4.value - this.state.resultProps.Y3.value;
				this.state.resultProps.H4.value = this.state.resultProps.Y5.value - this.state.resultProps.Y4.value;
				this.state.resultProps.H5.value = (boundsYH.offset + boundsYH.size) - this.state.resultProps.Y5.value;

				this.logger.debug("x", this.state.resultProps.X1.value, this.state.resultProps.X2.value, this.state.resultProps.X3.value, this.state.resultProps.X4.value, this.state.resultProps.X5.value);
				this.logger.debug("w", this.state.resultProps.W1.value, this.state.resultProps.W2.value, this.state.resultProps.W3.value, this.state.resultProps.W4.value, this.state.resultProps.W5.value);
				this.logger.debug("y", this.state.resultProps.Y1.value, this.state.resultProps.Y2.value, this.state.resultProps.Y3.value, this.state.resultProps.Y4.value, this.state.resultProps.Y5.value);
				this.logger.debug("h", this.state.resultProps.H1.value, this.state.resultProps.H2.value, this.state.resultProps.H3.value, this.state.resultProps.H4.value, this.state.resultProps.H5.value);
			}
		} finally {
			resumes.forEach((r) => r());
		}
	}


	getHotReloadState?(): any {
		return {};
	}

	public hotReload(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement, hotReloadState?: any) {
		console.warn("version", PCFUtilityGuidelines.version);
		
		this.pcfState.notifyOutputChanged = notifyOutputChanged;
		this.pcfState.state = state;
		this.pcfState.container = container;
		this.updateContext(context, "hotReload");
		this.startReact();
	}

}