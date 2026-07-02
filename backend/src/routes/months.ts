import { Router, Request, Response } from 'express';
import { getDatabase } from '../database';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateBody } from '../middleware/validate';
import { parseId } from '../utils/parseId';
import { createMonthSchema, createMonthsBatchSchema } from '../schemas/months.schema';
import * as monthsService from '../services/months.service';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const db = getDatabase();
    res.json(monthsService.listMonths(db));
  })
);

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const id = parseId(req.params.id);
    res.json(monthsService.getMonthWithExpenses(db, id));
  })
);

router.post(
  '/',
  validateBody(createMonthSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const created = monthsService.createNextMonth(db, req.body.year, req.body.month);
    res.status(201).json(created);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const id = parseId(req.params.id);
    monthsService.deleteMonth(db, id);
    res.json({ message: 'Month deleted' });
  })
);

router.post(
  '/batch',
  validateBody(createMonthsBatchSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const { fromYear, fromMonth, toYear, toMonth } = req.body;
    const result = monthsService.createMonthsBatch(db, fromYear, fromMonth, toYear, toMonth);
    res.status(201).json(result);
  })
);

export default router;
