import { z } from 'zod';
export declare const ActionZodSchema: z.ZodObject<{
    tokens: z.ZodString;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tokens: string;
    description: string;
}, {
    tokens: string;
    description: string;
}>;
export declare const StrategyZodSchema: z.ZodObject<{
    name: z.ZodString;
    risk: z.ZodEnum<["low", "moderate", "high", "opportunistic"]>;
    actions: z.ZodArray<z.ZodObject<{
        tokens: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        tokens: string;
        description: string;
    }, {
        tokens: string;
        description: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    risk: "low" | "moderate" | "high" | "opportunistic";
    actions: {
        tokens: string;
        description: string;
    }[];
}, {
    name: string;
    risk: "low" | "moderate" | "high" | "opportunistic";
    actions: {
        tokens: string;
        description: string;
    }[];
}>;
export declare const StrategiesZodSchema: z.ZodObject<{
    strategies: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        risk: z.ZodEnum<["low", "moderate", "high", "opportunistic"]>;
        actions: z.ZodArray<z.ZodObject<{
            tokens: z.ZodString;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            tokens: string;
            description: string;
        }, {
            tokens: string;
            description: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        risk: "low" | "moderate" | "high" | "opportunistic";
        actions: {
            tokens: string;
            description: string;
        }[];
    }, {
        name: string;
        risk: "low" | "moderate" | "high" | "opportunistic";
        actions: {
            tokens: string;
            description: string;
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    strategies: {
        name: string;
        risk: "low" | "moderate" | "high" | "opportunistic";
        actions: {
            tokens: string;
            description: string;
        }[];
    }[];
}, {
    strategies: {
        name: string;
        risk: "low" | "moderate" | "high" | "opportunistic";
        actions: {
            tokens: string;
            description: string;
        }[];
    }[];
}>;
//# sourceMappingURL=zod.d.ts.map