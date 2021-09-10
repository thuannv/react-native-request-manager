import RequestQueue from './RequestQueue';

class RequestManager {
    static PRIORITY_HIGH = 'high';
    static PRIORITY_GENERAL = 'general';
    constructor() {
        this.queues = {
            [RequestManager.PRIORITY_HIGH]: new RequestQueue(3),
            [RequestManager.PRIORITY_GENERAL]: new RequestQueue(6),
        };
    }

    submit(request, priority) {
        return this.queues[priority].add(request);
    }

    stats() {
        let stats;
        console.group('RequestManager');

        stats = this.queues[RequestManager.PRIORITY_HIGH].stats();
        console.group('PriorityQueue');
        console.log(`Max slots: ${stats.maxSlots}`);
        console.log(`Running: ${stats.running}`);
        console.log(`Waiting: ${stats.waiting}`);
        console.log(`Success: ${stats.success}`);
        console.log(`Failure: ${stats.failure}`);
        console.groupEnd();

        stats = this.queues[RequestManager.PRIORITY_GENERAL].stats();
        console.group('GeneralQueue');
        console.log(`Max slots: ${stats.maxSlots}`);
        console.log(`Running: ${stats.running}`);
        console.log(`Waiting: ${stats.waiting}`);
        console.log(`Success: ${stats.success}`);
        console.log(`Failure: ${stats.failure}`);
        console.groupEnd();

        console.groupEnd();
    }
}

export default RequestManager;
