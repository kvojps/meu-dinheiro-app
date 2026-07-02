import { Router, Request, Response } from 'express';
import { getDatabase } from '../database';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateBody } from '../middleware/validate';
import { parseId } from '../utils/parseId';
import {
  createBankAccountSchema,
  updateBankAccountSchema,
} from '../schemas/bankAccounts.schema';
import * as bankAccountsService from '../services/bankAccounts.service';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const db = getDatabase();
    res.json(bankAccountsService.listBankAccounts(db));
  })
);

router.post(
  '/',
  validateBody(createBankAccountSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const created = bankAccountsService.createBankAccount(db, req.body);
    res.status(201).json(created);
  })
);

router.put(
  '/:id',
  validateBody(updateBankAccountSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const id = parseId(req.params.id);
    res.json(bankAccountsService.updateBankAccount(db, id, req.body));
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const id = parseId(req.params.id);
    bankAccountsService.deleteBankAccount(db, id);
    res.json({ message: 'Bank account deleted' });
  })
);

export default router;
