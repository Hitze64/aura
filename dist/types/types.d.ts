export type PortfolioToken = {
    balance: number
    balanceUSD: number
    symbol: string
}
export type Portfolio = {
    data: {
        tokens: PortfolioToken[]
        nfts: any
        identity: string
        network: string
    }
    error: Error
    success: boolean
}
export declare enum StrategyRisk {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}
export type StrategyAction = {
    tokens: string
    description: string
}
export type Strategy = {
    name: string
    risk: StrategyRisk
    actions: StrategyAction[]
}
export type LlmProcessProps = {
    portfolio: Portfolio[]
}
export type ProcessAddressProps = {
    address: string
    getPortfolio: (address: string) => Promise<Portfolio[]>
    llmProcessor: (props: LlmProcessProps) => Promise<Strategy[] | null>
}
export type AuraResponse_01 = {
    address: string
    portfolio: Portfolio[]
    strategies: Strategy[] | null
}
//# sourceMappingURL=types.d.ts.map
