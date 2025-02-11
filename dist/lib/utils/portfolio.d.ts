import { PortfolioForNetwork, ProcessAddressProps, AuraResponse_01 } from '../types';
export declare function getPortfolioForNetwork(address: string, networkId: string): Promise<import("ambire-common/dist/src/libs/portfolio/interfaces").PortfolioLibGetResult>;
export declare function getPortfolioVelcroV3(address: string): Promise<PortfolioForNetwork[]>;
export declare const processAddress: ({ address, getPortfolio, makePrompt, llmProcessor }?: ProcessAddressProps) => Promise<AuraResponse_01>;
//# sourceMappingURL=portfolio.d.ts.map