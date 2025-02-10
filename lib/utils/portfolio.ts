import { PortfolioForNetwork, ProcessAddressProps, AuraResponse_01 } from '../types'

import { networks } from 'ambire-common/dist/src/consts/networks'
import { getRpcProvider } from 'ambire-common/dist/src/services/provider/getRpcProvider'
import { Portfolio } from 'ambire-common/dist/src/libs/portfolio'
import { llmMockProcess } from './mockedAI'
import { simplePrompt } from './prompts'

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

export const processAddress = async (
    { address, getPortfolio, makePrompt, llmProcessor }: ProcessAddressProps = {
        address: '0x69bfD720Dd188B8BB04C4b4D24442D3c15576D10',
        getPortfolio: getPortfolioVelcroV3,
        makePrompt: simplePrompt,
        llmProcessor: llmMockProcess
    }
): Promise<AuraResponse_01> => {
    const portfolio = await getPortfolio(address)
    const prompt = await makePrompt({ portfolio })
    const strategies = await llmProcessor({ prompt })

    return {
        address,
        portfolio,
        strategies
    }
}
