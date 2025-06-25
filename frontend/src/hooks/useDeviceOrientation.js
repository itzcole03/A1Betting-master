import { useState, useEffect } from 'react';
export const useDeviceOrientation = () => {
    const [state, setState] = useState({
        alpha: null,
        beta: null,
        gamma: null,
        absolute: null,
        error: null,
    });
    useEffect(() => {
        const handleOrientation = (event) => {
            setState({
                alpha: event.alpha,
                beta: event.beta,
                gamma: event.gamma,
                absolute: event.absolute,
                error: null,
            });
        };
        const handleError = (error) => {
            setState(prev => ({
                ...prev,
                error,
            }));
        };
        if (window.DeviceOrientationEvent) {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                // iOS 13+ requires permission
                DeviceOrientationEvent
                    .requestPermission()
                    .then((permissionState) => {
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                    }
                    else {
                        handleError(new Error('Permission to access device orientation was denied'));
                    }
                })
                    .catch(handleError);
            }
            else {
                // Non-iOS devices
                window.addEventListener('deviceorientation', handleOrientation);
            }
        }
        else {
            handleError(new Error('Device orientation not supported'));
        }
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);
    return state;
};
// Example usage:
// const { alpha, beta, gamma, absolute, error } = useDeviceOrientation();
//
// if (error) return <div>Error: {error.message}</div>;
//
// return (
//   <div>
//     <p>Alpha (z-axis rotation): {alpha}°</p>
//     <p>Beta (x-axis rotation): {beta}°</p>
//     <p>Gamma (y-axis rotation): {gamma}°</p>
//     <p>Absolute: {absolute ? 'Yes' : 'No'}</p>
//   </div>
// );
