import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { BankAccount, DefaultIncome } from '../types/models';
import { formatCurrencyBRL } from '../utils/format';

interface DefaultIncomeFormProps {
  open: boolean;
  bankAccounts: BankAccount[];
  onClose: () => void;
  onSave: (data: {
    name: string;
    expected_day?: number;
    amount: number;
    bank_account_id?: number | null;
  }) => void;
  initial?: DefaultIncome | null;
}

export default function DefaultIncomeForm({
  open,
  bankAccounts,
  onClose,
  onSave,
  initial,
}: DefaultIncomeFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [expectedDay, setExpectedDay] = useState(
    initial?.expected_day ? String(initial.expected_day) : ''
  );
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [bankAccountId, setBankAccountId] = useState<number | ''>(initial?.bank_account_id || '');

  function handleSubmit() {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      expected_day: expectedDay ? Number(expectedDay) : undefined,
      amount: Number(amount) || 0,
      bank_account_id: bankAccountId || null,
    });
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? 'Editar Entrada Padrão' : 'Nova Entrada Padrão'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Nome da entrada"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mt: 1, mb: 2 }}
        />
        <TextField
          label="Valor (R$) - opcional"
          type="number"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          helperText="Deixe em branco para entradas de valor variável."
          sx={{ mb: 2 }}
        />
        <TextField
          label="Dia previsto"
          type="number"
          fullWidth
          value={expectedDay}
          onChange={(e) => setExpectedDay(e.target.value)}
          inputProps={{ min: 1, max: 31 }}
          helperText="Opcional. Dia do mês em que a entrada é esperada."
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
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!name.trim()}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
