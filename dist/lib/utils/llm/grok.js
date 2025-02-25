"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XAI_MODELS = void 0;
exports.callGrok = callGrok;
const tslib_1 = require("tslib");
const openai_1 = tslib_1.__importDefault(require("openai"));
const zod_1 = require("openai/helpers/zod");
const zod_2 = require("./structures/zod");
exports.XAI_MODELS = {
    grok2latest: 'grok-2-latest'
};
const apiClient = new openai_1.default({
    apiKey: process.env.X_AI_API_KEY || '',
    baseURL: 'https://api.x.ai/v1'
});
async function callGrok(llmInput) {
    const completion = await apiClient.chat.completions.create({
        model: llmInput.model || exports.XAI_MODELS.grok2latest,
        store: true,
        messages: [
            {
                role: 'system',
                content: 'You are an expert in cryptocurrencies, DeFi applications and their use cases. Return output in JSON format.'
            },
            { role: 'user', content: llmInput.prompt }
        ],
        response_format: (0, zod_1.zodResponseFormat)(zod_2.StrategiesZodSchema, 'strategies')
    });
    const outputContent = completion.choices[0].message.content || '{}';
    try {
        const parsed = JSON.parse(outputContent);
        return parsed.strategies || [];
    }
    catch (error) {
        console.error('Invalid JSON in Grok output: ', error);
        return null;
    }
}
//# sourceMappingURL=grok.js.map