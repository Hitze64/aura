"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategiesZodSchema = exports.StrategyZodSchema = exports.ActionZodSchema = void 0;
const zod_1 = require("zod");
exports.ActionZodSchema = zod_1.z.object({
    tokens: zod_1.z.string({
        description: 'Comma-separated list of symbols of the involved crypto currencies or tokens, for example: USDC, ETH'
    }),
    description: zod_1.z.string({
        description: 'Free text describing the action concerning the related tokens'
    })
});
exports.StrategyZodSchema = zod_1.z.object({
    name: zod_1.z.string({ description: 'Name of the strategy' }),
    risk: zod_1.z.enum(['low', 'medium', 'high'], { description: 'Risk level of the strategy' }),
    actions: zod_1.z.array(exports.ActionZodSchema, { description: 'List of actions for the strategy' })
});
exports.StrategiesZodSchema = zod_1.z.object({
    strategies: zod_1.z.array(exports.StrategyZodSchema, { description: 'List of strategies' })
});
//# sourceMappingURL=zod.js.map