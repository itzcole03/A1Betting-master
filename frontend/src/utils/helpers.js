// betaTest4/src/utils/helpers.ts
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
export const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
// Add other generic helper functions as needed 
