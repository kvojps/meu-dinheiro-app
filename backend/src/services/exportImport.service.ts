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
    default_accounts: db.prepare('SELECT * FROM default_accounts').all(),
    months: db.prepare('SELECT * FROM months ORDER BY year, month').all(),
    accounts: db.prepare('SELECT * FROM accounts ORDER BY month_id').all(),
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

    if (!data.version || !data.months || !data.accounts) {
      throw new AppError(400, 'Formato de dados inválido');
    }

    db.pragma('foreign_keys = OFF');
    try {
      const run = db.transaction(() => {
        db.exec('DELETE FROM accounts');
        db.exec('DELETE FROM default_accounts');
        db.exec('DELETE FROM months');

        const insertDefault = db.prepare(
          'INSERT INTO default_accounts (name, due_day, amount) VALUES (?, ?, ?)'
        );
        for (const acc of data.default_accounts ?? []) {
          insertDefault.run(acc.name, acc.due_day, acc.amount);
        }

        const insertMonth = db.prepare(
          'INSERT INTO months (id, label, year, month) VALUES (?, ?, ?, ?)'
        );
        for (const m of data.months) {
          insertMonth.run(m.id, m.label, m.year, m.month);
        }

        const insertAccount = db.prepare(
          `INSERT INTO accounts (id, month_id, name, due_date, amount, is_paid, paid_at, receipt, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );
        for (const a of data.accounts) {
          insertAccount.run(
            a.id,
            a.month_id,
            a.name,
            a.due_date,
            a.amount,
            a.is_paid,
            a.paid_at,
            a.receipt,
            a.notes
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
