import { z } from '../zod';
export declare const betSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    eventId: z.ZodString;
    amount: z.ZodNumber;
    odds: z.ZodNumber;
    type: z.ZodEnum<["single", "parlay", "system"]>;
    placedAt: z.ZodString;
    status: z.ZodEnum<["pending", "won", "lost", "void"]>;
}, "strip", z.ZodTypeAny, {
    odds: number;
    id: string;
    type: "system" | "single" | "parlay";
    status: "pending" | "won" | "lost" | "void";
    userId: string;
    amount: number;
    placedAt: string;
    eventId: string;
}, {
    odds: number;
    id: string;
    type: "system" | "single" | "parlay";
    status: "pending" | "won" | "lost" | "void";
    userId: string;
    amount: number;
    placedAt: string;
    eventId: string;
}>;
export declare const userSchema: z.ZodObject<{
    id: z.ZodString;
    username: z.ZodString;
    email: z.ZodString;
    createdAt: z.ZodString;
    isActive: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    username: string;
    createdAt: string;
    isActive: boolean;
}, {
    id: string;
    email: string;
    username: string;
    createdAt: string;
    isActive: boolean;
}>;
export declare const predictionSchema: z.ZodObject<{
    id: z.ZodString;
    betId: z.ZodString;
    model: z.ZodString;
    prediction: z.ZodNumber;
    confidence: z.ZodNumber;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    confidence: number;
    id: string;
    createdAt: string;
    prediction: number;
    model: string;
    betId: string;
}, {
    confidence: number;
    id: string;
    createdAt: string;
    prediction: number;
    model: string;
    betId: string;
}>;
export declare const marketSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodString;
    isActive: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    type: string;
    isActive: boolean;
}, {
    id: string;
    name: string;
    type: string;
    isActive: boolean;
}>;
export declare const eventSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    startTime: z.ZodString;
    league: z.ZodString;
    venueId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    venueId: string;
    league: string;
    startTime: string;
}, {
    id: string;
    name: string;
    venueId: string;
    league: string;
    startTime: string;
}>;
import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema, ZodTypeAny } from 'zod';
export declare const validateRequest: (schema: ZodSchema<unknown> | ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
