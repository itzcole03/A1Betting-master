import '@testing-library/jest-dom';
import { jest, beforeAll, afterAll } from '@jest/globals';
// Mock WebSocket
class MockWebSocket {
    constructor(url) {
        this.binaryType = 'blob';
        this.bufferedAmount = 0;
        this.extensions = '';
        this.protocol = '';
        this.readyState = WebSocket.CONNECTING;
        this.onopen = null;
        this.onclose = null;
        this.onmessage = null;
        this.onerror = null;
        this.url = url;
        MockWebSocket.instances.push(this);
    }
    send(data) {
        // Mock send implementation
    }
    close(code, reason) {
        this.readyState = WebSocket.CLOSED;
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
        this.readyState = WebSocket.OPEN;
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
    addEventListener(type, listener, options) { }
    removeEventListener(type, listener, options) { }
    dispatchEvent(event) {
        return true;
    }
}
MockWebSocket.instances = [];
// Replace global WebSocket with mock
global.WebSocket = MockWebSocket;
// Mock fetch
const mockFetch = jest.fn().mockImplementation((url, options) => {
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
    constructor(callback, options) {
        this.observe = jest.fn();
        this.unobserve = jest.fn();
        this.disconnect = jest.fn();
    }
}
global.IntersectionObserver = MockIntersectionObserver;
// Mock ResizeObserver
class MockResizeObserver {
    constructor(callback) {
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
