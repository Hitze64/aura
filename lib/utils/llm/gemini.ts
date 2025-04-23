import { GoogleGenerativeAI, Schema, SchemaType } from '@google/generative-ai'
import { LlmProcessOutput, LlmProcessProps, Strategy } from '../../types'
import { stringifyError } from '../errors'

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
        },
        platforms: {
            type: SchemaType.ARRAY,
            description: 'The DeFi platform(s) which is to be used for the action',
            items: {
                type: SchemaType.STRING,
                description: 'DeFi platform name',
                nullable: false
            }
        },
        networks: {
            type: SchemaType.ARRAY,
            description:
                'The name of the blockchain network(s) which the action is to be executed on',
            items: {
                type: SchemaType.STRING,
                description: 'Lower-cased name of blockchain network',
                nullable: false
            }
        },
        operations: {
            type: SchemaType.ARRAY,
            description: 'The DeFi operation type(s) used of the action',
            items: {
                type: SchemaType.STRING,
                description: 'DeFi operation type',
                nullable: false,
                enum: [
                    'staking',
                    'lending',
                    'borrowing',
                    'liquidity provision',
                    'yield farming',
                    'governance farming',
                    'bridging'
                ]
            }
        },
        apy: {
            type: SchemaType.STRING,
            description:
                'The annual yield that can be expected from this action. Example values: 3%, 5%, 8-10%',
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
            enum: ['low', 'moderate', 'high', 'opportunistic']
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

export async function callGemini(llmInput: LlmProcessProps): Promise<LlmProcessOutput> {
    let output = null
    let error = null
    const model = llmInput.model || GEMINI_MODELS.gemini20flashExp

    try {
        const aiModel = genAI.getGenerativeModel({
            model,
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: schema
            }
        })
        const result = await aiModel.generateContent(llmInput.prompt)
        // console.log(JSON.stringify(result))

        const content = result.response.text()

        try {
            output = JSON.parse(content || '[]') as Strategy[]
        } catch (err) {
            error = stringifyError(err)
            console.error(`Invalid JSON in Gemini AI output: ${error}`)
        }
    } catch (err) {
        error = stringifyError(err)
        console.error(`Error querying Gemini AI: ${error}`)
    }

    return {
        llm: {
            provider: 'Google',
            model
        },
        response: output,
        error
    }
}
