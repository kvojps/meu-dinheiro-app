import { Router, Request, Response } from 'express';
import { getDatabase } from '../database';

const router = Router();

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

router.post('/setup', (req: Request, res: Response) => {
  const { initialMonth, initialYear } = req.body;
  const db = getDatabase();

  if (!initialMonth || !initialYear) {
    return res.status(400).json({ error: 'initialMonth and initialYear are required' });
  }

  const existing = db.prepare('SELECT COUNT(*) as count FROM months').get() as { count: number };
  if (existing.count > 0) {
    return res.status(400).json({ error: 'Setup already completed. Months already exist.' });
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const createdMonths: { id: number; label: string; year: number; month: number }[] = [];
  let year = initialYear;
  let month = initialMonth;

  const insertMonth = db.prepare('INSERT INTO months (label, year, month) VALUES (?, ?, ?)');
  const getDefaults = db.prepare('SELECT * FROM default_accounts').all() as any[];
  const insertAccount = db.prepare(
    'INSERT INTO accounts (month_id, name, due_date, amount) VALUES (?, ?, ?, ?)'
  );

  const transaction = db.transaction(() => {
    while (year < currentYear || (year === currentYear && month <= currentMonth)) {
      const label = `${MONTH_NAMES[month - 1]}/${year}`;
      const result = insertMonth.run(label, year, month);
      const monthId = result.lastInsertRowid as number;

      for (const def of getDefaults) {
        const dueDate = def.due_day
          ? `${year}-${String(month).padStart(2, '0')}-${String(def.due_day).padStart(2, '0')}`
          : null;
        insertAccount.run(monthId, def.name, dueDate, def.amount);
      }

      createdMonths.push({ id: monthId, label, year, month });

      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }
  });

  transaction();

  res.json({ months: createdMonths });
});

export default router;
