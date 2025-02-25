import { z } from 'zod'

export const ActionZodSchema = z.object({
    tokens: z.string({
        description:
            'Comma-separated list of symbols of the involved crypto currencies or tokens, for example: USDC, ETH'
    }),
    description: z.string({
        description: 'Free text describing the action concerning the related tokens'
    })
})

export const StrategyZodSchema = z.object({
    name: z.string({ description: 'Name of the strategy' }),
    risk: z.enum(['low', 'medium', 'high'], { description: 'Risk level of the strategy' }),
    actions: z.array(ActionZodSchema, { description: 'List of actions for the strategy' })
})

export const StrategiesZodSchema = z.object({
    strategies: z.array(StrategyZodSchema, { description: 'List of strategies' })
})
