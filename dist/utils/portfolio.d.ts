import { Strategy, ProcessAddressProps, LlmProcessProps, AuraResponse_01 } from '../types'
export declare function getPortfolioVelcro(address: string): Promise<
    {
        data: {
            tokens: import('../types').PortfolioToken[]
            nfts: any
            identity: string
            network: string
        }
        error: Error
        success: true
    }[]
>
export declare function llmMockProcess({ portfolio }: LlmProcessProps): Promise<Strategy[] | null>
export declare const processAddress: ({
    address,
    getPortfolio,
    llmProcessor
}?: ProcessAddressProps) => Promise<AuraResponse_01>
//# sourceMappingURL=portfolio.d.ts.map
