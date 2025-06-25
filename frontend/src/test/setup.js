import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
// Runs a cleanup after each test case
afterEach(() => {
    cleanup();
});
// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;
// Mock ResizeObserver
const mockResizeObserver = vi.fn();
mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
});
window.ResizeObserver = mockResizeObserver;
// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});
// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
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
    send(data) {
        if (this.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket is not open');
        }
        // Mock sending data
    }
    addEventListener(type, listener, options) {
        // Implementation not needed for our tests
    }
    removeEventListener(type, listener, options) {
        // Implementation not needed for our tests
    }
    dispatchEvent(event) {
        return true;
    }
}
// Replace the global WebSocket with our mock
global.WebSocket = MockWebSocket;
// Mock Notification API
Object.defineProperty(window, 'Notification', {
    value: vi.fn().mockImplementation(() => ({
        permission: 'granted',
        requestPermission: vi.fn().mockResolvedValue('granted'),
    })),
});
// Set timezone for consistent date handling in tests
process.env.TZ = 'UTC';
