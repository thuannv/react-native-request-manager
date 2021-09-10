export const getRequestId = (function () {
    let id = 1;
    function next() {
        return id++;
    }
    return next;
})();

export function makeRequest({
    requestId,
    url,
    method = 'GET',
    headers,
    body = null,
    timeout = 5000,
    success = result => {},
    fail = error => {},
}) {
    let cancel;
    let cancelled = new Promise(resolve => (cancel = resolve));

    const isSuccess = req => req.status == 200;

    const setHeaders = (request, headers = {}) => {
        for (const header in headers) {
            request.setRequestHeader(header, headers[header]);
        }
    };

    function execute() {
        // console.log("execute request:", url);
        let request = new XMLHttpRequest();

        const onTimeout = e => {
            fail('Request timeout');
        };

        const onAbort = e => {
            fail('Abort request');
        };

        const onError = e => {
            const error = new Error(`Cannot ${method} to ${url}`);
            if (request.status === 404 || request.status === 0) {
                error.code = request.status;
            }
            fail(error);
        };

        const onLoad = e => {
            if (isSuccess(request)) {
                success(request.responseText);
            } else {
                onError();
            }
        };

        const onReadyStateChange = e => {
            if (request.readyState === 4) {
                onLoad();
            }
        };

        cancelled
            .then(() => {
                request.abort();
            })
            .catch(e => {});

        try {
            request.timeout = timeout;
            request.open(method, url);
            request.onreadystatechange = onReadyStateChange;
            setHeaders(headers);
            request.onabort = onAbort;
            request.ontimeout = onTimeout;
            request.onload = onLoad;
            request.onerror = onError;
            request.send(body);
        } catch (e) {
            fail(error);
        }
    }

    return {
        id: requestId,
        execute: execute,
        cancel: cancel,
    };
}
