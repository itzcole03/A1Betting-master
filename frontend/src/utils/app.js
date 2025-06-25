import { UnifiedServiceRegistry } from './services/unified/UnifiedServiceRegistry';
export class Application {
    constructor() {
        this.serviceRegistry = UnifiedServiceRegistry.getInstance();
        this.logger = this.serviceRegistry.getService('logger');
        this.errorService = this.serviceRegistry.getService('error');
        this.websocketService = this.serviceRegistry.getService('websocket');
        this.stateService = this.serviceRegistry.getService('state');
        this.settingsService = this.serviceRegistry.getService('settings');
        this.notificationService =
            this.serviceRegistry.getService('notification');
    }
    static getInstance() {
        if (!Application.instance) {
            Application.instance = new Application();
        }
        return Application.instance;
    }
    async initialize() {
        try {
            this.logger.info('Initializing application...');
            // Initialize service registry
            await this.serviceRegistry.initialize();
            // Set up error handling
            this.setupErrorHandling();
            // Set up WebSocket connection
            this.setupWebSocket();
            // Load user preferences
            await this.loadUserPreferences();
            this.logger.info('Application initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize application', { error });
            throw error;
        }
    }
    setupErrorHandling() {
        // Global error handler
        window.onerror = (message, source, lineno, colno, error) => {
            this.errorService.handleError(error || message, {
                code: 'GLOBAL_ERROR',
                source: source || 'unknown',
                details: { lineno, colno },
            });
        };
        // Unhandled promise rejection handler
        window.onunhandledrejection = event => {
            this.errorService.handleError(event.reason, {
                code: 'UNHANDLED_REJECTION',
                source: 'promise',
            });
        };
    }
    setupWebSocket() {
        this.websocketService.connect();
        // Handle WebSocket events
        this.websocketService.on('connection:opened', () => {
            this.logger.info('WebSocket connection established');
            this.notificationService.notify('success', 'Connection Established', 'Real-time updates are now active');
        });
        this.websocketService.on('connection:closed', () => {
            this.logger.warn('WebSocket connection closed');
            this.notificationService.notify('warning', 'Connection Lost', 'Attempting to reconnect...');
        });
        this.websocketService.on('connection:error', error => {
            this.logger.error('WebSocket error', { error });
            this.notificationService.notify('error', 'Connection Error', 'Failed to establish real-time connection');
        });
    }
    async loadUserPreferences() {
        try {
            const settings = this.settingsService.getSettings();
            this.stateService.setStateValue('preferences', settings);
            // Apply theme
            document.documentElement.setAttribute('data-theme', settings.theme);
            // Apply language
            document.documentElement.setAttribute('lang', settings.language);
            this.logger.info('User preferences loaded successfully');
        }
        catch (error) {
            this.logger.error('Failed to load user preferences', { error });
            throw error;
        }
    }
    async shutdown() {
        try {
            this.logger.info('Shutting down application...');
            // Shutdown service registry
            await this.serviceRegistry.shutdown();
            this.logger.info('Application shut down successfully');
        }
        catch (error) {
            this.logger.error('Failed to shut down application', { error });
            throw error;
        }
    }
}
// Initialize application
const app = Application.getInstance();
app.initialize().catch(error => {
    console.error('Failed to initialize application:', error);
});
