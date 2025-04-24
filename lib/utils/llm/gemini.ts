import { GoogleGenerativeAI } from '@google/generative-ai'
import { LlmProcessOutput, LlmProcessProps, Strategy } from '../../types'
import { stringifyError } from '../errors'
import { StrategiesGoogleSchema } from './structures/google'

export const GEMINI_MODELS = {
    gemini20flashExp: 'gemini-2.0-flash-exp',
    gemini25proPreview: 'gemini-2.5-pro-preview-03-25'
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export async function callGemini(llmInput: LlmProcessProps): Promise<LlmProcessOutput> {
    let output = null
    let error = null
    const model = llmInput.model || GEMINI_MODELS.gemini20flashExp

    try {
        const aiModel = genAI.getGenerativeModel({
            model,
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: StrategiesGoogleSchema
            },
            ...llmInput.llmOptionsOverride
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
