import { Router, Request, Response } from 'express';
import { getDatabase } from '../database';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateBody } from '../middleware/validate';
import { parseId } from '../utils/parseId';
import {
  createIncomeSchema,
  updateIncomeSchema,
  receiveIncomeSchema,
} from '../schemas/incomes.schema';
import * as incomesService from '../services/incomes.service';

const router = Router();

router.get(
  '/months/:monthId/incomes',
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const monthId = parseId(req.params.monthId);
    res.json(incomesService.listIncomesForMonth(db, monthId));
  })
);

router.post(
  '/months/:monthId/incomes',
  validateBody(createIncomeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const monthId = parseId(req.params.monthId);
    const created = incomesService.createIncome(db, monthId, req.body);
    res.status(201).json(created);
  })
);

router.put(
  '/incomes/:id',
  validateBody(updateIncomeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const id = parseId(req.params.id);
    res.json(incomesService.updateIncome(db, id, req.body));
  })
);

router.delete(
  '/incomes/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const id = parseId(req.params.id);
    incomesService.deleteIncome(db, id);
    res.json({ message: 'Income deleted' });
  })
);

router.put(
  '/incomes/:id/receive',
  validateBody(receiveIncomeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const id = parseId(req.params.id);
    res.json(
      incomesService.receiveIncome(
        db,
        id,
        req.body.notes,
        req.body.received_at,
        req.body.bank_account_id
      )
    );
  })
);

router.put(
  '/incomes/:id/unreceive',
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const id = parseId(req.params.id);
    res.json(incomesService.unreceiveIncome(db, id));
  })
);

export default router;
