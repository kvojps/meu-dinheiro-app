import { z } from 'zod';

export const createMonthSchema = z.object({
  year: z.number().int().optional(),
  month: z.number().int().min(1).max(12).optional(),
});

export const createMonthsBatchSchema = z.object({
  fromYear: z.number().int(),
  fromMonth: z.number().int().min(1).max(12),
  toYear: z.number().int(),
  toMonth: z.number().int().min(1).max(12),
});
