import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { getDatabase } from '../database';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateBody } from '../middleware/validate';
import { parseId } from '../utils/parseId';
import {
  createExpenseSchema,
  updateExpenseSchema,
  payExpenseSchema,
} from '../schemas/expenses.schema';
import * as expensesService from '../services/expenses.service';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req: any, file, cb) => {
    const db = getDatabase();
    const expense = expensesService.getExpenseForFilename(db, req.params.id);
    const monthPart = (
      expense?.month_label?.replace(/[^a-zA-Z0-9-]/g, '_') || 'unknown'
    ).toLowerCase();
    const namePart = (expense?.name?.replace(/[^a-zA-Z0-9-]/g, '_') || 'unknown').toLowerCase();
    // O id garante unicidade: duas despesas com mesmo nome no mesmo mês não devem
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

router.get(
  '/months/:monthId/expenses',
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const monthId = parseId(req.params.monthId);
    res.json(expensesService.listExpensesForMonth(db, monthId));
  })
);

router.post(
  '/months/:monthId/expenses',
  validateBody(createExpenseSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const monthId = parseId(req.params.monthId);
    const created = expensesService.createExpense(db, monthId, req.body);
    res.status(201).json(created);
  })
);

router.put(
  '/expenses/:id',
  validateBody(updateExpenseSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const id = parseId(req.params.id);
    res.json(expensesService.updateExpense(db, id, req.body));
  })
);

router.delete(
  '/expenses/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const id = parseId(req.params.id);
    expensesService.deleteExpense(db, id);
    res.json({ message: 'Expense deleted' });
  })
);

router.put(
  '/expenses/:id/pay',
  upload.single('receipt'),
  validateBody(payExpenseSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const id = parseId(req.params.id);
    const receipt = req.file ? req.file.filename : undefined;
    res.json(
      expensesService.payExpense(
        db,
        id,
        receipt,
        req.body.notes,
        req.body.paid_at,
        req.body.bank_account_id
      )
    );
  })
);

router.put(
  '/expenses/:id/unpay',
  asyncHandler(async (req: Request, res: Response) => {
    const db = getDatabase();
    const id = parseId(req.params.id);
    res.json(expensesService.unpayExpense(db, id));
  })
);

export default router;
