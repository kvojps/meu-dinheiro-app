import { Router, Request, Response } from 'express';
import { getDatabase } from '../database';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateBody } from '../middleware/validate';
import { parseId } from '../utils/parseId';
import {
  createDefaultExpenseSchema,
  updateDefaultExpenseSchema,
} from '../schemas/defaultExpenses.schema';
import * as defaultExpensesService from '../services/defaultExpenses.service';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const db = getDatabase();
    res.json(defaultExpensesService.listDefaultExpenses(db));
  })
);

router.post(
  '/',
  validateBody(createDefaultExpenseSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const created = defaultExpensesService.createDefaultExpense(db, req.body);
    res.status(201).json(created);
  })
);

router.put(
  '/:id',
  validateBody(updateDefaultExpenseSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const id = parseId(req.params.id);
    res.json(defaultExpensesService.updateDefaultExpense(db, id, req.body));
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const id = parseId(req.params.id);
    defaultExpensesService.deleteDefaultExpense(db, id);
    res.json({ message: 'Default expense deleted' });
  })
);

export default router;
