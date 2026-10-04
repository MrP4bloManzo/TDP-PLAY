import { z } from 'zod';

export const predictionSchema = z.object({
  matchId: z.string().min(1),
  market: z.enum(['winner', 'goals', 'btts', 'exact']),
  selection: z.string().min(1).max(40),
  odds: z.number().positive(),
  stake: z.number().int().min(10).max(100_000),
});

export const blackjackStartSchema = z.object({
  bet: z.number().int().min(10).max(100_000),
});

export const blackjackActionSchema = z.object({
  gameId: z.string().min(1),
  action: z.enum(['hit', 'stand', 'double']),
});

export const rouletteSchema = z.object({
  bet: z.number().int().min(10).max(100_000),
  selectionType: z.enum(['red', 'black', 'even', 'odd', 'low', 'high', 'dozen', 'column', 'number']),
  selectionValue: z.string().min(1).max(20),
});
