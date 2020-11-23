/*
postMessage(message: any, targetOrigin: string, transfer?: Transferable[]): void;
window.addEventListener("message",
"message": MessageEvent;
*/
import type {ILogger} from '../logging/types';

export type OnReceiveMessage<TMessage extends Message=Message>
    = (message: TMessage)=>void | Promise<any>;

export type MessagingServiceOptions={
    targetOrigin: string;
    enableTransportPostMessage: boolean;
    enableTransportPromise: boolean;
    onVerify: ()=>boolean;
    onReceiveMessage: OnReceiveMessage<any>;
    window:Window|null;
    logger:ILogger;
}

export interface IMessagingService {
    sendMessage<TMessage extends Message=Message>(message: TMessage):Promise<any>;
    dispose():void;
}

export type Message = {
    action: string;
    targetOrigin?: string;
    sender: string;
    receiver?: string;
}

export type MessageTyped<TAction extends string, TPayload> = Message & {
    action: TAction;
    targetOrigin?: string;
    sender: string;
    receiver?: string;
    payload: TPayload;
}
