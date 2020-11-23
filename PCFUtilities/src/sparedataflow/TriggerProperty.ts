import type { ILogger } from "../logging";

import type { CallbackHandler, ITriggerEvent, Resume, Unsubscribe } from "./types";

function unsubscribeEmpty() { return; }

export class TriggerProperty<T = any> implements ITriggerEvent<T> {
    name: string;
    cbhs: CallbackHandler<T>[];
    hasChanged: boolean;
    isTriggerPending: boolean;
    isPaused: number;
    internalValue: T;
    isEqual: ((a: T, b: T) => (boolean | [boolean, T])) | null;
    logger: ILogger | null;

    constructor(name: string, value: T, isEqual?: ((a: T, b: T) => (boolean | [boolean, T])) | null | undefined, logger?: ILogger) {
        this.name = name;
        this.cbhs = [];
        this.hasChanged = false;
        this.isPaused = 0;
        this.isTriggerPending = false;
        this.internalValue = value;
        this.isEqual = isEqual || null;
        this.logger = logger || null;
    }

    get value(): T {
        return this.internalValue;
    }

    set value(v: T) {
        let isEq = false;
        if (this.isEqual === null) {
            isEq = (this.internalValue === v);
        } else {
            const e = this.isEqual(this.internalValue, v);
            if (typeof e === "boolean") {
                isEq = e;
            } else {
                [isEq, v] = e;
            }
        }
        if (isEq) {
            // this.logger?.info("set value same value", this.name, v);
            return;
        } else {
            const oldValue = this.internalValue;
            this.internalValue = v;
            this.hasChanged = true;
            this.isTriggerPending = true;

            if (this.isPaused === 0) {
                this.logger?.info("set new value trigger", this.name, "old:", oldValue, "new:", v);
                this.internalTrigger(this, v);
            } else {
                this.logger?.info("set new value paused", this.name, "old:", oldValue, "new:", v);
            }
        }
    }

    getNoMoreTriggeredValue(): T {
        this.isTriggerPending = false;
        return this.value;
    }
    getNoMoreChangedValue(): T {
        this.hasChanged = false;
        return this.value;
    }

    subscribe(cbh: CallbackHandler<T>): Unsubscribe {
        if (cbh) {
            this.cbhs.push(cbh);
            return () => { this.unsubscribe(cbh); }
        } else {
            return unsubscribeEmpty;
        }
    }

    unsubscribe(cbh: CallbackHandler<T>): void {
        const idx = this.cbhs.indexOf(cbh);
        this.cbhs.splice(idx, 1);
    }
    trigger(sender: any, v: T): void {
        let isEq = false;
        if (this.isEqual === null) {
            isEq = (this.internalValue === v);
        } else {
            const e = this.isEqual(this.internalValue, v);
            if (typeof e === "boolean") {
                isEq = e;
            } else {
                [isEq, v] = e;
            }
        }
        this.internalValue = v;
        if (!isEq) {
            this.hasChanged = true;
        }
        //
        this.internalTrigger(sender, v);
    }
    
    internalTrigger(sender: any, v: T): void {
        const cbhs = this.cbhs;
        if (cbhs.length > 0) {
            if (this.isPaused == 0) {
                for (let watchdog = 0; (watchdog === 0) || (this.isTriggerPending && watchdog < 10); watchdog++) {
                    if (watchdog === 9) {
                        throw new Error("endless triggers");
                    } else if (watchdog > 0) {
                        this.logger?.info("looping trigger", this.name);
                    }
                    this.isTriggerPending = false;
                    this.isPaused++;
                    try {
                        let idx = 0;
                        while (idx < cbhs.length) {
                            const cbh = cbhs[idx];
                            let result: void | boolean = false;
                            try {
                                result = cbh(v, sender);
                            } catch (error) {
                                this.logger?.error(error);
                                throw error;
                            }
                            if (result === true) {
                                cbhs.splice(idx, 1);
                            } else {
                                idx++;
                            }
                        }
                    } finally {
                        this.isPaused--;
                    }
                }
            } else {
                // paused
                this.isTriggerPending = true;
            }
        }
    }

    dispose() {
        if (0 < this.cbhs.length) {
            this.cbhs.splice(0, this.cbhs.length)
        }
    }

    pause(): Resume {
        this.isPaused++;
        return () => {
            this.isPaused--;
            if (this.isPaused == 0) {
                if (this.isTriggerPending) {
                    this.logger?.info("resume triggers", this.name);
                    this.internalTrigger(this, this.value);
                } else {
                    // this.logger?.info("resume silence", this.name);
                }
            }
        };
    }

    x():Resume{
        this.isPaused++;
        return () => {
            this.isPaused--;
            if (this.isPaused == 0) {
                if (this.isTriggerPending) {
                    this.logger?.info("resume triggers", this.name);
                    this.internalTrigger(this, this.value);
                } else {
                    // this.logger?.info("resume silence", this.name);
                }
            }
        };
    }

    block(action: () => void): void {
        const resume = this.pause();
        try {
            action();
        } finally {
            resume();
        }
    }
}