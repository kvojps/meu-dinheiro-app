import { Router, Request, Response } from 'express';
import multer from 'multer';
const { ZipArchive } = require('archiver');
import path from 'path';
import fs from 'fs';
import { getDatabase } from '../database';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../errors/AppError';
import { getExportData, importFromZipBuffer } from '../services/exportImport.service';

const router = Router();
const UPLOADS_DIR = path.join(__dirname, '../../uploads');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

router.get(
  '/export',
  asyncHandler(async (_req: Request, res: Response) => {
    const db = getDatabase();
    const data = getExportData(db);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=export-money-manager.zip');

    const archive = new ZipArchive({ zlib: { level: 9 } });
    archive.pipe(res);
    archive.append(JSON.stringify(data, null, 2), { name: 'data.json' });

    if (fs.existsSync(UPLOADS_DIR)) {
      archive.directory(UPLOADS_DIR, 'uploads');
    }

    await archive.finalize();
  })
);

router.post(
  '/import',
  upload.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError(400, 'Nenhum arquivo enviado');
    }

    const db = getDatabase();
    await importFromZipBuffer(db, req.file.buffer);
    res.json({ message: 'Dados importados com sucesso' });
  })
);

export default router;
