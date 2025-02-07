import { GoogleGenerativeAI, Schema, SchemaType } from '@google/generative-ai'
import { LlmProcessOutput, LlmProcessProps, Strategy } from '../types'

export const GEMINI_MODELS = {
    // TODO: more pre-config models
    gemini20flashExp: 'gemini-2.0-flash-exp'
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

const actionSchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
        tokens: {
            type: SchemaType.STRING,
            description:
                'Comma-separated list of symbols of the involved tokens, for example: USDC, ETH',
            nullable: false
        },
        description: {
            type: SchemaType.STRING,
            description: 'Free text describing the action',
            nullable: false
        }
    },
    required: ['tokens', 'description']
}

const strategySchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
        name: {
            type: SchemaType.STRING,
            description: 'Name of the strategy',
            nullable: false
        },
        risk: {
            type: SchemaType.STRING,
            description: 'Risk level of the strategy',
            nullable: false,
            enum: ['low', 'medium', 'high']
        },
        actions: {
            description: 'List of actions for the strategy',
            type: SchemaType.ARRAY,
            items: actionSchema
        }
    },
    required: ['name', 'risk', 'actions']
}

const schema = {
    description: 'List of strategies',
    type: SchemaType.ARRAY,
    items: strategySchema
}

export async function askGemini(llmInput: LlmProcessProps): Promise<LlmProcessOutput> {
    const prompt = JSON.stringify(llmInput.portfolio)

    try {
        const aiModel = genAI.getGenerativeModel({
            model: GEMINI_MODELS.gemini20flashExp,
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: schema
            }
        })
        const result = await aiModel.generateContent(prompt)
        // console.log(JSON.stringify(result))

        const content = result.response.text()

        try {
            return JSON.parse(content || '[]') as Strategy[]
        } catch (error) {
            console.error('Invalid JSON in Gemini AI output: ', error)
            return null
        }
    } catch (error) {
        console.error(`Error querying Gemini AI: ${error}`)
        return null
    }
}
