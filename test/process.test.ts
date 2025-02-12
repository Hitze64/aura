import { llmMockProcess } from '../lib/utils/mockedAI'
import { processAddress } from '../lib/utils/portfolio'
import { simplePrompt } from '../lib/utils/prompts'

describe('Process address tests', () => {
    test('process address', async () => {
        const res = await processAddress({
            address: '0x69bfD720Dd188B8BB04C4b4D24442D3c15576D10',
            getPortfolio: () =>
                Promise.resolve([
                    {
                        network: 'ethereum',
                        tokens: [
                            {
                                address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                                balance: 50.0,
                                balanceUSD: 49.99,
                                symbol: 'USDC',
                                network: 'ethereum'
                            }
                        ]
                    }
                ]),
            makePrompt: simplePrompt,
            llmProcessor: llmMockProcess
        })
        expect(res).toHaveProperty('address')
        expect(res).toHaveProperty('portfolio')
        expect(res).toHaveProperty('strategies')
    })
})
