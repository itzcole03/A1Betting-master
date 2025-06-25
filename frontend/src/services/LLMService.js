/**
 * LLM Service for connecting PropOllama to backend LLM engine
 * Handles chat, analysis, and sports expert agent communications
 */

class LLMService {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";
        this.llmBaseURL = `${this.baseURL}/api/v1/llm`;
    }

    /**
     * Generate text response from LLM
     */
    async generateText(prompt, options = {}) {
        const {
            maxTokens = 500,
            temperature = 0.7,
            stream = false
        } = options;

        try {
            const endpoint = stream ? "/stream_generate" : "/generate";
            const response = await fetch(`${this.llmBaseURL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt,
                    max_tokens: maxTokens,
                    temperature,
                }),
            });

            if (!response.ok) {
                throw new Error(`LLM request failed: ${response.status}`);
            }

            if (stream) {
                return response; // Return response for streaming
            }

            const data = await response.json();
            return data.text;
        } catch (error) {
            console.error("LLM generation error:", error);
            throw error;
        }
    }

    /**
     * Generate sports analysis for PropOllama
     */
    async generateSportsAnalysis(userQuery) {
        const sportsPrompt = `You are PropOllama, an elite AI sports betting analyst.
User query: "${userQuery}"

Please provide a comprehensive sports betting analysis with:
1. Top player prop recommendations with confidence percentages
2. Detailed reasoning for each pick
3. Statistical backing and trends
4. Risk assessment
5. Suggested follow-up questions

Format your response with clear sections and use emojis for visual appeal.`;

        return await this.generateText(sportsPrompt, {
            maxTokens: 800,
            temperature: 0.6,
        });
    }

    /**
     * Explain a specific bet recommendation
     */
    async explainBet(features) {
        try {
            const response = await fetch(`${this.llmBaseURL}/explain_bet`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ features }),
            });

            if (!response.ok) {
                throw new Error(`Bet explanation failed: ${response.status}`);
            }

            const data = await response.json();
            return data.explanation;
        } catch (error) {
            console.error("Bet explanation error:", error);
            throw error;
        }
    }

    /**
     * Generate betting scenarios
     */
    async generateScenarios(query) {
        try {
            const response = await fetch(`${this.llmBaseURL}/generate_scenarios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error(`Scenario generation failed: ${response.status}`);
            }

            const data = await response.json();
            return data.scenarios;
        } catch (error) {
            console.error("Scenario generation error:", error);
            throw error;
        }
    }

    /**
     * Analyze sentiment of sports news/data
     */
    async analyzeSentiment(text) {
        try {
            const response = await fetch(`${this.llmBaseURL}/sentiment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error(`Sentiment analysis failed: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Sentiment analysis error:", error);
            throw error;
        }
    }

    /**
     * Get available LLM models
     */
    async getAvailableModels() {
        try {
            const response = await fetch(`${this.llmBaseURL}/models`);

            if (!response.ok) {
                throw new Error(`Models fetch failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Models fetch error:", error);
            return [];
        }
    }

    /**
     * Get default model
     */
    async getDefaultModel() {
        try {
            const response = await fetch(`${this.llmBaseURL}/models/default`);

            if (!response.ok) {
                throw new Error(`Default model fetch failed: ${response.status}`);
            }

            const data = await response.json();
            return data.model;
        } catch (error) {
            console.error("Default model fetch error:", error);
            return null;
        }
    }

    /**
     * Check LLM health status
     */
    async checkHealth() {
        try {
            const response = await fetch(`${this.llmBaseURL}/health`);

            if (!response.ok) {
                throw new Error(`Health check failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("LLM health check error:", error);
            return { status: "unhealthy", error: error.message };
        }
    }

    /**
     * Generate general analysis for different contexts
     */
    async generateAnalysis(prompt, context = {}) {
        const analysisPrompt = `You are an expert sports betting analyst. ${prompt}

Context: ${JSON.stringify(context)}

Provide a clear, concise analysis focusing on the key factors and their implications.`;

        try {
            const response = await this.generateText(analysisPrompt, {
                maxTokens: 300,
                temperature: 0.6,
            });

            return {
                content: response,
                timestamp: new Date(),
            };
        } catch (error) {
            console.error("Analysis generation error:", error);
            throw error;
        }
    }

    /**
     * Process PropOllama chat messages with context-aware responses
     */
    async processChatMessage(message, context = {}) {
        const { previousMessages = [], gameData = {}, userPreferences = {} } = context;

        // Build context-aware prompt
        let prompt = `You are PropOllama, an elite AI sports betting assistant. You have access to real-time sports data and betting analytics.

Current Context:
- User preferences: ${JSON.stringify(userPreferences)}
- Available game data: ${Object.keys(gameData).length} games
- Chat history length: ${previousMessages.length} messages

User message: "${message}"

Please provide a helpful, accurate response with:
- Specific betting recommendations when appropriate
- Confidence levels for predictions
- Data-backed analysis
- Actionable insights
- Follow-up suggestions

Keep responses conversational but professional.`;

        try {
            const response = await this.generateText(prompt, {
                maxTokens: 600,
                temperature: 0.7,
            });

            // Parse response for suggestions
            const suggestions = this.extractSuggestions(response);

            return {
                content: response,
                suggestions,
                timestamp: new Date(),
            };
        } catch (error) {
            console.error("Chat processing error:", error);
            return {
                content: "I'm having trouble connecting to my analysis engine right now. Please try again in a moment.",
                suggestions: ["Check system status", "Retry request", "Contact support"],
                timestamp: new Date(),
            };
        }
    }

    /**
     * Extract suggestion prompts from LLM response
     */
    extractSuggestions(response) {
        // Look for common patterns that suggest follow-up questions
        const suggestions = [];

        if (response.includes("analyz")) {
            suggestions.push("Analyze more games");
        }
        if (response.includes("confident") || response.includes("confidence")) {
            suggestions.push("Show highest confidence picks");
        }
        if (response.includes("value") || response.includes("edge")) {
            suggestions.push("Find more value bets");
        }
        if (response.includes("trend") || response.includes("pattern")) {
            suggestions.push("Show trending patterns");
        }
        if (response.includes("line") || response.includes("movement")) {
            suggestions.push("Track line movements");
        }

        return suggestions.slice(0, 4); // Limit to 4 suggestions
    }

    /**
     * Stream text generation for real-time responses
     */
    async *streamText(prompt, options = {}) {
        const response = await this.generateText(prompt, { ...options, stream: true });

        if (!response.body) {
            throw new Error("Streaming not supported");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                yield chunk;
            }
        } finally {
            reader.releaseLock();
        }
    }
}

// Export singleton instance
export const llmService = new LLMService();
export default llmService;
