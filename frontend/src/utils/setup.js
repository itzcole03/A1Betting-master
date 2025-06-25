import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
// Runs a cleanup after each test case
afterEach(() => {
    cleanup();
});
// Mock IntersectionObserver
class MockIntersectionObserver {
    constructor() {
        this.root = null;
        this.rootMargin = '';
        this.thresholds = [];
    }
    disconnect() { }
    observe() { }
    takeRecords() { return []; }
    unobserve() { }
    // For test compatibility
    mockReturnValue() { }
}
window.IntersectionObserver = MockIntersectionObserver;
// Mock ResizeObserver
class MockResizeObserver {
    disconnect() { }
    observe() { }
    unobserve() { }
    // For test compatibility
    mockReturnValue() { }
}
window.ResizeObserver = MockResizeObserver;
// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => null,
        removeListener: () => null,
        addEventListener: () => null,
        removeEventListener: () => null,
        dispatchEvent: () => false,
    }),
});
// Mock localStorage
const localStorageMock = {
    getItem: () => null,
    setItem: () => null,
    removeItem: () => null,
    clear: () => null,
};
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});
// Mock WebSocket
class MockWebSocket {
    constructor() {
        this.binaryType = 'blob';
        this.bufferedAmount = 0;
        this.extensions = '';
        this.protocol = '';
        this.readyState = WebSocket.CONNECTING;
        this.url = '';
        this.CONNECTING = WebSocket.CONNECTING;
        this.OPEN = WebSocket.OPEN;
        this.CLOSING = WebSocket.CLOSING;
        this.CLOSED = WebSocket.CLOSED;
        this.onclose = null;
        this.onerror = null;
        this.onmessage = null;
        this.onopen = null;
        setTimeout(() => {
            this.readyState = WebSocket.OPEN;
            this.onopen?.(new Event('open'));
        }, 0);
    }
    close(code, reason) {
        this.readyState = WebSocket.CLOSED;
        this.onclose?.(new CloseEvent('close', { code, reason }));
    }
    send(_) {
        if (this.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket is not open');
        }
        // Mock sending data
    }
    addEventListener(_type, _listener, _options) {
        // Implementation not needed for our tests
    }
    removeEventListener(_type, _listener, _options) {
        // Implementation not needed for our tests
    }
    dispatchEvent(_) {
        return true;
    }
}
// Replace the global WebSocket with our mock
global.WebSocket = MockWebSocket;
// Mock Notification API
Object.defineProperty(window, 'Notification', {
    value: function () {
        return {
            permission: 'granted',
            requestPermission: () => Promise.resolve('granted'),
        };
    },
});
// Set timezone for consistent date handling in tests
process.env.TZ = 'UTC';
