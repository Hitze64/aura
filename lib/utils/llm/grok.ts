import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'
import { LlmProcessOutput, LlmProcessProps, Strategy } from '../../types'

export const XAI_MODELS = {
    grok2latest: 'grok-2-latest'
}

const apiClient = new OpenAI({
    apiKey: process.env.X_AI_API_KEY || '',
    baseURL: 'https://api.x.ai/v1'
})

const ActionSchema = z.object({
    tokens: z.string({
        description:
            'Comma-separated list of symbols of the involved crypto currencies or tokens, for example: USDC, ETH'
    }),
    description: z.string({
        description: 'Free text describing the action concerning the related tokens'
    })
})

const StrategySchema = z.object({
    name: z.string({ description: 'Name of the strategy' }),
    risk: z.enum(['low', 'medium', 'high'], { description: 'Risk level of the strategy' }),
    actions: z.array(ActionSchema, { description: 'List of actions for the strategy' })
})

const schema = z.object({
    strategies: z.array(StrategySchema, { description: 'List of strategies' })
})

export async function callGrok(llmInput: LlmProcessProps): Promise<LlmProcessOutput> {
    const completion = await apiClient.chat.completions.create({
        model: llmInput.model || XAI_MODELS.grok2latest,
        store: true,
        messages: [
            {
                role: 'system',
                content:
                    'You are an expert in cryptocurrencies, DeFi applications and their use cases. Return output in JSON format.'
            },
            { role: 'user', content: llmInput.prompt }
        ],
        response_format: zodResponseFormat(schema, 'strategies')
    })

    const outputContent = completion.choices[0].message.content || '{}'

    try {
        const parsed = JSON.parse(outputContent) as { strategies: Strategy[] }
        return parsed.strategies || []
    } catch (error) {
        console.error('Invalid JSON in Grok output: ', error)
        return null
    }
}
