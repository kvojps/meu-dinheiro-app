import Database from 'better-sqlite3';
import { AppError } from '../errors/AppError';
import { formatDueDate } from '../constants/monthNames';

export interface DefaultAccountRow {
  id: number;
  name: string;
  due_day: number | null;
  amount: number;
  created_at: string;
}

export function listDefaultAccounts(db: Database.Database) {
  return db.prepare('SELECT * FROM default_accounts ORDER BY name').all() as DefaultAccountRow[];
}

export function createDefaultAccount(
  db: Database.Database,
  data: { name: string; due_day?: number | null; amount?: number }
): DefaultAccountRow {
  const create = db.transaction(() => {
    const result = db
      .prepare('INSERT INTO default_accounts (name, due_day, amount) VALUES (?, ?, ?)')
      .run(data.name, data.due_day || null, data.amount || 0);

    const defaultId = result.lastInsertRowid as number;

    const months = db.prepare('SELECT * FROM months').all() as {
      id: number;
      year: number;
      month: number;
    }[];
    const insertAccount = db.prepare(
      'INSERT INTO accounts (month_id, name, due_date, amount) VALUES (?, ?, ?, ?)'
    );
    for (const month of months) {
      insertAccount.run(
        month.id,
        data.name,
        formatDueDate(month.year, month.month, data.due_day),
        data.amount || 0
      );
    }

    return defaultId;
  });

  const defaultId = create();
  return db
    .prepare('SELECT * FROM default_accounts WHERE id = ?')
    .get(defaultId) as DefaultAccountRow;
}

export function getDefaultAccountById(db: Database.Database, id: number): DefaultAccountRow {
  const existing = db.prepare('SELECT * FROM default_accounts WHERE id = ?').get(id) as
    DefaultAccountRow | undefined;
  if (!existing) {
    throw new AppError(404, 'Default account not found');
  }
  return existing;
}

export function updateDefaultAccount(
  db: Database.Database,
  id: number,
  data: { name?: string; due_day?: number | null; amount?: number }
): DefaultAccountRow {
  const existing = getDefaultAccountById(db, id);

  db.prepare('UPDATE default_accounts SET name = ?, due_day = ?, amount = ? WHERE id = ?').run(
    data.name ?? existing.name,
    data.due_day !== undefined ? data.due_day : existing.due_day,
    data.amount !== undefined ? data.amount : existing.amount,
    id
  );

  return getDefaultAccountById(db, id);
}

export function deleteDefaultAccount(db: Database.Database, id: number) {
  getDefaultAccountById(db, id);
  db.prepare('DELETE FROM default_accounts WHERE id = ?').run(id);
}
