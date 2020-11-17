import { MessagingService } from "./MessagingService";
import type { IMessagingService, MessagingServiceOptions, Message, MessageTyped } from "./types";

function createMessagingService(options: Partial<MessagingServiceOptions>): IMessagingService {
    return new MessagingService(options);
}

export {
    IMessagingService,
    MessagingServiceOptions,
    Message, 
    MessageTyped,
    createMessagingService,
};