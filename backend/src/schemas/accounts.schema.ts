import { z } from 'zod';

export const createAccountSchema = z.object({
  name: z.string().min(1),
  due_date: z.string().optional().nullable(),
  amount: z.number().optional(),
});

export const updateAccountSchema = z.object({
  name: z.string().min(1).optional(),
  due_date: z.string().optional().nullable(),
  amount: z.number().optional(),
  notes: z.string().optional().nullable(),
});

export const payAccountSchema = z.object({
  notes: z.string().optional(),
  paid_at: z.string().optional(),
});
