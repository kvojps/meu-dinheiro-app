import { Router, Request, Response } from 'express';
import multer from 'multer';
const { ZipArchive } = require('archiver');
import unzipper from 'unzipper';
import path from 'path';
import fs from 'fs';
import { getDatabase } from '../database';

const router = Router();
const UPLOADS_DIR = path.join(__dirname, '../../uploads');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

router.get('/export', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();

    const data = {
      version: 1,
      exported_at: new Date().toISOString(),
      default_accounts: db.prepare('SELECT * FROM default_accounts').all(),
      months: db.prepare('SELECT * FROM months ORDER BY year, month').all(),
      accounts: db.prepare('SELECT * FROM accounts ORDER BY month_id').all(),
    };

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=export-money-manager.zip');

    const archive = new ZipArchive({ zlib: { level: 9 } });
    archive.pipe(res);

    archive.append(JSON.stringify(data, null, 2), { name: 'data.json' });

    if (fs.existsSync(UPLOADS_DIR)) {
      archive.directory(UPLOADS_DIR, 'uploads');
    }

    await archive.finalize();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/import', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const db = getDatabase();
    const tempDir = path.join(__dirname, '../../temp_import_' + Date.now());
    fs.mkdirSync(tempDir, { recursive: true });

    const directory = await unzipper.Open.buffer(req.file.buffer);
    await directory.extract({ path: tempDir });

    const dataPath = path.join(tempDir, 'data.json');
    if (!fs.existsSync(dataPath)) {
      fs.rmSync(tempDir, { recursive: true });
      return res.status(400).json({ error: 'data.json não encontrado no ZIP' });
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    if (!data.version || !data.months || !data.accounts) {
      fs.rmSync(tempDir, { recursive: true });
      return res.status(400).json({ error: 'Formato de dados inválido' });
    }

    db.pragma('foreign_keys = OFF');

    const transaction = db.transaction(() => {
      db.exec('DELETE FROM accounts');
      db.exec('DELETE FROM default_accounts');
      db.exec('DELETE FROM months');

      const insertDefault = db.prepare(
        'INSERT INTO default_accounts (name, due_day, amount) VALUES (?, ?, ?)'
      );
      for (const acc of data.default_accounts) {
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
          a.id, a.month_id, a.name, a.due_date, a.amount, a.is_paid, a.paid_at, a.receipt, a.notes
        );
      }
    });

    transaction();
    db.pragma('foreign_keys = ON');

    const uploadsSource = path.join(tempDir, 'uploads');
    if (fs.existsSync(uploadsSource)) {
      const files = fs.readdirSync(uploadsSource);
      for (const file of files) {
        const src = path.join(uploadsSource, file);
        const dest = path.join(UPLOADS_DIR, file);
        fs.copyFileSync(src, dest);
      }
    }

    fs.rmSync(tempDir, { recursive: true });

    res.json({ message: 'Dados importados com sucesso' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
