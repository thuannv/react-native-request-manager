class EventEmitter {
    constructor() {
        this.eventRegistry = {};
    }

    on(eventName, eventListener) {
        if (eventName && eventListener) {
            let eventListeners = this.eventRegistry[eventName] || [];
            if (eventListeners.indexOf(eventListener) === -1) {
                eventListeners.push(eventListener);
            }
            this.eventRegistry[eventName] = eventListeners;
        }
    }

    emit(eventName, ...args) {
        if (eventName) {
            const eventListeners = this.eventRegistry[eventName] || [];
            eventListeners.forEach(listener => listener(...args));
        }
    }

    removeListener(eventName, listener) {
        if (eventName) {
            let eventListeners = this.eventRegistry[eventName] || [];
            eventListeners = eventListeners.filter(l => l !== listener);
            this.eventRegistry[eventName] = eventListeners;
        }
    }

    removeAllListener(eventName) {
        if (eventName) {
            this.eventRegistry[eventName] = [];
        }
    }
}

export default EventEmitter;
