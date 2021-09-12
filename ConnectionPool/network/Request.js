const getRequestId = (function () {
    let id = 1;
    function next() {
        return id++;
    }
    return next;
})();

export function makeRequest({
    url,
    method = 'GET',
    headers,
    body = null,
    timeout = 5000,
    shouldRetry = false,
    success = (requestId, result) => {},
    fail = (requestId, error) => {},
}) {
    let cancel;
    let cancelled = new Promise(resolve => (cancel = resolve));

    const requestId = getRequestId();

    const isSuccess = req => req.status === 200;

    const setHeaders = (request, headers = {}) => {
        for (const header in headers) {
            request.setRequestHeader(header, headers[header]);
        }
    };

    function execute() {
        let request = new XMLHttpRequest();

        const timeoutHandler = e => {
            // console.log('======> timeout');
            fail(requestId, 'Request timeout');
        };

        const abortHandler = e => {
            fail(requestId, 'Abort request');
        };

        const errorHandler = e => {
            const error = new Error(`Cannot ${method} to ${url}`);
            if (request.status === 404 || request.status === 0) {
                error.code = request.status;
            }
            fail(requestId, error);
        };

        /*
        https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget/onload
        onload: this will be called when the request completes successfully
        */
        const loadHandler = e => {
            if (isSuccess(request)) {
                success(requestId, request.responseText);
            } else {
                onError();
            }
        };

        /*
        https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/onreadystatechange
        onreadystatechange: this may be called mutliple times during the request
        */
        const stateChangeHandler = e => {
            /*
            This callback is a little bit special, we can use it in some cases for handling some
            associate state in order to communicate with server base on readyState
             */
            if (request.readyState === 4) {
                // Completes successfully!
                // onLoad();
            }
        };

        cancelled.then(() => request.abort()).catch(e => {});

        try {
            request.open(method, url, true);
            setHeaders(request, headers);
            request.timeout = timeout;
            request.onreadystatechange = stateChangeHandler;
            request.onabort = abortHandler;
            request.ontimeout = timeoutHandler;
            request.onload = loadHandler;
            request.onerror = errorHandler;
            request.send(body);
        } catch (e) {
            fail(requestId, error);
        }
    }

    return {
        id: requestId,
        shouldRetry: shouldRetry,
        retryCount: 0,
        execute: execute,
        cancel: cancel,
    };
}
