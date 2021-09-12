import RequestManager from './RequestManager';
import EventEmitter from './EventEmitter';

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

    setInterval(() => manager.stats(), 1000);

    // setInterval(() => manager.cancelAllRequests(), 10000);

    // const eventEmitter = new EventEmitter();
    // eventEmitter.on('tick', value => {
    //     console.log('tick', value);
    // });
    // let cycle = 0;
    // let tick;
    // tick = setInterval(() => {
    //     eventEmitter.emit('tick', Date.now());
    //     cycle++;
    //     if (cycle > 10) {
    //         clearInterval(tick);
    //     }
    // }, 1000);

    // const listener1 = (...args) => console.log('Listener 1', ...args);
    // const listener2 = (...args) => console.log('Listener 2', ...args);

    // const emitter = new EventEmitter();
    // console.log(emitter);

    // emitter.on('tick', listener1);
    // emitter.on('tick', listener2);
    // emitter.emit('tick', 'tick', Date.now());

    // emitter.on('load', listener1);
    // emitter.on('load', listener2);
    // emitter.emit('load', 'load', 'Hello world!');

    // emitter.removeListener('tick', listener2);
    // emitter.emit('tick', 'tick', Date.now());

    // emitter.removeListener('load', listener1);
    // emitter.emit('load', 'load', 'Hello world!');

    // emitter.removeAllListener('tick');
    // emitter.removeAllListener('load');
    // console.log('remove all listeners');
    // console.log('emit tick');
    // emitter.emit('tick', 'tick', Date.now());
    // console.log('emit load');
    // emitter.emit('load', 'load', 'Hello world!');

    // console.log(emitter);
};
