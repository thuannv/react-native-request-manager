import RequestManager from './RequestManager';

const base_url = 'http://192.168.1.31:3000';
const api = {
    PROFILE: `${base_url}/api/profile`,
    FOLLWERS: `${base_url}/api/followers`,
};

export default RunTest = () => {
    const manager = new RequestManager();

    setInterval(() => {
        manager
            .submit(
                {
                    method: 'GET',
                    url: api.PROFILE,
                    timeout: 5000,
                    shouldRetry: true,
                },
                RequestManager.PRIORITY_HIGH
            )
            // .then(res => console.log(res))
            .catch(e => {});
    }, 500);

    setInterval(() => {
        manager
            .submit(
                {
                    method: 'GET',
                    url: api.FOLLWERS,
                    timeout: 5000,
                    shouldRetry: true,
                },
                RequestManager.PRIORITY_GENERAL
            )
            // .then(res => console.log(res))
            .catch(e => {});
    }, 500);

    setInterval(() => manager.stats(), 5000);
};
