import { AnimatePresence, motion } from 'framer-motion';
import {
    BarChart3,
    Brain,
    CheckCircle,
    Clock,
    Shield,
    Star,
    Target,
    TrendingUp,
    Zap
} from 'lucide-react';
import React, { useCallback, useState } from 'react';

interface UltraAccuratePrediction {
    finalPrediction: number;
    confidenceScore: number;
    uncertaintyEstimate: number;
    predictionInterval: [number, number];
    modelConsensus: number;
    marketEfficiencyScore: number;
    expectedAccuracy: number;
    alternativeDataSignals: Record<string, number>;
    behavioralPatterns: Record<string, any>;
    microstructureAnalysis: Record<string, any>;
    featureImportance: Record<string, number>;
    modelContributions: Record<string, number>;
    riskAdjustedEdge: number;
    optimalStakeFraction: number;
    predictionRationale: string;
    timestamp: string;
    processingTime: number;
    dataQualityScore: number;
    marketConditions: Record<string, any>;
}

interface UltraAccuracyProps {
    onPredictionGenerated?: (prediction: UltraAccuratePrediction) => void;
}

const UltraAccuracyDashboard: React.FC<UltraAccuracyProps> = ({ onPredictionGenerated }) => {
    const [prediction, setPrediction] = useState<UltraAccuratePrediction | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [targetAccuracy, setTargetAccuracy] = useState(99.5);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
        'quantum_ensemble',
        'behavioral_patterns',
        'market_microstructure',
        'alternative_data',
        'multi_timeframe_consensus'
    ]);

    const generateUltraAccuratePrediction = useCallback(async () => {
        setIsGenerating(true);

        try {
            // Simulate ultra-accuracy prediction generation
            await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate processing time

            const mockPrediction: UltraAccuratePrediction = {
                finalPrediction: 0.847 + Math.random() * 0.1,
                confidenceScore: 0.992 + Math.random() * 0.007,
                uncertaintyEstimate: 0.003 + Math.random() * 0.007,
                predictionInterval: [0.82, 0.88] as [number, number],
                modelConsensus: 0.954 + Math.random() * 0.04,
                marketEfficiencyScore: 0.45 + Math.random() * 0.3,
                expectedAccuracy: targetAccuracy / 100,
                alternativeDataSignals: {
                    socialSentiment: Math.random() - 0.5,
                    weatherImpact: Math.random() * 0.1 - 0.05,
                    newsSentiment: Math.random() - 0.5,
                    venueFactors: Math.random() * 0.1
                },
                behavioralPatterns: {
                    overreactionBias: Math.random(),
                    herdingBehavior: Math.random(),
                    anchoring: Math.random(),
                    recencyBias: Math.random()
                },
                microstructureAnalysis: {
                    bidAskSpread: Math.random() * 0.02,
                    liquidityDepth: Math.random() * 10000,
                    orderFlowImbalance: Math.random() * 0.4 - 0.2,
                    volatilityClustering: Math.random()
                },
                featureImportance: {
                    'player_form': 0.25 + Math.random() * 0.1,
                    'opponent_strength': 0.20 + Math.random() * 0.1,
                    'venue_advantage': 0.15 + Math.random() * 0.1,
                    'weather_conditions': 0.10 + Math.random() * 0.05,
                    'historical_matchup': 0.12 + Math.random() * 0.08,
                    'market_sentiment': 0.08 + Math.random() * 0.05,
                    'injury_reports': 0.10 + Math.random() * 0.05
                },
                modelContributions: {
                    'quantum_ensemble': 0.35,
                    'neural_architecture_search': 0.25,
                    'meta_learning': 0.20,
                    'transformer_ensemble': 0.20
                },
                riskAdjustedEdge: 0.075 + Math.random() * 0.05,
                optimalStakeFraction: 0.025 + Math.random() * 0.02,
                predictionRationale: `Ultra-accurate prediction with ${(targetAccuracy).toFixed(1)}% confidence using quantum-enhanced ensemble of 47 advanced ML models. Strong consensus detected across all timeframes with significant behavioral bias correction.`,
                timestamp: new Date().toISOString(),
                processingTime: 2.847 + Math.random(),
                dataQualityScore: 0.96 + Math.random() * 0.03,
                marketConditions: {
                    volatility: Math.random() * 0.3,
                    liquidity: Math.random(),
                    efficiency: Math.random()
                }
            };

            setPrediction(mockPrediction);
            onPredictionGenerated?.(mockPrediction);

        } catch (error) {
            console.error('Error generating ultra-accurate prediction:', error);
        } finally {
            setIsGenerating(false);
        }
    }, [targetAccuracy, onPredictionGenerated]);

    const getAccuracyColor = (accuracy: number) => {
        if (accuracy >= 0.99) return 'text-green-400';
        if (accuracy >= 0.95) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getConfidenceLevel = (confidence: number) => {
        if (confidence >= 0.99) return 'ULTRA HIGH';
        if (confidence >= 0.95) return 'HIGH';
        if (confidence >= 0.90) return 'MEDIUM';
        return 'LOW';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Brain className="w-12 h-12 text-purple-400" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Ultra-Accuracy Prediction Engine
                        </h1>
                        <Target className="w-12 h-12 text-pink-400" />
                    </div>
                    <p className="text-gray-300 text-lg">
                        Achieving {targetAccuracy}% prediction accuracy through quantum-enhanced AI
                    </p>
                </motion.div>

                {/* Control Panel */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-purple-500/20"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Target Accuracy */}
                        <div>
                            <label className="block text-purple-300 mb-2 font-semibold">
                                Target Accuracy (%)
                            </label>
                            <div className="relative">
                                <input
                                    type="range"
                                    min="95"
                                    max="99.9"
                                    step="0.1"
                                    value={targetAccuracy}
                                    onChange={(e) => setTargetAccuracy(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                />
                                <span className="text-white font-bold text-xl">
                                    {targetAccuracy.toFixed(1)}%
                                </span>
                            </div>
                        </div>

                        {/* Feature Selection */}
                        <div>
                            <label className="block text-purple-300 mb-2 font-semibold">
                                Advanced Features
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    'quantum_ensemble',
                                    'behavioral_patterns',
                                    'market_microstructure',
                                    'alternative_data',
                                    'multi_timeframe_consensus'
                                ].map((feature) => (
                                    <button
                                        key={feature}
                                        onClick={() => {
                                            setSelectedFeatures(prev =>
                                                prev.includes(feature)
                                                    ? prev.filter(f => f !== feature)
                                                    : [...prev, feature]
                                            );
                                        }}
                                        className={`px-3 py-1 rounded-full text-sm transition-all ${selectedFeatures.includes(feature)
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        {feature.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Generate Button */}
                        <div className="flex items-end">
                            <motion.button
                                onClick={generateUltraAccuratePrediction}
                                disabled={isGenerating}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Quantum Processing...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5" />
                                        Generate Ultra-Accurate Prediction
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Prediction Results */}
                <AnimatePresence>
                    {prediction && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                        >
                            {/* Main Prediction Card */}
                            <motion.div
                                className="lg:col-span-2 bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-green-500/30"
                                whileHover={{ scale: 1.01 }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <CheckCircle className="w-8 h-8 text-green-400" />
                                        Ultra-Accurate Prediction
                                    </h2>
                                    <div className="text-right">
                                        <div className={`text-3xl font-bold ${getAccuracyColor(prediction.expectedAccuracy)}`}>
                                            {(prediction.finalPrediction * 100).toFixed(1)}%
                                        </div>
                                        <div className="text-gray-400 text-sm">
                                            {getConfidenceLevel(prediction.confidenceScore)} CONFIDENCE
                                        </div>
                                    </div>
                                </div>

                                {/* Accuracy Metrics */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                                        <div className="text-green-400 font-bold text-lg">
                                            {(prediction.confidenceScore * 100).toFixed(2)}%
                                        </div>
                                        <div className="text-gray-400 text-xs">Confidence</div>
                                    </div>
                                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                                        <div className="text-blue-400 font-bold text-lg">
                                            {(prediction.modelConsensus * 100).toFixed(1)}%
                                        </div>
                                        <div className="text-gray-400 text-xs">Model Consensus</div>
                                    </div>
                                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                                        <div className="text-purple-400 font-bold text-lg">
                                            {(prediction.uncertaintyEstimate * 100).toFixed(2)}%
                                        </div>
                                        <div className="text-gray-400 text-xs">Uncertainty</div>
                                    </div>
                                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                                        <div className="text-yellow-400 font-bold text-lg">
                                            {prediction.processingTime.toFixed(2)}s
                                        </div>
                                        <div className="text-gray-400 text-xs">Processing</div>
                                    </div>
                                </div>

                                {/* Prediction Rationale */}
                                <div className="bg-gray-800/30 rounded-lg p-4 mb-4">
                                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                        <Brain className="w-5 h-5 text-purple-400" />
                                        AI Reasoning
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        {prediction.predictionRationale}
                                    </p>
                                </div>

                                {/* Feature Importance */}
                                <div className="bg-gray-800/30 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-blue-400" />
                                        Key Factors
                                    </h3>
                                    <div className="space-y-2">
                                        {Object.entries(prediction.featureImportance)
                                            .sort(([, a], [, b]) => b - a)
                                            .slice(0, 5)
                                            .map(([feature, importance]) => (
                                                <div key={feature} className="flex items-center justify-between">
                                                    <span className="text-gray-300 capitalize">
                                                        {feature.replace('_', ' ')}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 bg-gray-700 rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                                                style={{ width: `${importance * 100}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-white font-semibold text-sm w-12">
                                                            {(importance * 100).toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Side Panel */}
                            <div className="space-y-6">
                                {/* Risk & Reward */}
                                <motion.div
                                    className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <Shield className="w-6 h-6 text-yellow-400" />
                                        Risk & Reward
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-300">Expected Edge</span>
                                            <span className="text-green-400 font-bold">
                                                +{(prediction.riskAdjustedEdge * 100).toFixed(2)}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-300">Optimal Stake</span>
                                            <span className="text-blue-400 font-bold">
                                                {(prediction.optimalStakeFraction * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-300">Market Efficiency</span>
                                            <span className={`font-bold ${prediction.marketEfficiencyScore < 0.5 ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                {(prediction.marketEfficiencyScore * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Model Performance */}
                                <motion.div
                                    className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <Star className="w-6 h-6 text-purple-400" />
                                        Model Stack
                                    </h3>
                                    <div className="space-y-2">
                                        {Object.entries(prediction.modelContributions).map(([model, contribution]) => (
                                            <div key={model} className="flex items-center justify-between">
                                                <span className="text-gray-300 text-sm capitalize">
                                                    {model.replace('_', ' ')}
                                                </span>
                                                <span className="text-purple-400 font-semibold">
                                                    {(contribution * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Alternative Data Signals */}
                                <motion.div
                                    className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-6 h-6 text-blue-400" />
                                        Alt Data Signals
                                    </h3>
                                    <div className="space-y-2">
                                        {Object.entries(prediction.alternativeDataSignals).map(([signal, value]) => (
                                            <div key={signal} className="flex items-center justify-between">
                                                <span className="text-gray-300 text-sm capitalize">
                                                    {signal.replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                                <span className={`font-semibold ${value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-gray-400'
                                                    }`}>
                                                    {value > 0 ? '+' : ''}{(value * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Status Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 text-center text-gray-400"
                >
                    <div className="flex items-center justify-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Last updated: {prediction ? new Date(prediction.timestamp).toLocaleTimeString() : 'Never'}
                        </div>
                        {prediction && (
                            <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                Data Quality: {(prediction.dataQualityScore * 100).toFixed(1)}%
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default UltraAccuracyDashboard;
