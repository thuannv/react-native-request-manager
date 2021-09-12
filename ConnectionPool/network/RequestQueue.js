import { makeRequest } from './Request';

function calculateRates(a, b) {
    return Math.round((100 * a) / b + Number.EPSILON) / 100;
}

class RequestQueue {
    constructor(maxConcurrentRequests) {
        this.success = 0;
        this.failure = 0;
        this.requests = [];
        this.running = [];
        this.maxRetries = 3;
        this.maxConcurrentRequests = maxConcurrentRequests;
    }

    add({ url, method = 'GET', headers, body = null, timeout = 5000, shouldRetry = false }) {
        return new Promise((resolve, reject) => {
            const request = makeRequest({
                url,
                method,
                headers,
                body,
                timeout,
                shouldRetry,
                success: (requestId, result) => {
                    this.handleSucces(requestId, result);
                    resolve(result);
                },
                fail: (requestId, error) => {
                    const shouldRejectFailureRequest = this.handleError(requestId, error);
                    if (shouldRejectFailureRequest) {
                        reject(error);
                    }
                },
            });
            this.requests.push(request);
            this.scheduleNext();
        });
    }

    cancelPendingRequests() {
        this.requests = [];
    }

    cancelRunningRequests() {
        this.running.forEach(request => request.cancel());
        this.running = [];
    }

    cancelAllRequests() {
        this.cancelRunningRequests();
        this.cancelPendingRequests();
    }

    getRequestRates() {
        return calculateRates(this.requests.length, this.maxConcurrentRequests);
    }

    stats() {
        return {
            maxSlots: this.maxConcurrentRequests,
            running: this.running.length,
            waiting: this.requests.length,
            failure: this.failure,
            success: this.success,
            requestRates: this.getRequestRates(),
        };
    }

    scheduleNext() {
        const availSlots = this.maxConcurrentRequests - this.running.length;
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
        /** request may be not found in running queue if we has already call cancel all requests */
        if (request) {
            // console.log(`removeFromRunning() => requestId=`, requestId, request);
            this.running = this.running.filter(request => request.id !== requestId);
        }
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
                // console.log(
                //     `requestId: ${requestId} shouldRetry: ${shouldRetry} retryCount: ${retryCount}`
                // );
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
}

export default RequestQueue;
