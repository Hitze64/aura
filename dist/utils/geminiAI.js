"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GEMINI_MODELS = void 0;
exports.askGemini = askGemini;
const generative_ai_1 = require("@google/generative-ai");
exports.GEMINI_MODELS = {
    // TODO: more pre-config models
    gemini20flashExp: 'gemini-2.0-flash-exp'
};
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
const actionSchema = {
    type: generative_ai_1.SchemaType.OBJECT,
    properties: {
        tokens: {
            type: generative_ai_1.SchemaType.STRING,
            description: 'Comma-separated list of symbols of the involved tokens, for example: USDC, ETH',
            nullable: false
        },
        description: {
            type: generative_ai_1.SchemaType.STRING,
            description: 'Free text describing the action',
            nullable: false
        }
    },
    required: ['tokens', 'description']
};
const strategySchema = {
    type: generative_ai_1.SchemaType.OBJECT,
    properties: {
        name: {
            type: generative_ai_1.SchemaType.STRING,
            description: 'Name of the strategy',
            nullable: false
        },
        risk: {
            type: generative_ai_1.SchemaType.STRING,
            description: 'Risk level of the strategy',
            nullable: false,
            enum: ['low', 'medium', 'high']
        },
        actions: {
            description: 'List of actions for the strategy',
            type: generative_ai_1.SchemaType.ARRAY,
            items: actionSchema
        }
    },
    required: ['name', 'risk', 'actions']
};
const schema = {
    description: 'List of strategies',
    type: generative_ai_1.SchemaType.ARRAY,
    items: strategySchema
};
async function askGemini(llmInput) {
    try {
        const aiModel = genAI.getGenerativeModel({
            model: exports.GEMINI_MODELS.gemini20flashExp,
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: schema
            }
        });
        const result = await aiModel.generateContent(llmInput.prompt);
        // console.log(JSON.stringify(result))
        const content = result.response.text();
        try {
            return JSON.parse(content || '[]');
        }
        catch (error) {
            console.error('Invalid JSON in Gemini AI output: ', error);
            return null;
        }
    }
    catch (error) {
        console.error(`Error querying Gemini AI: ${error}`);
        return null;
    }
}
//# sourceMappingURL=geminiAI.js.map