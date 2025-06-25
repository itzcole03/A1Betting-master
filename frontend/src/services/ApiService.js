import EventEmitter from 'eventemitter3';
export class BaseApiService extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.client = this.initializeClient();
    }
}
