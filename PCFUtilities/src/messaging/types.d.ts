/*
postMessage(message: any, targetOrigin: string, transfer?: Transferable[]): void;
window.addEventListener("message",
"message": MessageEvent;
*/
import type {ILogger} from '../logging/types';

export type MessagingServiceOptions={
    targetOrigin: string;
    enableTransportPostMessage: boolean;
    enableTransportPromise: boolean;
    onVerify: ()=>boolean;
    onReceiveMessage: (message: Message)=>void | Promise<any>;
    window:Window|null;
    logger:ILogger;
}

export interface IMessagingService {
    sendMessage(message: Message):Promise<any>;
    dispose():void;
}

export type Message = {
    action: string;
    targetOrigin?: string;
    sender: string;
    receiver?: string;
}

export type MessageTyped<TPayload> = {
    action: string;
    targetOrigin?: string;
    sender: string;
    receiver?: string;
    payload: TPayload;
}
