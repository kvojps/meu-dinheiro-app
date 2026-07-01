import { Router, Request, Response } from 'express';
import { getDatabase } from '../database';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateBody } from '../middleware/validate';
import { setupSchema } from '../schemas/setup.schema';
import { runSetup } from '../services/setup.service';

const router = Router();

router.post('/setup', validateBody(setupSchema), asyncHandler(async (req: Request, res: Response) => {
  const db = getDatabase();
  const months = runSetup(db, req.body.initialYear, req.body.initialMonth);
  res.json({ months });
}));

export default router;
