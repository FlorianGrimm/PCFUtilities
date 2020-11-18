import type { TriggerProperty, TriggerEvent } from '../../../PCFUtilities/src/sparedataflow';
import type { ControlSize } from '../../../PCFUtilities/src/controlstate/types'
import type { GetOutputsState } from './GetOutputsState';
/*
export type TriggerHost = {
	triggerOutputs: TriggerProperty<boolean>;
	triggerUpdateView: TriggerEvent;
	triggerUpdateSize: TriggerProperty<ControlSize>;
} & TriggerUpdateViewHost & TriggerUpdateControlSize
*/

export type State = {
	isAuthoringMode: TriggerProperty<boolean>;
	allocatedSize: TriggerProperty<ControlSize>;
	controlSize: TriggerProperty<ControlSize>;
	triggerOutputs: TriggerProperty<boolean>;
	triggerGetOutputs: TriggerProperty<GetOutputsState>;
	triggerUpdateView: TriggerProperty<boolean>;
	calcNeeded: TriggerProperty<boolean>;
	inProps: {
		InX: TriggerProperty<number>;
		InY: TriggerProperty<number>;
		InW: TriggerProperty<number>;
		InH: TriggerProperty<number>;
	};
	fxProps: {
		FxX1: TriggerProperty<string>;
		FxX2: TriggerProperty<string>;
		FxX3: TriggerProperty<string>;
		FxX4: TriggerProperty<string>;
		FxX5: TriggerProperty<string>;
		FxY1: TriggerProperty<string>;
		FxY2: TriggerProperty<string>;
		FxY3: TriggerProperty<string>;
		FxY4: TriggerProperty<string>;
		FxY5: TriggerProperty<string>;
	};
	resultProps: {
		X1: TriggerProperty<number>;
		X2: TriggerProperty<number>;
		X3: TriggerProperty<number>;
		X4: TriggerProperty<number>;
		X5: TriggerProperty<number>;
		Y1: TriggerProperty<number>;
		Y2: TriggerProperty<number>;
		Y3: TriggerProperty<number>;
		Y4: TriggerProperty<number>;
		Y5: TriggerProperty<number>;
		W1: TriggerProperty<number>;
		W2: TriggerProperty<number>;
		W3: TriggerProperty<number>;
		W4: TriggerProperty<number>;
		W5: TriggerProperty<number>;
		H1: TriggerProperty<number>;
		H2: TriggerProperty<number>;
		H3: TriggerProperty<number>;
		H4: TriggerProperty<number>;
		H5: TriggerProperty<number>;
	};
};