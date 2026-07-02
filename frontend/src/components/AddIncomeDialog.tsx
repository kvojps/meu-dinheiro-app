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
import { BankAccount } from '../types/models';
import { formatCurrencyBRL } from '../utils/format';

interface AddIncomeDialogProps {
  open: boolean;
  bankAccounts: BankAccount[];
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    amount: number;
    expected_date?: string;
    bank_account_id?: number;
  }) => Promise<boolean>;
}

export default function AddIncomeDialog({
  open,
  bankAccounts,
  onClose,
  onSubmit,
}: AddIncomeDialogProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [bankAccountId, setBankAccountId] = useState<number | ''>('');

  function handleClose() {
    setName('');
    setAmount('');
    setExpectedDate('');
    setBankAccountId('');
    onClose();
  }

  async function handleSubmit() {
    if (!name.trim()) return;
    const success = await onSubmit({
      name: name.trim(),
      amount: Number(amount) || 0,
      expected_date: expectedDate || undefined,
      bank_account_id: bankAccountId || undefined,
    });
    if (success) handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nova Entrada</DialogTitle>
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
        <FormControl fullWidth>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!name.trim()}>
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
