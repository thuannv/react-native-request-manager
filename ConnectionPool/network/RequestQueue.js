import { makeRequest, getRequestId } from './Request';

class RequestQueue {
    constructor(maxConcurrentRunningSlots) {
        this.success = 0;
        this.failure = 0;
        this.requests = [];
        this.running = [];
        this.maxRetries = 3;
        this.maxConcurrentRunningSlots = maxConcurrentRunningSlots;
    }

    scheduleNext() {
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
        const request = this.running.find(item => item.id === requestId);
        // console.log('Remove from running', requestId, request);
        this.running = this.running.filter(request => request.id !== requestId);
        return request;
    }

    handleSucces(requestId, result) {
        this.success++;
        this.removeFromRunning(requestId);
        this.scheduleNext();
    }

    handleError(requestId, error) {
        this.failure++;
        let shouldReject = true;
        const request = this.removeFromRunning(requestId);
        if (error && error !== 'Abort request') {
            let { shouldRetry = false, retryCount = 0 } = request || {};
            if (shouldRetry && retryCount < this.maxRetries) {
                shouldReject = false;
                console.log(
                    `requestId: ${requestId} shouldRetry: ${shouldRetry} retryCount: ${retryCount}`
                );
                retryCount++;
                shouldRetry = shouldRetry && retryCount < this.maxRetries;
                request.shouldRetry = shouldRetry;
                request.retryCount = retryCount;
                this.requests.push(request);
            }
        }
        this.scheduleNext();
        return shouldReject;
    }

    add({ url, method = 'GET', headers, body = null, timeout = 5000, shouldRetry = false }) {
        return new Promise((resolve, reject) => {
            const requestId = getRequestId();
            const request = makeRequest({
                requestId: requestId,
                url,
                method,
                headers,
                body,
                timeout,
                shouldRetry,
                success: result => {
                    this.handleSucces(requestId, result);
                    resolve(result);
                },
                fail: e => {
                    const shouldRejectFailureRequest = this.handleError(requestId, e);
                    if (shouldRejectFailureRequest) {
                        reject(e);
                    }
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
