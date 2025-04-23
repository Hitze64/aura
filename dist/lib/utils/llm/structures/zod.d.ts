import { z } from 'zod';
export declare const ActionZodSchema: z.ZodObject<{
    tokens: z.ZodString;
    description: z.ZodString;
    platforms: z.ZodArray<z.ZodString, "many">;
    networks: z.ZodArray<z.ZodString, "many">;
    operations: z.ZodArray<z.ZodEnum<["staking", "lending", "borrowing", "liquidity provision", "yield farming", "governance farming", "bridging"]>, "many">;
    apy: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tokens: string;
    description: string;
    platforms: string[];
    networks: string[];
    operations: ("staking" | "lending" | "borrowing" | "liquidity provision" | "yield farming" | "governance farming" | "bridging")[];
    apy: string;
}, {
    tokens: string;
    description: string;
    platforms: string[];
    networks: string[];
    operations: ("staking" | "lending" | "borrowing" | "liquidity provision" | "yield farming" | "governance farming" | "bridging")[];
    apy: string;
}>;
export declare const StrategyZodSchema: z.ZodObject<{
    name: z.ZodString;
    risk: z.ZodEnum<["low", "moderate", "high", "opportunistic"]>;
    actions: z.ZodArray<z.ZodObject<{
        tokens: z.ZodString;
        description: z.ZodString;
        platforms: z.ZodArray<z.ZodString, "many">;
        networks: z.ZodArray<z.ZodString, "many">;
        operations: z.ZodArray<z.ZodEnum<["staking", "lending", "borrowing", "liquidity provision", "yield farming", "governance farming", "bridging"]>, "many">;
        apy: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        tokens: string;
        description: string;
        platforms: string[];
        networks: string[];
        operations: ("staking" | "lending" | "borrowing" | "liquidity provision" | "yield farming" | "governance farming" | "bridging")[];
        apy: string;
    }, {
        tokens: string;
        description: string;
        platforms: string[];
        networks: string[];
        operations: ("staking" | "lending" | "borrowing" | "liquidity provision" | "yield farming" | "governance farming" | "bridging")[];
        apy: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    risk: "low" | "moderate" | "high" | "opportunistic";
    actions: {
        tokens: string;
        description: string;
        platforms: string[];
        networks: string[];
        operations: ("staking" | "lending" | "borrowing" | "liquidity provision" | "yield farming" | "governance farming" | "bridging")[];
        apy: string;
    }[];
}, {
    name: string;
    risk: "low" | "moderate" | "high" | "opportunistic";
    actions: {
        tokens: string;
        description: string;
        platforms: string[];
        networks: string[];
        operations: ("staking" | "lending" | "borrowing" | "liquidity provision" | "yield farming" | "governance farming" | "bridging")[];
        apy: string;
    }[];
}>;
export declare const StrategiesZodSchema: z.ZodObject<{
    strategies: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        risk: z.ZodEnum<["low", "moderate", "high", "opportunistic"]>;
        actions: z.ZodArray<z.ZodObject<{
            tokens: z.ZodString;
            description: z.ZodString;
            platforms: z.ZodArray<z.ZodString, "many">;
            networks: z.ZodArray<z.ZodString, "many">;
            operations: z.ZodArray<z.ZodEnum<["staking", "lending", "borrowing", "liquidity provision", "yield farming", "governance farming", "bridging"]>, "many">;
            apy: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            tokens: string;
            description: string;
            platforms: string[];
            networks: string[];
            operations: ("staking" | "lending" | "borrowing" | "liquidity provision" | "yield farming" | "governance farming" | "bridging")[];
            apy: string;
        }, {
            tokens: string;
            description: string;
            platforms: string[];
            networks: string[];
            operations: ("staking" | "lending" | "borrowing" | "liquidity provision" | "yield farming" | "governance farming" | "bridging")[];
            apy: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        risk: "low" | "moderate" | "high" | "opportunistic";
        actions: {
            tokens: string;
            description: string;
            platforms: string[];
            networks: string[];
            operations: ("staking" | "lending" | "borrowing" | "liquidity provision" | "yield farming" | "governance farming" | "bridging")[];
            apy: string;
        }[];
    }, {
        name: string;
        risk: "low" | "moderate" | "high" | "opportunistic";
        actions: {
            tokens: string;
            description: string;
            platforms: string[];
            networks: string[];
            operations: ("staking" | "lending" | "borrowing" | "liquidity provision" | "yield farming" | "governance farming" | "bridging")[];
            apy: string;
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    strategies: {
        name: string;
        risk: "low" | "moderate" | "high" | "opportunistic";
        actions: {
            tokens: string;
            description: string;
            platforms: string[];
            networks: string[];
            operations: ("staking" | "lending" | "borrowing" | "liquidity provision" | "yield farming" | "governance farming" | "bridging")[];
            apy: string;
        }[];
    }[];
}, {
    strategies: {
        name: string;
        risk: "low" | "moderate" | "high" | "opportunistic";
        actions: {
            tokens: string;
            description: string;
            platforms: string[];
            networks: string[];
            operations: ("staking" | "lending" | "borrowing" | "liquidity provision" | "yield farming" | "governance farming" | "bridging")[];
            apy: string;
        }[];
    }[];
}>;
//# sourceMappingURL=zod.d.ts.map