
export type CallbackHandler<E = any> = (evt: E, sender: any) => void | boolean;
export type Unsubscribe = (() => void);
export type Resume = () => void;

export interface IDisposable{
    dispose(): void;
}

export interface ITriggerEvent<E = any> extends IDisposable {
    subscribe(cbh: CallbackHandler<E>): Unsubscribe;
    unsubscribe(cbh: CallbackHandler<E>): void;
    trigger(sender: any, evt: E): void;
    pause(): Resume;
    block(action: () => void): void;
    dispose(): void;
}
