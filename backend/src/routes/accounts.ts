import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getDatabase } from '../database';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req: any, file, cb) => {
    const db = getDatabase();
    const account = db.prepare('SELECT a.*, m.label as month_label FROM accounts a JOIN months m ON a.month_id = m.id WHERE a.id = ?').get(req.params.id) as any;
    const monthPart = (account?.month_label?.replace(/[^a-zA-Z0-9-]/g, '_') || 'unknown').toLowerCase();
    const namePart = (account?.name?.replace(/[^a-zA-Z0-9-]/g, '_') || 'unknown').toLowerCase();
    cb(null, `${monthPart}-${namePart}${path.extname(file.originalname)}`);
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

router.get('/months/:monthId/accounts', (req: Request, res: Response) => {
  const db = getDatabase();
  const accounts = db.prepare(
    'SELECT * FROM accounts WHERE month_id = ? ORDER BY due_date, name'
  ).all(req.params.monthId);
  res.json(accounts);
});

router.post('/months/:monthId/accounts', (req: Request, res: Response) => {
  const { name, due_date, amount } = req.body;
  const db = getDatabase();

  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  const month = db.prepare('SELECT * FROM months WHERE id = ?').get(req.params.monthId);
  if (!month) {
    return res.status(404).json({ error: 'Month not found' });
  }

  const result = db.prepare(
    'INSERT INTO accounts (month_id, name, due_date, amount) VALUES (?, ?, ?, ?)'
  ).run(req.params.monthId, name, due_date || null, amount || 0);

  const created = db.prepare('SELECT * FROM accounts WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

router.put('/accounts/:id', (req: Request, res: Response) => {
  const { name, due_date, amount, notes } = req.body;
  const db = getDatabase();

  const existing = db.prepare('SELECT * FROM accounts WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Account not found' });
  }

  db.prepare(
    'UPDATE accounts SET name = ?, due_date = ?, amount = ?, notes = ? WHERE id = ?'
  ).run(
    name ?? (existing as any).name,
    due_date !== undefined ? due_date : (existing as any).due_date,
    amount !== undefined ? amount : (existing as any).amount,
    notes !== undefined ? notes : (existing as any).notes,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM accounts WHERE id = ?').get(req.params.id);
  res.json(updated);
});

router.delete('/accounts/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const existing = db.prepare('SELECT * FROM accounts WHERE id = ?').get(req.params.id) as any;
  if (!existing) {
    return res.status(404).json({ error: 'Account not found' });
  }

  if (existing.receipt) {
    const filePath = path.join(__dirname, '../../uploads', existing.receipt);
    fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Erro ao excluir comprovante:', err);
      }
    });
  }

  db.prepare('DELETE FROM accounts WHERE id = ?').run(req.params.id);
  res.json({ message: 'Account deleted' });
});

router.put('/accounts/:id/pay', upload.single('receipt'), (req: Request, res: Response) => {
  const db = getDatabase();
  const existing = db.prepare('SELECT * FROM accounts WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Account not found' });
  }

  const receipt = req.file ? req.file.filename : (existing as any).receipt;
  const notes = req.body.notes !== undefined ? req.body.notes : (existing as any).notes;

  db.prepare(
    'UPDATE accounts SET is_paid = 1, paid_at = datetime(\'now\'), receipt = ?, notes = ? WHERE id = ?'
  ).run(receipt, notes, req.params.id);

  const updated = db.prepare('SELECT * FROM accounts WHERE id = ?').get(req.params.id);
  res.json(updated);
});

router.put('/accounts/:id/unpay', (req: Request, res: Response) => {
  const db = getDatabase();
  const existing = db.prepare('SELECT * FROM accounts WHERE id = ?').get(req.params.id) as any;
  if (!existing) {
    return res.status(404).json({ error: 'Account not found' });
  }

  if (existing.receipt) {
    const filePath = path.join(__dirname, '../../uploads', existing.receipt);
    fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Erro ao excluir comprovante:', err);
      }
    });
  }

  db.prepare(
    'UPDATE accounts SET is_paid = 0, paid_at = NULL, receipt = NULL WHERE id = ?'
  ).run(req.params.id);

  const updated = db.prepare('SELECT * FROM accounts WHERE id = ?').get(req.params.id);
  res.json(updated);
});

export default router;
