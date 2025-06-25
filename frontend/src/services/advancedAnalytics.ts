export interface AdvancedMetrics {
  kellyOptimal: number;
  sharpeRatio: number;
  expectedValue: number;
  confidenceInterval: [number, number];
  riskAdjustedReturn: number;
  marketEfficiency: number;
  valueScore: number;
  consistencyRating: number;
}

export interface ModelPrediction {
  prediction: number;
  confidence: number;
  modelName: string;
  features: Record<string, number>;
}

export interface PlayerAnalysis {
  player: any;
  statType: string;
  line: number;
  prediction: number;
  confidence: number;
  models: ModelPrediction[];
  metrics: AdvancedMetrics;
  injuries: any[];
  weather: any;
  sentiment: any;
}

export class AdvancedAnalytics {
  async analyzePlayerProp(
    player: any,
    statType: string,
    line: number,
    dataSources: Map<string, any>,
  ): Promise<PlayerAnalysis> {
    // Run multiple ML models
    const models = await this.runMLModels(player, statType, line);

    // Calculate ensemble prediction
    const prediction = this.calculateEnsemblePrediction(models);
    const confidence = this.calculateEnsembleConfidence(models);

    // Calculate advanced metrics
    const metrics = this.calculateAdvancedMetrics(prediction, line, confidence);

    // Analyze external factors
    const injuries = await this.analyzeInjuries(player);
    const weather = await this.analyzeWeather(player);
    const sentiment = await this.analyzeSentiment(player);

    return {
      player,
      statType,
      line,
      prediction,
      confidence,
      models,
      metrics,
      injuries,
      weather,
      sentiment,
    };
  }

  private async runMLModels(
    player: any,
    statType: string,
    line: number,
  ): Promise<ModelPrediction[]> {
    const models: ModelPrediction[] = [];

    // Random Forest Model
    const rfPrediction = await this.runRandomForest(player, statType, line);
    models.push(rfPrediction);

    // XGBoost Model
    const xgbPrediction = await this.runXGBoost(player, statType, line);
    models.push(xgbPrediction);

    // Neural Network Model
    const nnPrediction = await this.runNeuralNetwork(player, statType, line);
    models.push(nnPrediction);

    // Linear Regression Model
    const lrPrediction = await this.runLinearRegression(player, statType, line);
    models.push(lrPrediction);

    return models;
  }

  private async runRandomForest(
    player: any,
    statType: string,
    line: number,
  ): Promise<ModelPrediction> {
    // Simulate Random Forest prediction
    const baseValue = player.stats?.[statType.toLowerCase()] || line;
    const formFactor = this.calculateFormFactor(player.recentForm);
    const prediction = baseValue * (0.9 + formFactor * 0.2);

    return {
      prediction,
      confidence: 0.82 + Math.random() * 0.12,
      modelName: "RandomForest",
      features: {
        seasonAverage: baseValue,
        recentForm: formFactor,
        homeAway: Math.random() > 0.5 ? 1.05 : 0.95,
        opponent: 0.95 + Math.random() * 0.1,
        rest: Math.random() > 0.3 ? 1.02 : 0.98,
      },
    };
  }

  private async runXGBoost(
    player: any,
    statType: string,
    line: number,
  ): Promise<ModelPrediction> {
    // Simulate XGBoost prediction
    const baseValue = player.stats?.[statType.toLowerCase()] || line;
    const formFactor = this.calculateFormFactor(player.recentForm);
    const prediction = baseValue * (0.88 + formFactor * 0.24);

    return {
      prediction,
      confidence: 0.86 + Math.random() * 0.1,
      modelName: "XGBoost",
      features: {
        seasonAverage: baseValue,
        recentForm: formFactor,
        usage: 0.8 + Math.random() * 0.4,
        pace: 0.95 + Math.random() * 0.1,
        matchup: 0.9 + Math.random() * 0.2,
      },
    };
  }

  private async runNeuralNetwork(
    player: any,
    statType: string,
    line: number,
  ): Promise<ModelPrediction> {
    // Simulate Neural Network prediction
    const baseValue = player.stats?.[statType.toLowerCase()] || line;
    const formFactor = this.calculateFormFactor(player.recentForm);
    const prediction = baseValue * (0.92 + formFactor * 0.16);

    return {
      prediction,
      confidence: 0.89 + Math.random() * 0.08,
      modelName: "NeuralNetwork",
      features: {
        seasonAverage: baseValue,
        recentForm: formFactor,
        momentum: 0.4 + Math.random() * 0.6,
        situational: 0.85 + Math.random() * 0.3,
        advanced: 0.9 + Math.random() * 0.2,
      },
    };
  }

