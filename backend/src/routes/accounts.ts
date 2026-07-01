import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { getDatabase } from '../database';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateBody } from '../middleware/validate';
import { parseId } from '../utils/parseId';
import { createAccountSchema, updateAccountSchema, payAccountSchema } from '../schemas/accounts.schema';
import * as accountsService from '../services/accounts.service';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req: any, file, cb) => {
    const db = getDatabase();
    const account = accountsService.getAccountForFilename(db, req.params.id);
    const monthPart = (account?.month_label?.replace(/[^a-zA-Z0-9-]/g, '_') || 'unknown').toLowerCase();
    const namePart = (account?.name?.replace(/[^a-zA-Z0-9-]/g, '_') || 'unknown').toLowerCase();
    // O id garante unicidade: duas contas com mesmo nome no mesmo mês não devem
    // sobrescrever o comprovante uma da outra.
    cb(null, `${monthPart}-${namePart}-${req.params.id}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext || mime) {
      cb(null, true);
    } else {
      cb(new Error('Only image files and PDFs are allowed'));
    }
  },
});

const router = Router();

router.get('/months/:monthId/accounts', asyncHandler(async (req: Request, res: Response) => {
  const db = getDatabase();
  const monthId = parseId(req.params.monthId);
  res.json(accountsService.listAccountsForMonth(db, monthId));
}));

router.post('/months/:monthId/accounts', validateBody(createAccountSchema), asyncHandler(async (req: Request, res: Response) => {
  const db = getDatabase();
  const monthId = parseId(req.params.monthId);
  const created = accountsService.createAccount(db, monthId, req.body);
  res.status(201).json(created);
}));

router.put('/accounts/:id', validateBody(updateAccountSchema), asyncHandler(async (req: Request, res: Response) => {
  const db = getDatabase();
  const id = parseId(req.params.id);
  res.json(accountsService.updateAccount(db, id, req.body));
}));

router.delete('/accounts/:id', asyncHandler(async (req: Request, res: Response) => {
  const db = getDatabase();
  const id = parseId(req.params.id);
  accountsService.deleteAccount(db, id);
  res.json({ message: 'Account deleted' });
}));

router.put('/accounts/:id/pay', upload.single('receipt'), validateBody(payAccountSchema), asyncHandler(async (req: Request, res: Response) => {
  const db = getDatabase();
  const id = parseId(req.params.id);
  const receipt = req.file ? req.file.filename : undefined;
  res.json(accountsService.payAccount(db, id, receipt, req.body.notes));
}));

router.put('/accounts/:id/unpay', asyncHandler(async (req: Request, res: Response) => {
  const db = getDatabase();
  const id = parseId(req.params.id);
  res.json(accountsService.unpayAccount(db, id));
}));

export default router;
