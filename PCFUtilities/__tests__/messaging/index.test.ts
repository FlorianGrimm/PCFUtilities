import assert = require("assert");

import type {
    IMessagingService, Message
} from '../../src/messaging';
import {
    createMessagingService
} from '../../src/messaging';
describe('messaging 1.', () => {
    it('1 sendMessage and NOT wait', async () => {
        const a = new CtrlA("a");
        const b = new CtrlA("b");
        const c = new CtrlA("c");
        a.init(null!);
        b.init(null!);
        c.init(null!);
        const p = a.messaging.sendMessage({ action: "a", sender:"a" });
        // NOT await p;
        assert(a.message === null);
        assert(b.message === null);
        assert(c.message === null);
    });

    it('2. sendMessage and wait', async () => {
        const a = new CtrlA("a");
        const b = new CtrlA("b");
        const c = new CtrlA("c");
        a.init(null!);
        b.init(null!);
        c.init(null!);
        const p = a.messaging.sendMessage({ action: "a", sender:"a" });
        if (typeof p.then === "function") { 
            await p; 
        }
        assert.deepStrictEqual(b.message, { action: "a", sender:"a" });
        assert.deepStrictEqual(c.message, { action: "a", sender:"a" });
    });

    it('3. sendMessage to receiver', async () => {
        const a = new CtrlA("a");
        const b = new CtrlA("b");
        const c = new CtrlA("c");
        a.init(null!);
        b.init(null!);
        c.init(null!);
        const p = a.messaging.sendMessage({ action: "a", sender:"a", receiver:"b" });
        if (typeof p.then === "function") { await p; }
        assert(a.message === null);
        assert.deepStrictEqual(b.message, { action: "a", sender:"a", receiver:"b" });
        assert(c.message === null);
    });
});
type IInputs = {};
type IOutputs = {};

class CtrlA implements ComponentFramework.StandardControl<IInputs, IOutputs>{
    readonly messaging: IMessagingService;
    constructor(public name:string) {
        this.messaging = createMessagingService({
            onReceiveMessage: this.onReceiveMessage
        });
        this.message = null;
    }

    message: Message | null;

    onReceiveMessage: ((message: Message) => void) | undefined = (message: Message) => {
        if ((message.receiver)?message.receiver===this.name:true){
            this.message = message;
        }
    };

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped
     * to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling
     * 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged?: () => void, state?: ComponentFramework.Dictionary, container?: HTMLDivElement): void {
        // const eventHub = getEventHub();
        // const eventEndpointSender = eventHub.registerSender(this, {
        //     name: this.name,
        //     messages: TestSenderA.MessagesSender,
        //     onLinkageChanged: () => { this.onConnect(); },
        //     onDisconnectSelf: () => { this.onDisconnect(); }
        // });
        // this.eventEndpointSender = eventEndpointSender;
        // eventEndpointSender.connect();
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width,
     * offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names
     * defined in the manifest, as well as utility functions
     */
    updateView(context: ComponentFramework.Context<IInputs>): void {
        //this.sendMessage(this.getMessageToSend());
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    destroy(): void {
        this.messaging.dispose();
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    getOutputs?(): IOutputs { return {}; }
}