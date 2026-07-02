import express from 'express';
import cors from 'cors';
import path from 'path';
import { getDatabase } from './database';
import setupRouter from './routes/setup';
import monthsRouter from './routes/months';
import defaultExpensesRouter from './routes/defaultExpenses';
import bankAccountsRouter from './routes/bankAccounts';
import expensesRouter from './routes/expenses';
import exportImportRouter from './routes/exportImport';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

getDatabase();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', setupRouter);
app.use('/api/months', monthsRouter);
app.use('/api/default-expenses', defaultExpensesRouter);
app.use('/api/bank-accounts', bankAccountsRouter);
app.use('/api', expensesRouter);
app.use('/api', exportImportRouter);

const frontendDist = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));

app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
