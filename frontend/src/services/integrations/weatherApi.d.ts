import { ApiBase } from './apiBase';
export declare class WeatherApi extends ApiBase {
    constructor();
    getWeather(params?: Record<string, any>): Promise<unknown>;
}
