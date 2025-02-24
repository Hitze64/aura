import OpenAI from 'openai'
import { LlmProcessOutput, LlmProcessProps, Strategy } from 'aura'

export const XAI_MODELS = {
    grok2latest: 'grok-2-latest'
}

const apiClient = new OpenAI({
    apiKey: process.env.X_AI_API_KEY || '',
    baseURL: 'https://api.x.ai/v1'
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
        ]
    })

    const outputContent = completion.choices[0].message.content || '[]'

    try {
        return JSON.parse(outputContent.replace(/```json|```/g, '').trim()) as Strategy[]
    } catch (error) {
        console.error('Invalid JSON in Claude AI output: ', error)
        return null
    }
}
