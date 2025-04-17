"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GEMINI_MODELS = void 0;
exports.callGemini = callGemini;
const generative_ai_1 = require("@google/generative-ai");
const errors_1 = require("../errors");
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
            enum: ['low', 'moderate', 'high', 'opportunistic']
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
async function callGemini(llmInput) {
    let output = null;
    let error = null;
    const model = llmInput.model || exports.GEMINI_MODELS.gemini20flashExp;
    try {
        const aiModel = genAI.getGenerativeModel({
            model,
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: schema
            }
        });
        const result = await aiModel.generateContent(llmInput.prompt);
        // console.log(JSON.stringify(result))
        const content = result.response.text();
        try {
            output = JSON.parse(content || '[]');
        }
        catch (err) {
            error = (0, errors_1.stringifyError)(err);
            console.error(`Invalid JSON in Gemini AI output: ${error}`);
        }
    }
    catch (err) {
        error = (0, errors_1.stringifyError)(err);
        console.error(`Error querying Gemini AI: ${error}`);
    }
    return {
        llm: {
            provider: 'Google',
            model
        },
        response: output,
        error
    };
}
//# sourceMappingURL=gemini.js.map