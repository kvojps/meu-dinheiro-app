import { Router, Request, Response } from 'express';
import { getDatabase } from '../database';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateBody } from '../middleware/validate';
import { parseId } from '../utils/parseId';
import { createDefaultAccountSchema, updateDefaultAccountSchema } from '../schemas/defaultAccounts.schema';
import * as defaultAccountsService from '../services/defaultAccounts.service';

const router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const db = getDatabase();
  res.json(defaultAccountsService.listDefaultAccounts(db));
}));

router.post('/', validateBody(createDefaultAccountSchema), asyncHandler(async (req: Request, res: Response) => {
  const db = getDatabase();
  const created = defaultAccountsService.createDefaultAccount(db, req.body);
  res.status(201).json(created);
}));

router.put('/:id', validateBody(updateDefaultAccountSchema), asyncHandler(async (req: Request, res: Response) => {
  const db = getDatabase();
  const id = parseId(req.params.id);
  res.json(defaultAccountsService.updateDefaultAccount(db, id, req.body));
}));

router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const db = getDatabase();
  const id = parseId(req.params.id);
  defaultAccountsService.deleteDefaultAccount(db, id);
  res.json({ message: 'Default account deleted' });
}));

export default router;
