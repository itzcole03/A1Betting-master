import '@testing-library/jest-dom';
import { jest, beforeAll, afterAll } from '@jest/globals';
// Mock WebSocket
class MockWebSocket {
    constructor(url) {
        this.binaryType = 'blob';
        this.bufferedAmount = 0;
        this.extensions = '';
        this.protocol = '';
        this.readyState = MockWebSocket.CONNECTING;
        this.onopen = null;
        this.onclose = null;
        this.onmessage = null;
        this.onerror = null;
        this.url = url;
        MockWebSocket.instances.push(this);
    }
    send(_data) {
        // Mock send implementation
    }
    close(code, reason) {
        this.readyState = MockWebSocket.CLOSED;
        if (this.onclose) {
            this.onclose(new CloseEvent('close', { code, reason }));
        }
    }
    // Helper methods for testing
    static clearInstances() {
        MockWebSocket.instances = [];
    }
    static getLastInstance() {
        return MockWebSocket.instances[MockWebSocket.instances.length - 1];
    }
    // Simulate connection
    simulateOpen() {
        this.readyState = MockWebSocket.OPEN;
        if (this.onopen) {
            this.onopen(new Event('open'));
        }
    }
    // Simulate message
    simulateMessage(data) {
        if (this.onmessage) {
            const messageEvent = new MessageEvent('message', {
                data: JSON.stringify(data),
            });
            this.onmessage(messageEvent);
        }
    }
    // Simulate error
    simulateError() {
        if (this.onerror) {
            this.onerror(new Event('error'));
        }
    }
    // Required WebSocket interface methods
    addEventListener(_type, _listener, _options) { }
    removeEventListener(_type, _listener, _options) { }
    dispatchEvent(_event) {
        return true;
    }
}
MockWebSocket.instances = [];
MockWebSocket.CONNECTING = 0;
MockWebSocket.OPEN = 1;
MockWebSocket.CLOSING = 2;
MockWebSocket.CLOSED = 3;
// Replace global WebSocket with mock
global.WebSocket = MockWebSocket;
// Mock fetch
const mockFetch = jest.fn().mockImplementation((_input, _init) => {
    return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
        status: 200,
        statusText: 'OK',
    });
});
global.fetch = mockFetch;
// Mock IntersectionObserver
class MockIntersectionObserver {
    constructor(_callback, _options) {
        this.observe = jest.fn();
        this.unobserve = jest.fn();
        this.disconnect = jest.fn();
    }
}
global.IntersectionObserver = MockIntersectionObserver;
// Mock ResizeObserver
class MockResizeObserver {
    constructor(_callback) {
        this.observe = jest.fn();
        this.unobserve = jest.fn();
        this.disconnect = jest.fn();
    }
}
global.ResizeObserver = MockResizeObserver;
// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});
// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
// Mock sessionStorage
const sessionStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });
// Mock window.location
const originalLocation = window.location;
delete window.location;
window.location = {
    ...originalLocation,
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
};
// Mock window.history
const originalHistory = window.history;
delete window.history;
window.history = {
    ...originalHistory,
    pushState: jest.fn(),
    replaceState: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    go: jest.fn(),
};
// Mock window.navigator
const originalNavigator = window.navigator;
delete window.navigator;
window.navigator = {
    ...originalNavigator,
    userAgent: 'jest',
    language: 'en-US',
    languages: ['en-US', 'en'],
    onLine: true,
    cookieEnabled: true,
    doNotTrack: null,
    hardwareConcurrency: 8,
    maxTouchPoints: 0,
    platform: 'Win32',
    vendor: 'Google Inc.',
    appName: 'Netscape',
    appVersion: '5.0',
    appCodeName: 'Mozilla',
    product: 'Gecko',
    productSub: '20030107',
};
// Suppress console errors during tests
const originalError = console.error;
beforeAll(() => {
    console.error = (..._args) => {
        if (typeof args[0] === 'string' &&
            args[0].includes('Warning: ReactDOM.render is no longer supported')) {
            return;
        }
        originalError.call(console, ...args);
    };
});
afterAll(() => {
    console.error = originalError;
});
