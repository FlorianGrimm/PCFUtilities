import * as React from "react";
// import type { ITriggerEvent, MultiTriggerEvent } from "./shared/triggerEvent";
// import type { TriggerUpdateViewHost, TriggerUpdateViewProps } from './shared/triggerUpdateView';

import { DisposeCollection } from "PCFUtilities/sparedataflow";
import { wireTriggerUpdateView } from "PCFUtilities/controlstate/triggerUpdateView";

import type { State } from './types';
import GuidelinesControlViewLine from "./GuidelinesControlViewLine";

export type GuidelinesControlViewProps = {
    getState: (()=>State);
};

export type GuidelinesControlViewState = {
    tickUpdateView: number;
};

export default class GuidelinesControlView extends React.Component<GuidelinesControlViewProps, GuidelinesControlViewState> {
    tickUpdateView: number;
    disposables: DisposeCollection;
    constructor(props: GuidelinesControlViewProps) {
        super(props);
        this.tickUpdateView = 1;
        this.state = { tickUpdateView: 1 };
        this.disposables = new DisposeCollection();
        this.disposables.add(wireTriggerUpdateView(this, props));
    }

    render() {
        this.tickUpdateView = this.state.tickUpdateView;
        const {isAuthoringMode, inProps, resultProps, triggerUpdateView }=this.props.getState();
        const w=inProps.InW.value;
        const h=inProps.InH.value;
        triggerUpdateView.internalValue = false;
 
        if (isAuthoringMode.value /* harness  || true*/){
            return (
            <svg className="PCFUtilityGuidelines" width={w} height={h}>
                <GuidelinesControlViewLine x1={resultProps.X1.value} y1={0} x2={resultProps.X1.value} y2={h} offsetX={-4} offsetY={1*16} text="X1"></GuidelinesControlViewLine>
                <GuidelinesControlViewLine x1={resultProps.X2.value} y1={0} x2={resultProps.X2.value} y2={h} offsetX={-4} offsetY={2*16} text="X2"></GuidelinesControlViewLine>
                <GuidelinesControlViewLine x1={resultProps.X3.value} y1={0} x2={resultProps.X3.value} y2={h} offsetX={-4} offsetY={3*16} text="X3"></GuidelinesControlViewLine>
                <GuidelinesControlViewLine x1={resultProps.X4.value} y1={0} x2={resultProps.X4.value} y2={h} offsetX={-4} offsetY={4*16} text="X4"></GuidelinesControlViewLine>
                <GuidelinesControlViewLine x1={resultProps.X5.value} y1={0} x2={resultProps.X5.value} y2={h} offsetX={-4} offsetY={5*16} text="X5"></GuidelinesControlViewLine>
                <GuidelinesControlViewLine x1={0} y1={resultProps.Y1.value} x2={w} y2={resultProps.Y1.value} offsetX={2*16} offsetY={+4} text="Y1"></GuidelinesControlViewLine>
                <GuidelinesControlViewLine x1={0} y1={resultProps.Y2.value} x2={w} y2={resultProps.Y2.value} offsetX={3*16} offsetY={+4} text="Y2"></GuidelinesControlViewLine>
                <GuidelinesControlViewLine x1={0} y1={resultProps.Y3.value} x2={w} y2={resultProps.Y3.value} offsetX={4*16} offsetY={+4} text="Y3"></GuidelinesControlViewLine>
                <GuidelinesControlViewLine x1={0} y1={resultProps.Y4.value} x2={w} y2={resultProps.Y4.value} offsetX={5*16} offsetY={+4} text="Y4"></GuidelinesControlViewLine>
                <GuidelinesControlViewLine x1={0} y1={resultProps.Y5.value} x2={w} y2={resultProps.Y5.value} offsetX={6*16} offsetY={+4} text="Y5"></GuidelinesControlViewLine>

            </svg>);
        } else {
            return null;
        }
    }
    componentWillUnmount() {
        this.disposables.dispose();
    }
}