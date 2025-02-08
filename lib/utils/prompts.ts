import { PortfolioForNetwork } from '../types'

export async function simplePrompt(portfolio: PortfolioForNetwork[]): Promise<string> {
    return `Provide investment strategies for a user with the following crypto portfolio: ${JSON.stringify(portfolio)}`
}
