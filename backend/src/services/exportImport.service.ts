import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import unzipper from 'unzipper';
import { AppError } from '../errors/AppError';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

export function getExportData(db: Database.Database) {
  return {
    version: 1,
    exported_at: new Date().toISOString(),
    default_expenses: db.prepare('SELECT * FROM default_expenses').all(),
    bank_accounts: db.prepare('SELECT * FROM bank_accounts').all(),
    months: db.prepare('SELECT * FROM months ORDER BY year, month').all(),
    expenses: db.prepare('SELECT * FROM expenses ORDER BY month_id').all(),
  };
}

export async function importFromZipBuffer(db: Database.Database, buffer: Buffer): Promise<void> {
  const tempDir = path.join(__dirname, '../../temp_import_' + Date.now());
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    const directory = await unzipper.Open.buffer(buffer);
    await directory.extract({ path: tempDir });

    const dataPath = path.join(tempDir, 'data.json');
    if (!fs.existsSync(dataPath)) {
      throw new AppError(400, 'data.json não encontrado no ZIP');
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Backups exportados antes da renomeação "contas" -> "despesas" usam as chaves antigas.
    const expenses = data.expenses ?? data.accounts;
    const defaultExpenses = data.default_expenses ?? data.default_accounts ?? [];
    // Backups anteriores à criação das contas bancárias não têm essa chave.
    const bankAccounts = data.bank_accounts ?? [];

    if (!data.version || !data.months || !expenses) {
      throw new AppError(400, 'Formato de dados inválido');
    }

    db.pragma('foreign_keys = OFF');
    try {
      const run = db.transaction(() => {
        db.exec('DELETE FROM expenses');
        db.exec('DELETE FROM default_expenses');
        db.exec('DELETE FROM bank_accounts');
        db.exec('DELETE FROM months');

        const insertDefault = db.prepare(
          'INSERT INTO default_expenses (name, due_day, amount) VALUES (?, ?, ?)'
        );
        for (const exp of defaultExpenses) {
          insertDefault.run(exp.name, exp.due_day, exp.amount);
        }

        const insertBankAccount = db.prepare(
          'INSERT INTO bank_accounts (id, name, balance) VALUES (?, ?, ?)'
        );
        for (const acc of bankAccounts) {
          insertBankAccount.run(acc.id, acc.name, acc.balance);
        }

        const insertMonth = db.prepare(
          'INSERT INTO months (id, label, year, month) VALUES (?, ?, ?, ?)'
        );
        for (const m of data.months) {
          insertMonth.run(m.id, m.label, m.year, m.month);
        }

        const insertExpense = db.prepare(
          `INSERT INTO expenses (id, month_id, name, due_date, amount, is_paid, paid_at, receipt, notes, bank_account_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );
        for (const e of expenses) {
          insertExpense.run(
            e.id,
            e.month_id,
            e.name,
            e.due_date,
            e.amount,
            e.is_paid,
            e.paid_at,
            e.receipt,
            e.notes,
            e.bank_account_id ?? null
          );
        }
      });

      run();
    } finally {
      db.pragma('foreign_keys = ON');
    }

    const uploadsSource = path.join(tempDir, 'uploads');
    if (fs.existsSync(uploadsSource)) {
      const files = fs.readdirSync(uploadsSource);
      for (const file of files) {
        fs.copyFileSync(path.join(uploadsSource, file), path.join(UPLOADS_DIR, file));
      }
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}
