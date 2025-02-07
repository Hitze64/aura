import { GoogleGenerativeAI } from '@google/generative-ai'
import { LlmProcessOutput, LlmProcessProps, Strategy } from '../types'

export const GEMINI_MODELS = {
    // TODO: more pre-config models
    gemini20flashExp: 'gemini-2.0-flash-exp'
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export async function askGemini(llmInput: LlmProcessProps): Promise<LlmProcessOutput> {
    const prompt = JSON.stringify(llmInput.portfolio)

    try {
        const aiModel = genAI.getGenerativeModel({
            model: GEMINI_MODELS.gemini20flashExp
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