  private async runLinearRegression(
    player: any,
    statType: string,
    line: number,
  ): Promise<ModelPrediction> {
    // Simulate Linear Regression prediction
    const baseValue = player.stats?.[statType.toLowerCase()] || line;
    const formFactor = this.calculateFormFactor(player.recentForm);
    const prediction = baseValue * (0.94 + formFactor * 0.12);

    return {
      prediction,
      confidence: 0.75 + Math.random() * 0.15,
      modelName: "LinearRegression",
      features: {
        seasonAverage: baseValue,
        recentForm: formFactor,
        trend: 0.5 + Math.random() * 0.3,
        correlation: 0.6 + Math.random() * 0.3,
      },
    };
  }

  private calculateFormFactor(recentForm?: number[]): number {
    if (!recentForm || recentForm.length === 0) {
      return 0.5; // Neutral
    }

    // Weight recent games more heavily
    const weights = [0.1, 0.1, 0.15, 0.15, 0.2, 0.3];
    const recent = recentForm.slice(-6);

    let weightedSum = 0;
    let totalWeight = 0;

    recent.forEach((form, index) => {
      const weight = weights[index] || 0.1;
      weightedSum += form * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? weightedSum / totalWeight : 0.5;
  }

  private calculateEnsemblePrediction(models: ModelPrediction[]): number {
    // Weighted average based on model confidence
    let weightedSum = 0;
    let totalWeight = 0;

    models.forEach((model) => {
      const weight = model.confidence;
      weightedSum += model.prediction * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  private calculateEnsembleConfidence(models: ModelPrediction[]): number {
    // Average confidence adjusted for model agreement
    const avgConfidence =
      models.reduce((sum, model) => sum + model.confidence, 0) / models.length;

    // Calculate prediction variance (lower variance = higher confidence)
    const predictions = models.map((m) => m.prediction);
    const avgPrediction =
      predictions.reduce((sum, pred) => sum + pred, 0) / predictions.length;
    const variance =
      predictions.reduce(
        (sum, pred) => sum + Math.pow(pred - avgPrediction, 2),
        0,
      ) / predictions.length;
    const standardDeviation = Math.sqrt(variance);

    // Lower std dev = higher confidence
    const agreementFactor = Math.max(0, 1 - standardDeviation / avgPrediction);

    return avgConfidence * (0.8 + agreementFactor * 0.2);
  }

  private calculateAdvancedMetrics(
    prediction: number,
    line: number,
    confidence: number,
  ): AdvancedMetrics {
    const expectedValue = this.calculateExpectedValue(
      prediction,
      line,
      confidence,
    );
    const kellyOptimal = this.calculateKellyOptimal(prediction, line);
    const sharpeRatio = this.calculateSharpeRatio(expectedValue, confidence);

    return {
      kellyOptimal,
      sharpeRatio,
      expectedValue,
      confidenceInterval: [prediction * 0.85, prediction * 1.15],
      riskAdjustedReturn: expectedValue / Math.max(0.1, 1 - confidence),
      marketEfficiency: 0.85 + Math.random() * 0.1,
      valueScore: Math.max(0, expectedValue * confidence),
      consistencyRating: confidence,
    };
  }

  private calculateExpectedValue(
    prediction: number,
    line: number,
    confidence: number,
  ): number {
    const probability = confidence;
    const isOver = prediction > line;
    const winProbability = isOver ? probability : 1 - probability;
    const odds = 1.91; // -110 odds

    return (winProbability * (odds - 1) - (1 - winProbability)) * 100;
  }

  private calculateKellyOptimal(prediction: number, line: number): number {
    const probability = prediction > line ? 0.52 : 0.48; // Slight edge
    const odds = 1.91; // -110 odds
    const q = 1 - probability;
    const b = odds - 1;

    return Math.max(0, (b * probability - q) / b);
  }

  private calculateSharpeRatio(
    expectedValue: number,
    confidence: number,
  ): number {
    const risk = 1 - confidence;
    return Math.max(0, expectedValue / Math.max(0.1, risk * 100));
  }

  private async analyzeInjuries(player: any): Promise<any[]> {
    // Simulate injury analysis
    return [
      {
        type: "Minor",
        impactScore: Math.random() * 0.1,
        description: "No current injuries reported",
      },
    ];
  }

  private async analyzeWeather(player: any): Promise<any> {
    // Simulate weather analysis
    return {
      gameImpactScore: Math.random() * 0.05,
      conditions: "Clear",
      temperature: 72,
      windSpeed: 5,
    };
  }

  private async analyzeSentiment(player: any): Promise<any> {
    // Simulate sentiment analysis
    return {
      socialMediaScore: (Math.random() - 0.5) * 0.2,
      newsScore: (Math.random() - 0.5) * 0.1,
      overallSentiment: "Neutral",
    };
  }
}

export const advancedAnalytics = new AdvancedAnalytics();
