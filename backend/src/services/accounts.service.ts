import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { AppError } from '../errors/AppError';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

export interface AccountRow {
  id: number;
  month_id: number;
  name: string;
  due_date: string | null;
  amount: number;
  is_paid: number;
  paid_at: string | null;
  receipt: string | null;
  notes: string | null;
  created_at: string;
}

export function listAccountsForMonth(db: Database.Database, monthId: number) {
  return db
    .prepare('SELECT * FROM accounts WHERE month_id = ? ORDER BY due_date, name')
    .all(monthId) as AccountRow[];
}

export function getAccountById(db: Database.Database, id: number): AccountRow {
  const account = db.prepare('SELECT * FROM accounts WHERE id = ?').get(id) as
    AccountRow | undefined;
  if (!account) {
    throw new AppError(404, 'Account not found');
  }
  return account;
}

export function getAccountForFilename(db: Database.Database, id: number | string) {
  return db
    .prepare(
      'SELECT a.*, m.label as month_label FROM accounts a JOIN months m ON a.month_id = m.id WHERE a.id = ?'
    )
    .get(id) as (AccountRow & { month_label: string }) | undefined;
}

export function createAccount(
  db: Database.Database,
  monthId: number,
  data: { name: string; due_date?: string | null; amount?: number }
): AccountRow {
  const month = db.prepare('SELECT id FROM months WHERE id = ?').get(monthId);
  if (!month) {
    throw new AppError(404, 'Month not found');
  }

  const result = db
    .prepare('INSERT INTO accounts (month_id, name, due_date, amount) VALUES (?, ?, ?, ?)')
    .run(monthId, data.name, data.due_date || null, data.amount || 0);

  return db
    .prepare('SELECT * FROM accounts WHERE id = ?')
    .get(result.lastInsertRowid) as AccountRow;
}

export function updateAccount(
  db: Database.Database,
  id: number,
  data: { name?: string; due_date?: string | null; amount?: number; notes?: string | null }
): AccountRow {
  const existing = getAccountById(db, id);

  db.prepare('UPDATE accounts SET name = ?, due_date = ?, amount = ?, notes = ? WHERE id = ?').run(
    data.name ?? existing.name,
    data.due_date !== undefined ? data.due_date : existing.due_date,
    data.amount !== undefined ? data.amount : existing.amount,
    data.notes !== undefined ? data.notes : existing.notes,
    id
  );

  return getAccountById(db, id);
}

function deleteReceiptFile(receipt: string | null) {
  if (!receipt) return;
  const filePath = path.join(UPLOADS_DIR, receipt);
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Erro ao excluir comprovante:', err);
    }
  });
}

export function deleteAccount(db: Database.Database, id: number) {
  const existing = getAccountById(db, id);
  deleteReceiptFile(existing.receipt);
  db.prepare('DELETE FROM accounts WHERE id = ?').run(id);
}

function todayLocalDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;
}

export function payAccount(
  db: Database.Database,
  id: number,
  receipt: string | undefined,
  notes: string | undefined,
  paidAt: string | undefined
): AccountRow {
  const existing = getAccountById(db, id);

  db.prepare(
    'UPDATE accounts SET is_paid = 1, paid_at = ?, receipt = ?, notes = ? WHERE id = ?'
  ).run(
    paidAt || todayLocalDate(),
    receipt ?? existing.receipt,
    notes !== undefined ? notes : existing.notes,
    id
  );

  return getAccountById(db, id);
}

export function unpayAccount(db: Database.Database, id: number): AccountRow {
  const existing = getAccountById(db, id);
  deleteReceiptFile(existing.receipt);

  db.prepare('UPDATE accounts SET is_paid = 0, paid_at = NULL, receipt = NULL WHERE id = ?').run(
    id
  );

  return getAccountById(db, id);
}
