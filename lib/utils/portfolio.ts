import {
    PortfolioForNetwork,
    Strategy,
    StrategyRisk,
    ProcessAddressProps,
    LlmProcessProps,
    AuraResponse_01
} from '../types'

import { networks } from 'ambire-common/dist/src/consts/networks'
import { getRpcProvider } from 'ambire-common/dist/src/services/provider/getRpcProvider'
import { Portfolio } from 'ambire-common/dist/src/libs/portfolio'

export async function getPortfolioForNetwork(address: string, networkId: string) {
    const network = networks.find((n: any) => n.id === networkId)
    if (!network) throw new Error(`Failed to find ${networkId} in configured networks`)

    const provider = getRpcProvider(network.rpcUrls, network.chainId)
    const portfolio = new Portfolio(
        fetch,
        provider,
        network,
        'https://relayer.ambire.com/velcro-v3'
    )

    return portfolio.get(address, { baseCurrency: 'usd' })
}

export async function getPortfolioVelcroV3(address: string) {
    const output: PortfolioForNetwork[] = []

    const responses = await Promise.all(
        networks.map((network) => getPortfolioForNetwork(address, network.id))
    )

    for (const resp of responses) {
        const tokens = resp.tokens
            .filter((t) => t.amount > 0n)
            .map((t) => {
                const balance = Number(t.amount) / Math.pow(10, t.decimals)
                const priceUSD = (t.priceIn.find((p) => p.baseCurrency === 'usd') || { price: 0 })
                    .price

                return {
                    symbol: t.symbol,
                    balance,
                    balanceUSD: balance * priceUSD,
                    network: t.networkId,
                    address: t.address
                }
            })

        if (!tokens.length) {
            continue
        }

        output.push({
            network: tokens[0].network,
            tokens
        })
    }

    return output
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
        getPortfolio: getPortfolioVelcroV3,
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
