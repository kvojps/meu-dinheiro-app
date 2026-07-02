import { Router, Request, Response } from 'express';
import { getDatabase } from '../database';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateBody } from '../middleware/validate';
import { parseId } from '../utils/parseId';
import {
  createDefaultIncomeSchema,
  updateDefaultIncomeSchema,
} from '../schemas/defaultIncomes.schema';
import * as defaultIncomesService from '../services/defaultIncomes.service';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const db = getDatabase();
    res.json(defaultIncomesService.listDefaultIncomes(db));
  })
);

router.post(
  '/',
  validateBody(createDefaultIncomeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const created = defaultIncomesService.createDefaultIncome(db, req.body);
    res.status(201).json(created);
  })
);

router.put(
  '/:id',
  validateBody(updateDefaultIncomeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const id = parseId(req.params.id);
    res.json(defaultIncomesService.updateDefaultIncome(db, id, req.body));
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const id = parseId(req.params.id);
    defaultIncomesService.deleteDefaultIncome(db, id);
    res.json({ message: 'Default income deleted' });
  })
);

export default router;
