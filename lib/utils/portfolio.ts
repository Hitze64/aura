import fetch from 'node-fetch'
import { networks } from 'ambire-common/dist/src/consts/networks'
import { getRpcProvider } from 'ambire-common/dist/src/services/provider/getRpcProvider'
import { Portfolio } from 'ambire-common/dist/src/libs/portfolio'
import { llmMockProcess } from './llm/mockedAI'
import { simplePrompt } from './prompts'
import { EMPTY_PORTFOLIO_STRATEGIES } from './strategies'
import {
    PortfolioForNetwork,
    ProcessAddressProps,
    AuraResponse_01,
    NetworkPortfolioLibResponse
} from '../types'

// import { z } from 'zod'
// import { ACTION_OPERATION_TYPES, RISK_TYPES } from '..'
// import { zodResponseFormat } from 'openai/helpers/zod'

//  const ActionZodSchema = z.object({
//     tokens: z.string({
//         description:
//             'Comma-separated list of symbols of the involved crypto currencies or tokens, for example: USDC, ETH'
//     }),
//     description: z.string({
//         description: 'Free text describing the action concerning the related tokens, the platform to use and expected APY'
//     }),
//     platforms: z.array(
//         z.string({
//             description: 'DeFi platform name'
//         }),
//         { description: 'The DeFi platform(s) which is to be used for the action' }
//     ),
//     networks: z.array(
//         z.string({
//             description: 'Lower-cased name of blockchain network'
//         }),
//         {
//             description:
//                 'The name of the blockchain network(s) which the action is to be executed on'
//         }
//     ),
//     operations: z.array(z.enum(ACTION_OPERATION_TYPES, { description: 'DeFi operation type' }), {
//         description: 'The DeFi operation type(s) used of the action'
//     }),
//     apy: z.string({
//         description:
//             'The annual yield that can be expected from this action. Example values: 3%, 5%, 8-10%'
//     })
// })

//  const StrategyZodSchema = z.object({
//     name: z.string({ description: 'Name of the strategy' }),
//     risk: z.enum(RISK_TYPES, {
//         description: 'Risk level of the strategy'
//     }),
//     actions: z.array(ActionZodSchema, { description: 'List of actions for the strategy' })
// })

//  const StrategiesZodSchema = z.object({
//     strategies: z.array(StrategyZodSchema, { description: 'List of strategies' })
// })

export async function getPortfolioForNetwork(
    address: string,
    networkId: string
): Promise<NetworkPortfolioLibResponse> {
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

export async function getPortfolioVelcroV3(address: string): Promise<PortfolioForNetwork[]> {
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

export const processAddress = async (
    {
        address,
        getPortfolio,
        makePrompt,
        llmProcessor,
        model,
        llmOptionsOverride
    }: ProcessAddressProps = {
        address: '0x69bfD720Dd188B8BB04C4b4D24442D3c15576D10',
        getPortfolio: getPortfolioVelcroV3,
        makePrompt: simplePrompt,
        llmProcessor: llmMockProcess
    }
): Promise<AuraResponse_01> => {
    const portfolio = await getPortfolio(address)

    if (!portfolio.length) {
        return {
            address,
            portfolio,
            strategies: [
                {
                    llm: {
                        provider: 'local',
                        model: 'local'
                    },
                    response: EMPTY_PORTFOLIO_STRATEGIES
                }
            ]
        }
    }

    const prompt = await makePrompt({ portfolio })
    const strategies = await llmProcessor({ prompt, model, llmOptionsOverride })

    return {
        address,
        portfolio,
        strategies: [strategies]
    }
}
