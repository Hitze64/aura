import {
    Portfolio,
    Strategy,
    StrategyRisk,
    ProcessAddressProps,
    LlmProcessProps,
    AuraResponse_01
} from '../types'

export async function getPortfolioVelcro(address: string) {
    const resp = await fetch(`https://velcro.ambire.com/v2/balance/${address}/ethereum`)
    if (resp.ok) {
        const { data, error, success } = (await resp.json()) as Portfolio

        if (!success) {
            throw new Error(`relayer call failed: ${error.message}`)
        }

        return [{ data, error, success }]
    } else {
        throw new Error(`relayer call failed: ${resp.status}, ${resp.statusText}`)
    }
}

export async function llmMockProcess({ portfolio }: LlmProcessProps): Promise<Strategy[] | null> {
    console.log({ portfolio })
    return [
        {
            actions: [
                {
                    description:
                        'Stake ADX on the AdEx platform for a steady yield. This is a relatively low-risk option.',
                    tokens: 'ADX'
                }
            ],
            name: 'ADX Staking',
            risk: StrategyRisk.LOW
        },
        {
            actions: [
                {
                    description: `Use the 0.031 ETH to provide liquidity on a decentralized exchange (DEX) like Uniswap or Sushiswap in an ETH-paired pool. 
                Choose a pool with sufficient volume but be aware of impermanent loss risks. 
                 Pairing with a stable coin will be lower risk, while an alt-coin will be higher risk.`,
                    tokens: 'ETH'
                }
            ],
            name: 'DEX Liquidity Provision',
            risk: StrategyRisk.MEDIUM
        },
        {
            actions: [
                {
                    description: `Bridge a portion of the 0.031 ETH to a Layer-2 network (e.g. Arbitrum or Optimism) and explore higher-yield farming opportunities. 
                Look for reputable protocols on L2s, and exercise caution with high APY offers as they usually carry higher risks. 
                 A smaller portion of ETH should be used for exploring high risk/high reward options.`,
                    tokens: 'ETH'
                }
            ],
            name: 'L2 Yield Farming',
            risk: StrategyRisk.HIGH
        }
    ]
}

export const processAddress = async (
    { address, getPortfolio, llmProcessor }: ProcessAddressProps = {
        address: '0x69bfD720Dd188B8BB04C4b4D24442D3c15576D10',
        getPortfolio: getPortfolioVelcro,
        llmProcessor: llmMockProcess
    }
): Promise<AuraResponse_01> => {
    const portfolio = await getPortfolio(address)
    const strategies = await llmProcessor({ portfolio })

    return {
        address,
        portfolio,
        strategies
    }
}
