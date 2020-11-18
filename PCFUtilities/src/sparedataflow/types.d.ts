
export type CallbackHandler<E = any> = (evt: E, sender: any) => void | boolean;
export type Unsubscripe = (() => void);
export type Resume = () => void;

export interface ITriggerEvent<E = any> {
    subscripe(cbh: CallbackHandler<E>): Unsubscripe;
    unsubscripe(cbh: CallbackHandler<E>): void;
    trigger(sender: any, evt: E): void;
    clear(): void;
    pause(): Resume;
    block(action: () => void): void;
}
