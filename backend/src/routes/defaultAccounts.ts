import { Router, Request, Response } from 'express';
import { getDatabase } from '../database';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const db = getDatabase();
  const accounts = db.prepare('SELECT * FROM default_accounts ORDER BY name COLLATE NOCASE').all();
  res.json(accounts);
});

router.post('/', (req: Request, res: Response) => {
  const { name, due_day, amount } = req.body;
  const db = getDatabase();

  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  const result = db.prepare(
    'INSERT INTO default_accounts (name, due_day, amount) VALUES (?, ?, ?)'
  ).run(name, due_day || null, amount || 0);

  const defaultId = result.lastInsertRowid as number;

  const months = db.prepare('SELECT * FROM months').all() as any[];
  const insertAccount = db.prepare(
    'INSERT INTO accounts (month_id, name, due_date, amount) VALUES (?, ?, ?, ?)'
  );

  const transaction = db.transaction(() => {
    for (const month of months) {
      const dueDate = due_day
        ? `${month.year}-${String(month.month).padStart(2, '0')}-${String(due_day).padStart(2, '0')}`
        : null;
      insertAccount.run(month.id, name, dueDate, amount || 0);
    }
  });

  transaction();

  const created = db.prepare('SELECT * FROM default_accounts WHERE id = ?').get(defaultId);
  res.status(201).json(created);
});

router.put('/:id', (req: Request, res: Response) => {
  const { name, due_day, amount } = req.body;
  const db = getDatabase();

  const existing = db.prepare('SELECT * FROM default_accounts WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Default account not found' });
  }

  db.prepare(
    'UPDATE default_accounts SET name = ?, due_day = ?, amount = ? WHERE id = ?'
  ).run(
    name ?? (existing as any).name,
    due_day !== undefined ? due_day : (existing as any).due_day,
    amount !== undefined ? amount : (existing as any).amount,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM default_accounts WHERE id = ?').get(req.params.id);
  res.json(updated);
});

router.delete('/:id', (req: Request, res: Response) => {
  const db = getDatabase();

  const existing = db.prepare('SELECT * FROM default_accounts WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Default account not found' });
  }

  db.prepare('DELETE FROM default_accounts WHERE id = ?').run(req.params.id);
  res.json({ message: 'Default account deleted' });
});

export default router;
