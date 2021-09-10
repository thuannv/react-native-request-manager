import { makeRequest, getRequestId } from './Request';

class RequestQueue {
    constructor(maxConcurrentRunningSlots) {
        this.success = 0;
        this.failure = 0;
        this.requests = [];
        this.running = [];
        this.maxConcurrentRunningSlots = maxConcurrentRunningSlots;
    }

    scheduleNext() {
        // console.log("scheduleNext()");
        const availSlots = this.maxConcurrentRunningSlots - this.running.length;
        if (availSlots > 0) {
            const executableRequestCount = Math.min(availSlots, this.requests.length);
            if (executableRequestCount > 0) {
                const nextExecuteRequests = [...this.requests.slice(0, executableRequestCount)];
                this.running = [...this.running, ...nextExecuteRequests];
                this.requests = [...this.requests.slice(executableRequestCount)];
                nextExecuteRequests.forEach(request => {
                    request.execute();
                });
            }
        }
    }

    removeFromRunning(requestId) {
        // console.log("Before remove:", this.running);
        this.running = this.running.filter(request => request.id !== requestId);
        // console.log("After remove:", this.running);
    }

    handleRequestResult(requestId, result, error) {
        if (error) {
            this.failure++;
        } else {
            this.success++;
        }
        // console.log("result", requestId, result, error);
        this.removeFromRunning(requestId);
        this.scheduleNext();
    }

    add({ url, method = 'GET', headers, body = null, timeout = 5000 }) {
        return new Promise((resolve, reject) => {
            const requestId = getRequestId();
            const request = makeRequest({
                requestId: requestId,
                url,
                method,
                headers,
                body,
                timeout,
                success: result => {
                    this.handleRequestResult(requestId, result);
                    resolve(result);
                },
                fail: e => {
                    this.handleRequestResult(requestId, undefined, e);
                    reject(e);
                },
            });

            this.requests.push(request);
            this.scheduleNext();
        });
    }

    stats() {
        return {
            maxSlots: this.maxConcurrentRunningSlots,
            running: this.running.length,
            waiting: this.requests.length,
            failure: this.failure,
            success: this.success,
        };
    }
}

export default RequestQueue;
