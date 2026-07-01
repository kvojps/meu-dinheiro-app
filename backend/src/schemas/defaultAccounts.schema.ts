import { z } from 'zod';

export const createDefaultAccountSchema = z.object({
  name: z.string().min(1),
  due_day: z.number().int().min(1).max(31).optional().nullable(),
  amount: z.number().optional(),
});

export const updateDefaultAccountSchema = z.object({
  name: z.string().min(1).optional(),
  due_day: z.number().int().min(1).max(31).optional().nullable(),
  amount: z.number().optional(),
});
