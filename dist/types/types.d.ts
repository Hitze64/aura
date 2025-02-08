export type PortfolioToken = {
    address: string;
    balance: number;
    balanceUSD: number;
    symbol: string;
    network: string;
};
export type PortfolioForNetwork = {
    network: string;
    tokens: PortfolioToken[];
};
export declare enum StrategyRisk {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}
export type StrategyAction = {
    tokens: string;
    description: string;
};
export type Strategy = {
    name: string;
    risk: StrategyRisk;
    actions: StrategyAction[];
};
export type LlmProcessProps = {
    portfolio: PortfolioForNetwork[];
};
export type LlmProcessOutput = Strategy[] | null;
export type ProcessAddressProps = {
    address: string;
    getPortfolio: (address: string) => Promise<PortfolioForNetwork[]>;
    llmProcessor: (props: LlmProcessProps) => Promise<Strategy[] | null>;
};
export type AuraResponse_01 = {
    address: string;
    portfolio: PortfolioForNetwork[];
    strategies: LlmProcessOutput;
};
//# sourceMappingURL=types.d.ts.map