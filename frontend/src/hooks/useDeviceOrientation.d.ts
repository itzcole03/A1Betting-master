interface DeviceOrientationState {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
    absolute: boolean | null;
    error: Error | null;
}
export declare const useDeviceOrientation: () => DeviceOrientationState;
export {};
