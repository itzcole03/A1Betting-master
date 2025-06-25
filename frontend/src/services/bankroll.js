var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import apiService from './api';
import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
let BankrollService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = EventEmitter;
    var BankrollService = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.currentBalance = 1000; // Starting balance
            this.transactions = [];
            this.settings = {
                maxBetPercentage: 0.05,
                stopLossPercentage: 0.1,
                takeProfitPercentage: 0.2,
                kellyFraction: 0.5,
            };
            // Initialize balance from localStorage if available
            const storedBalance = localStorage.getItem('current_balance');
            if (storedBalance) {
                this.currentBalance = parseFloat(storedBalance);
            }
        }
        static getInstance() {
            if (!BankrollService.instance) {
                BankrollService.instance = new BankrollService();
            }
            return BankrollService.instance;
        }
        async initialize() {
            // Initialize bankroll service
        }
        async getBalance() {
            try {
                const response = await apiService.getUserProfile();
                this.currentBalance = response.data.balance;
                localStorage.setItem('current_balance', this.currentBalance.toString());
                return this.currentBalance;
            }
            catch (error) {
                console.error('Failed to fetch balance:', error);
                throw error;
            }
        }
        async deposit(amount) {
            try {
                const response = await apiService.createTransaction({
                    type: 'deposit',
                    amount,
                    status: 'pending',
                });
                if (response.data.status === 'completed') {
                    this.currentBalance += amount;
                    localStorage.setItem('current_balance', this.currentBalance.toString());
                }
                return response.data;
            }
            catch (error) {
                console.error('Failed to process deposit:', error);
                throw error;
            }
        }
        async withdraw(amount) {
            if (amount > this.currentBalance) {
                throw new Error('Insufficient funds');
            }
            try {
                const response = await apiService.createTransaction({
                    type: 'withdrawal',
                    amount,
                    status: 'pending',
                });
                if (response.data.status === 'completed') {
                    this.currentBalance -= amount;
                    localStorage.setItem('current_balance', this.currentBalance.toString());
                }
                return response.data;
            }
            catch (error) {
                console.error('Failed to process withdrawal:', error);
                throw error;
            }
        }
        async getTransactionHistory() {
            try {
                const response = await apiService.getTransactions();
                return response.data;
            }
            catch (error) {
                console.error('Failed to fetch transaction history:', error);
                throw error;
            }
        }
        getCurrentBalance() {
            return this.currentBalance;
        }
        async updateBalance(amount, type) {
            try {
                const response = await apiService.createTransaction({
                    type,
                    amount: Math.abs(amount),
                    status: 'completed',
                });
                if (response.data.status === 'completed') {
                    switch (type) {
                        case 'win':
                            this.currentBalance += amount;
                            break;
                        case 'loss':
                        case 'bet':
                            this.currentBalance -= amount;
                            break;
                    }
                    localStorage.setItem('current_balance', this.currentBalance.toString());
                }
            }
            catch (error) {
                console.error('Failed to update balance:', error);
                throw error;
            }
        }
        getTransactions() {
            return this.transactions;
        }
        getSettings() {
            return this.settings;
        }
        updateSettings(newSettings) {
            this.settings = { ...this.settings, ...newSettings };
        }
        getStats() {
            const stats = {
                currentBalance: this.currentBalance,
                startingBalance: this.getStartingBalance(),
                totalDeposits: this.getTotalDeposits(),
                totalWithdrawals: this.getTotalWithdrawals(),
                totalBets: this.getTotalBets(),
                totalWins: this.getTotalWins(),
                totalLosses: this.getTotalLosses(),
                netProfit: this.getNetProfit(),
                roi: this.getROI(),
                winRate: this.getWinRate(),
                averageBetSize: this.getAverageBetSize(),
                largestWin: this.getLargestWin(),
                largestLoss: this.getLargestLoss(),
                currentStreak: this.getCurrentStreak(),
                bestStreak: this.getBestStreak(),
                worstStreak: this.getWorstStreak(),
            };
            return stats;
        }
        getStartingBalance() {
            const firstDeposit = this.transactions.find(t => t.type === 'deposit');
            return firstDeposit ? firstDeposit.amount : 0;
        }
        getTotalDeposits() {
            return this.transactions
                .filter(t => t.type === 'deposit')
                .reduce((sum, t) => sum + t.amount, 0);
        }
        getTotalWithdrawals() {
            return Math.abs(this.transactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0));
        }
        getTotalBets() {
            return this.transactions.filter(t => t.type === 'bet').length;
        }
        getTotalWins() {
            return this.transactions.filter(t => t.type === 'win').length;
        }
        getTotalLosses() {
            return this.transactions.filter(t => t.type === 'loss').length;
        }
        getNetProfit() {
            return this.transactions.reduce((sum, t) => sum + t.amount, 0);
        }
        getROI() {
            const totalBets = this.getTotalBets();
            if (totalBets === 0)
                return 0;
            return (this.getNetProfit() / this.getTotalDeposits()) * 100;
        }
        getWinRate() {
            const totalBets = this.getTotalBets();
            if (totalBets === 0)
                return 0;
            return (this.getTotalWins() / totalBets) * 100;
        }
        getAverageBetSize() {
            const bets = this.transactions.filter(t => t.type === 'bet');
            if (bets.length === 0)
                return 0;
            return Math.abs(bets.reduce((sum, t) => sum + t.amount, 0)) / bets.length;
        }
        getLargestWin() {
            const wins = this.transactions.filter(t => t.type === 'win');
            if (wins.length === 0)
                return 0;
            return Math.max(...wins.map(t => t.amount));
        }
        getLargestLoss() {
            const losses = this.transactions.filter(t => t.type === 'loss');
            if (losses.length === 0)
                return 0;
            return Math.abs(Math.min(...losses.map(t => t.amount)));
        }
        getCurrentStreak() {
            let streak = 0;
            for (let i = this.transactions.length - 1; i >= 0; i--) {
                const t = this.transactions[i];
                if (t.type === 'win')
                    streak++;
                else if (t.type === 'loss')
                    break;
            }
            return streak;
        }
        getBestStreak() {
            let currentStreak = 0;
            let bestStreak = 0;
            for (const t of this.transactions) {
                if (t.type === 'win') {
                    currentStreak++;
                    bestStreak = Math.max(bestStreak, currentStreak);
                }
                else if (t.type === 'loss') {
                    currentStreak = 0;
                }
            }
            return bestStreak;
        }
        getWorstStreak() {
            let currentStreak = 0;
            let worstStreak = 0;
            for (const t of this.transactions) {
                if (t.type === 'loss') {
                    currentStreak++;
                    worstStreak = Math.max(worstStreak, currentStreak);
                }
                else if (t.type === 'win') {
                    currentStreak = 0;
                }
            }
            return worstStreak;
        }
        getMaxBetAmount() {
            return this.currentBalance * this.settings.maxBetPercentage;
        }
        getDailyBetsCount() {
            const today = new Date().toISOString().split('T')[0];
            return this.transactions.filter(t => t.type === 'bet' && t.timestamp.startsWith(today)).length;
        }
        getConcurrentBetsCount() {
            return this.transactions.filter(t => t.type === 'bet' && t.status === 'completed').length;
        }
        checkStopLoss() {
            const stopLossAmount = this.currentBalance * this.settings.stopLossPercentage;
            return this.currentBalance <= stopLossAmount;
        }
        checkTakeProfit() {
            const takeProfitAmount = this.currentBalance * this.settings.takeProfitPercentage;
            return this.currentBalance >= takeProfitAmount;
        }
        getMetrics() {
            const totalWins = this.transactions.filter(t => t.type === 'win').length;
            const totalLosses = this.transactions.filter(t => t.type === 'loss').length;
            const totalBets = this.transactions.filter(t => t.type === 'bet').length;
            const winRate = totalBets > 0 ? totalWins / totalBets : 0;
            const averageBetSize = totalBets > 0
                ? this.transactions.filter(t => t.type === 'bet').reduce((sum, t) => sum + t.amount, 0) /
                    totalBets
                : 0;
            const largestWin = Math.max(...this.transactions.filter(t => t.type === 'win').map(t => t.amount), 0);
            const largestLoss = Math.min(...this.transactions.filter(t => t.type === 'loss').map(t => t.amount), 0);
            const netProfit = this.currentBalance - 1000; // Starting balance
            const roi = netProfit / 1000; // ROI relative to starting balance
            return {
                currentBalance: this.currentBalance,
                startingBalance: 1000,
                totalWins,
                totalLosses,
                winRate,
                averageBetSize,
                largestWin,
                largestLoss,
                netProfit,
                roi,
            };
        }
    };
    __setFunctionName(_classThis, "BankrollService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BankrollService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BankrollService = _classThis;
})();
export { BankrollService };
export const bankrollService = BankrollService.getInstance();
export default bankrollService;
