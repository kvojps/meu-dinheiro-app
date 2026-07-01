import { Router, Request, Response } from 'express';
import { getDatabase } from '../database';

const router = Router();

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

router.get('/', (req: Request, res: Response) => {
  const db = getDatabase();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const exists = db.prepare(
    'SELECT id FROM months WHERE year = ? AND month = ?'
  ).get(currentYear, currentMonth);
  if (!exists) {
    createMonth(db, currentYear, currentMonth);
  }

  const months = db.prepare(`
    SELECT m.*,
      COUNT(a.id) as total_accounts,
      COALESCE(SUM(CASE WHEN a.is_paid = 1 THEN 1 ELSE 0 END), 0) as paid_accounts,
      COALESCE(SUM(a.amount), 0) as total_amount
    FROM months m
    LEFT JOIN accounts a ON a.month_id = m.id
    GROUP BY m.id
    ORDER BY m.year DESC, m.month DESC
  `).all();
  res.json(months);
});

router.get('/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const month = db.prepare('SELECT * FROM months WHERE id = ?').get(req.params.id);
  if (!month) {
    return res.status(404).json({ error: 'Month not found' });
  }

  const accounts = db.prepare(
    'SELECT * FROM accounts WHERE month_id = ? ORDER BY due_date, name'
  ).all(req.params.id);

  res.json({ ...month as any, accounts });
});

router.post('/', (req: Request, res: Response) => {
  const db = getDatabase();

  const lastMonth = db.prepare(
    'SELECT * FROM months ORDER BY year DESC, month DESC LIMIT 1'
  ).get() as { year: number; month: number } | undefined;

  let year = req.body.year;
  let month = req.body.month;

  if (!year || !month) {
    if (!lastMonth) {
      return res.status(400).json({ error: 'No months exist. Use setup first.' });
    }
    year = lastMonth.year;
    month = lastMonth.month + 1;
    if (month > 12) { month = 1; year++; }
  }

  const exists = db.prepare(
    'SELECT id FROM months WHERE year = ? AND month = ?'
  ).get(year, month) as { id: number } | undefined;
  if (exists) {
    return res.status(400).json({ error: 'Month already exists' });
  }

  const created = createMonth(db, year, month);

  res.status(201).json(created);
});

router.delete('/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const existing = db.prepare('SELECT * FROM months WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Month not found' });
  }
  db.prepare('DELETE FROM months WHERE id = ?').run(req.params.id);
  res.json({ message: 'Month deleted' });
});

router.post('/batch', (req: Request, res: Response) => {
  const { fromYear, fromMonth, toYear, toMonth } = req.body;
  const db = getDatabase();

  if (!fromYear || !fromMonth || !toYear || !toMonth) {
    return res.status(400).json({ error: 'fromYear, fromMonth, toYear, toMonth are required' });
  }

  const created: any[] = [];
  const errors: string[] = [];
  let year = fromYear;
  let month = fromMonth;

  const insertMonth = db.prepare(
    'INSERT INTO months (label, year, month) VALUES (?, ?, ?)'
  );
  const insertAccount = db.prepare(
    'INSERT INTO accounts (month_id, name, due_date, amount) VALUES (?, ?, ?, ?)'
  );
  const checkExists = db.prepare(
    'SELECT id FROM months WHERE year = ? AND month = ?'
  );
  const getDefaults = db.prepare('SELECT * FROM default_accounts').all() as any[];

  const transaction = db.transaction(() => {
    while (year < toYear || (year === toYear && month <= toMonth)) {
      const exists = checkExists.get(year, month);
      if (exists) {
        errors.push(`${MONTH_NAMES[month - 1]}/${year} já existe`);
      } else {
        const label = `${MONTH_NAMES[month - 1]}/${year}`;
        const result = insertMonth.run(label, year, month);
        const monthId = result.lastInsertRowid as number;

        for (const def of getDefaults) {
          const dueDate = def.due_day
            ? `${year}-${String(month).padStart(2, '0')}-${String(def.due_day).padStart(2, '0')}`
            : null;
          insertAccount.run(monthId, def.name, dueDate, def.amount);
        }

        created.push({ id: monthId, label, year, month });
      }

      month++;
      if (month > 12) { month = 1; year++; }
    }
  });

  transaction();

  res.status(201).json({ created, errors });
});

function createMonth(db: any, year: number, month: number) {
  const label = `${MONTH_NAMES[month - 1]}/${year}`;
  const defaults = db.prepare('SELECT * FROM default_accounts').all() as any[];

  const insertAccount = db.prepare(
    'INSERT INTO accounts (month_id, name, due_date, amount) VALUES (?, ?, ?, ?)'
  );

  const transaction = db.transaction(() => {
    const result = db.prepare(
      'INSERT INTO months (label, year, month) VALUES (?, ?, ?)'
    ).run(label, year, month);
    const monthId = result.lastInsertRowid as number;

    for (const def of defaults) {
      const dueDate = def.due_day
        ? `${year}-${String(month).padStart(2, '0')}-${String(def.due_day).padStart(2, '0')}`
        : null;
      insertAccount.run(monthId, def.name, dueDate, def.amount);
    }

    return monthId;
  });

  const monthId = transaction();

  return db.prepare('SELECT * FROM months WHERE id = ?').get(monthId);
}

export default router;
