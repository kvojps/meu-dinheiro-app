import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { BankAccount, Income } from '../types/models';
import { formatCurrencyBRL } from '../utils/format';

interface EditIncomeDialogProps {
  open: boolean;
  income: Income;
  bankAccounts: BankAccount[];
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    amount: number;
    expected_date?: string;
    notes?: string;
    bank_account_id?: number | null;
  }) => Promise<boolean>;
}

export default function EditIncomeDialog({
  open,
  income,
  bankAccounts,
  onClose,
  onSubmit,
}: EditIncomeDialogProps) {
  const [name, setName] = useState(income.name);
  const [amount, setAmount] = useState(income.amount ? String(income.amount) : '');
  const [expectedDate, setExpectedDate] = useState(income.expected_date || '');
  const [notes, setNotes] = useState(income.notes || '');
  const [bankAccountId, setBankAccountId] = useState<number | ''>(income.bank_account_id || '');

  async function handleSubmit() {
    if (!name.trim()) return;
    const success = await onSubmit({
      name: name.trim(),
      amount: amount ? Number(amount) : 0,
      expected_date: expectedDate || undefined,
      notes: notes || undefined,
      bank_account_id: bankAccountId || null,
    });
    if (success) onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Entrada</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Nome"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mt: 1, mb: 2 }}
        />
        <TextField
          label="Valor (R$)"
          type="number"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          helperText="Deixe em branco para valor variável."
          sx={{ mb: 2 }}
        />
        <TextField
          label="Data prevista"
          type="date"
          fullWidth
          value={expectedDate}
          onChange={(e) => setExpectedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Conta (opcional)</InputLabel>
          <Select
            value={bankAccountId}
            label="Conta (opcional)"
            onChange={(e) => setBankAccountId(e.target.value as number | '')}
          >
            <MenuItem value="">
              <em>Nenhuma</em>
            </MenuItem>
            {bankAccounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.name} ({formatCurrencyBRL(account.balance)})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Observação"
          fullWidth
          multiline
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!name.trim()}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
