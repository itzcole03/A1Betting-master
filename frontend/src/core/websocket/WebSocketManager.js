import { WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';
export class WebSocketManager extends EventEmitter {
    constructor(logger) {
        super();
        this.logger = logger;
        this.clients = new Map();
        this.MAX_RECONNECT_ATTEMPTS = 5;
        this.RECONNECT_DELAY = 1000;
        this.PING_INTERVAL = 30000;
        this.MESSAGE_QUEUE_LIMIT = 100;
        this.pingInterval = null;
        this.startPingInterval();
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    startPingInterval() {
        this.pingInterval = setInterval(() => {
            this.clients.forEach((client, id) => {
                if (Date.now() - client.lastPing > this.PING_INTERVAL * 2) {
                    this.handleClientDisconnect(id);
                }
                else {
                    this.sendPing(id);
                }
            });
        }, this.PING_INTERVAL);
    }
    async connect(socket) {
        const clientId = uuidv4();
        const client = {
            id: clientId,
            socket,
            subscriptions: new Set(),
            lastPing: Date.now(),
            reconnectAttempts: 0,
            messageQueue: [],
        };
        this.clients.set(clientId, client);
        this.setupSocketHandlers(client);
        this.logger.info(`Client connected: ${clientId}`);
        return clientId;
    }
    setupSocketHandlers(client) {
        client.socket.on('message', (data) => {
            try {
                const message = JSON.parse(data);
                this.handleMessage(client, message);
            }
            catch (error) {
                this.logger.error(`Error parsing message from client ${client.id}: ${error}`);
                this.sendError(client.id, 'Invalid message format');
            }
        });
        client.socket.on('close', () => {
            this.handleClientDisconnect(client.id);
        });
        client.socket.on('error', error => {
            this.logger.error(`WebSocket error for client ${client.id}: ${error}`);
            this.handleClientDisconnect(client.id);
        });
    }
    handleMessage(client, message) {
        if (!message.type) {
            this.sendError(client.id, 'Message type is required');
            return;
        }
        switch (message.type) {
            case 'subscribe':
                this.handleSubscribe(client, message.data);
                break;
            case 'unsubscribe':
                this.handleUnsubscribe(client, message.data);
                break;
            case 'ping':
                this.handlePing(client);
                break;
            default:
                this.emit('message', client.id, message, Array.from(client.subscriptions)[0]);
        }
    }
    handleSubscribe(client, topics) {
        topics.forEach(topic => {
            client.subscriptions.add(topic);
            this.logger.info(`Client ${client.id} subscribed to ${topic}`);
        });
    }
    handleUnsubscribe(client, topics) {
        topics.forEach(topic => {
            client.subscriptions.delete(topic);
            this.logger.info(`Client ${client.id} unsubscribed from ${topic}`);
        });
    }
    handlePing(client) {
        client.lastPing = Date.now();
        this.sendMessage(client.id, { type: 'pong', data: null, timestamp: Date.now() });
    }
    handleClientDisconnect(clientId) {
        const client = this.clients.get(clientId);
        if (!client)
            return;
        if (client.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
            client.reconnectAttempts++;
            setTimeout(() => {
                this.attemptReconnect(client);
            }, this.RECONNECT_DELAY * client.reconnectAttempts);
        }
        else {
            this.removeClient(clientId);
        }
    }
    async attemptReconnect(client) {
        try {
            // Implement reconnection logic here
            this.logger.info(`Attempting to reconnect client ${client.id}`);
            // For now, just remove the client
            this.removeClient(client.id);
        }
        catch (error) {
            this.logger.error(`Reconnection failed for client ${client.id}: ${error}`);
            this.removeClient(client.id);
        }
    }
    removeClient(clientId) {
        const client = this.clients.get(clientId);
        if (!client)
            return;
        client.socket.close();
        this.clients.delete(clientId);
        this.logger.info(`Client disconnected: ${clientId}`);
        this.emit('disconnect', clientId);
    }
    sendMessage(clientId, message) {
        const client = this.clients.get(clientId);
        if (!client)
            return;
        if (client.socket.readyState === WebSocket.OPEN) {
            client.socket.send(JSON.stringify(message));
        }
        else {
            this.queueMessage(client, message);
        }
    }
    queueMessage(client, message) {
        if (client.messageQueue.length >= this.MESSAGE_QUEUE_LIMIT) {
            client.messageQueue.shift(); // Remove oldest message
        }
        client.messageQueue.push(message);
    }
    sendPing(clientId) {
        this.sendMessage(clientId, { type: 'ping', data: null, timestamp: Date.now() });
    }
    sendError(clientId, error) {
        this.sendMessage(clientId, {
            type: 'error',
            data: { message: error },
            timestamp: Date.now(),
        });
    }
    broadcast(message, topic) {
        this.clients.forEach((client, clientId) => {
            if (!topic || client.subscriptions.has(topic)) {
                this.sendMessage(clientId, message);
            }
        });
    }
    getClientCount() {
        return this.clients.size;
    }
    getSubscriberCount(topic) {
        let count = 0;
        this.clients.forEach(client => {
            if (client.subscriptions.has(topic))
                count++;
        });
        return count;
    }
    cleanup() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }
        this.clients.forEach((client, id) => {
            this.removeClient(id);
        });
    }
}
