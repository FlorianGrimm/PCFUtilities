import type { ITriggerEvent, Unsubscripe } from "./types";

function unsubscripeEmpty() { return unsubscripeEmpty; }

export class Unsubscripes {
    items: (Unsubscripe | ITriggerEvent)[];
    /**
     *
     */
    constructor() {
        this.items = [];
    }
    add(unsubscripe: (Unsubscripe | ITriggerEvent)): void {
        this.items.push(unsubscripe)
    }
    set addTo(unsubscripe: (Unsubscripe | ITriggerEvent)) {
        this.items.push(unsubscripe)
    }
    unsubscripe() {
        this.items.splice(0, this.items.length).forEach((u) => {
            if (typeof u === "function") {
                u();
            } else if (typeof u === "object" && typeof u.clear === "function") {
                u.clear();
            }
        });
    }
}