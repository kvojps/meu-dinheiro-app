import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { AppError } from '../errors/AppError';
import * as bankAccountsService from './bankAccounts.service';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

export interface ExpenseRow {
  id: number;
  month_id: number;
  name: string;
  due_date: string | null;
  amount: number;
  is_paid: number;
  paid_at: string | null;
  receipt: string | null;
  notes: string | null;
  bank_account_id: number | null;
  created_at: string;
}

export function listExpensesForMonth(db: Database.Database, monthId: number) {
  return db
    .prepare(
      `SELECT e.*, ba.name as bank_account_name
       FROM expenses e
       LEFT JOIN bank_accounts ba ON ba.id = e.bank_account_id
       WHERE e.month_id = ?
       ORDER BY e.due_date, e.name`
    )
    .all(monthId) as (ExpenseRow & { bank_account_name: string | null })[];
}

export function getExpenseById(db: Database.Database, id: number): ExpenseRow {
  const expense = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id) as
    ExpenseRow | undefined;
  if (!expense) {
    throw new AppError(404, 'Expense not found');
  }
  return expense;
}

export function getExpenseForFilename(db: Database.Database, id: number | string) {
  return db
    .prepare(
      'SELECT e.*, m.label as month_label FROM expenses e JOIN months m ON e.month_id = m.id WHERE e.id = ?'
    )
    .get(id) as (ExpenseRow & { month_label: string }) | undefined;
}

export function createExpense(
  db: Database.Database,
  monthId: number,
  data: { name: string; due_date?: string | null; amount?: number }
): ExpenseRow {
  const month = db.prepare('SELECT id FROM months WHERE id = ?').get(monthId);
  if (!month) {
    throw new AppError(404, 'Month not found');
  }

  const result = db
    .prepare('INSERT INTO expenses (month_id, name, due_date, amount) VALUES (?, ?, ?, ?)')
    .run(monthId, data.name, data.due_date || null, data.amount || 0);

  return db
    .prepare('SELECT * FROM expenses WHERE id = ?')
    .get(result.lastInsertRowid) as ExpenseRow;
}

export function updateExpense(
  db: Database.Database,
  id: number,
  data: { name?: string; due_date?: string | null; amount?: number; notes?: string | null }
): ExpenseRow {
  const existing = getExpenseById(db, id);

  db.prepare('UPDATE expenses SET name = ?, due_date = ?, amount = ?, notes = ? WHERE id = ?').run(
    data.name ?? existing.name,
    data.due_date !== undefined ? data.due_date : existing.due_date,
    data.amount !== undefined ? data.amount : existing.amount,
    data.notes !== undefined ? data.notes : existing.notes,
    id
  );

  return getExpenseById(db, id);
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

export function deleteExpense(db: Database.Database, id: number) {
  const existing = getExpenseById(db, id);
  deleteReceiptFile(existing.receipt);
  db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
}

function todayLocalDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;
}

export function payExpense(
  db: Database.Database,
  id: number,
  receipt: string | undefined,
  notes: string | undefined,
  paidAt: string | undefined,
  bankAccountId: number | undefined
): ExpenseRow {
  const existing = getExpenseById(db, id);

  const run = db.transaction(() => {
    if (bankAccountId) {
      bankAccountsService.debitBankAccount(db, bankAccountId, existing.amount);
    }
    db.prepare(
      'UPDATE expenses SET is_paid = 1, paid_at = ?, receipt = ?, notes = ?, bank_account_id = ? WHERE id = ?'
    ).run(
      paidAt || todayLocalDate(),
      receipt ?? existing.receipt,
      notes !== undefined ? notes : existing.notes,
      bankAccountId ?? null,
      id
    );
  });
  run();

  return getExpenseById(db, id);
}

export function unpayExpense(db: Database.Database, id: number): ExpenseRow {
  const existing = getExpenseById(db, id);
  deleteReceiptFile(existing.receipt);

  const run = db.transaction(() => {
    if (existing.bank_account_id) {
      bankAccountsService.creditBankAccount(db, existing.bank_account_id, existing.amount);
    }
    db.prepare(
      'UPDATE expenses SET is_paid = 0, paid_at = NULL, receipt = NULL, bank_account_id = NULL WHERE id = ?'
    ).run(id);
  });
  run();

  return getExpenseById(db, id);
}
