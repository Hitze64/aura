import { PortfolioForNetwork, Strategy, ProcessAddressProps, LlmProcessProps, AuraResponse_01 } from '../types';
export declare function getPortfolioForNetwork(address: string, networkId: string): Promise<import("ambire-common/dist/src/libs/portfolio/interfaces").PortfolioLibGetResult>;
export declare function getPortfolioVelcroV3(address: string): Promise<PortfolioForNetwork[]>;
export declare function llmMockProcess({ portfolio }: LlmProcessProps): Promise<Strategy[] | null>;
export declare const processAddress: ({ address, getPortfolio, llmProcessor }?: ProcessAddressProps) => Promise<AuraResponse_01>;
//# sourceMappingURL=portfolio.d.ts.map