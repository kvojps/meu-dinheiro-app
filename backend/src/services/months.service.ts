import Database from 'better-sqlite3';
import { AppError } from '../errors/AppError';
import { monthLabel, formatDueDate } from '../constants/monthNames';

export interface MonthRow {
  id: number;
  label: string;
  year: number;
  month: number;
  created_at: string;
}

interface DefaultExpenseRow {
  id: number;
  name: string;
  due_day: number | null;
  amount: number;
}

function insertExpensesFromDefaults(
  db: Database.Database,
  monthId: number,
  year: number,
  month: number
) {
  const defaults = db.prepare('SELECT * FROM default_expenses').all() as DefaultExpenseRow[];
  const insertExpense = db.prepare(
    'INSERT INTO expenses (month_id, name, due_date, amount) VALUES (?, ?, ?, ?)'
  );
  for (const def of defaults) {
    insertExpense.run(monthId, def.name, formatDueDate(year, month, def.due_day), def.amount);
  }
}

export function findMonthByYearMonth(db: Database.Database, year: number, month: number) {
  return db.prepare('SELECT id FROM months WHERE year = ? AND month = ?').get(year, month) as
    { id: number } | undefined;
}

export function createMonthWithDefaults(
  db: Database.Database,
  year: number,
  month: number
): MonthRow {
  const label = monthLabel(year, month);

  const create = db.transaction(() => {
    const result = db
      .prepare('INSERT INTO months (label, year, month) VALUES (?, ?, ?)')
      .run(label, year, month);
    const monthId = result.lastInsertRowid as number;
    insertExpensesFromDefaults(db, monthId, year, month);
    return monthId;
  });

  const monthId = create();
  return db.prepare('SELECT * FROM months WHERE id = ?').get(monthId) as MonthRow;
}

export function ensureCurrentMonthExists(db: Database.Database) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  if (!findMonthByYearMonth(db, year, month)) {
    createMonthWithDefaults(db, year, month);
  }
}

export function listMonths(db: Database.Database) {
  ensureCurrentMonthExists(db);

  return db
    .prepare(
      `
    SELECT m.*,
      COUNT(e.id) as total_expenses,
      COALESCE(SUM(CASE WHEN e.is_paid = 1 THEN 1 ELSE 0 END), 0) as paid_expenses,
      COALESCE(SUM(CASE WHEN e.is_paid = 1 THEN e.amount ELSE 0 END), 0) as paid_amount,
      COALESCE(SUM(CASE WHEN e.is_paid = 0 THEN e.amount ELSE 0 END), 0) as unpaid_amount,
      COALESCE(SUM(e.amount), 0) as total_amount,
      COALESCE(SUM(CASE WHEN e.is_paid = 0 AND e.due_date IS NOT NULL AND e.due_date < date('now') THEN 1 ELSE 0 END), 0) as overdue_expenses,
      COALESCE(SUM(CASE WHEN e.is_paid = 0 AND e.due_date IS NOT NULL AND e.due_date < date('now') THEN e.amount ELSE 0 END), 0) as overdue_amount
    FROM months m
    LEFT JOIN expenses e ON e.month_id = m.id
    GROUP BY m.id
    ORDER BY m.year DESC, m.month DESC
  `
    )
    .all();
}

export function getMonthWithExpenses(db: Database.Database, id: number) {
  const month = db.prepare('SELECT * FROM months WHERE id = ?').get(id) as MonthRow | undefined;
  if (!month) {
    throw new AppError(404, 'Month not found');
  }

  const expenses = db
    .prepare(
      `SELECT e.*, ba.name as bank_account_name
       FROM expenses e
       LEFT JOIN bank_accounts ba ON ba.id = e.bank_account_id
       WHERE e.month_id = ?
       ORDER BY e.due_date, e.name`
    )
    .all(id);

  return { ...month, expenses };
}

export function createNextMonth(db: Database.Database, year?: number, month?: number): MonthRow {
  if (!year || !month) {
    const lastMonth = db
      .prepare('SELECT * FROM months ORDER BY year DESC, month DESC LIMIT 1')
      .get() as { year: number; month: number } | undefined;

    if (!lastMonth) {
      throw new AppError(400, 'No months exist. Use setup first.');
    }

    year = lastMonth.year;
    month = lastMonth.month + 1;
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  if (findMonthByYearMonth(db, year, month)) {
    throw new AppError(400, 'Month already exists');
  }

  return createMonthWithDefaults(db, year, month);
}

export function deleteMonth(db: Database.Database, id: number) {
  const existing = db.prepare('SELECT id FROM months WHERE id = ?').get(id);
  if (!existing) {
    throw new AppError(404, 'Month not found');
  }
  db.prepare('DELETE FROM months WHERE id = ?').run(id);
}

export function createMonthsBatch(
  db: Database.Database,
  fromYear: number,
  fromMonth: number,
  toYear: number,
  toMonth: number
) {
  const created: MonthRow[] = [];
  const errors: string[] = [];
  let year = fromYear;
  let month = fromMonth;

  const run = db.transaction(() => {
    while (year < toYear || (year === toYear && month <= toMonth)) {
      if (findMonthByYearMonth(db, year, month)) {
        errors.push(`${monthLabel(year, month)} já existe`);
      } else {
        created.push(createMonthWithDefaults(db, year, month));
      }

      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }
  });

  run();

  return { created, errors };
}
