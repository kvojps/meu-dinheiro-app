import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { DefaultExpense } from '../types/models';

interface DefaultExpenseFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; due_day?: number; amount: number }) => void;
  initial?: DefaultExpense | null;
}

export default function DefaultExpenseForm({
  open,
  onClose,
  onSave,
  initial,
}: DefaultExpenseFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [dueDay, setDueDay] = useState(initial?.due_day ? String(initial.due_day) : '');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');

  function handleSubmit() {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      due_day: dueDay ? Number(dueDay) : undefined,
      amount: Number(amount) || 0,
    });
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? 'Editar Despesa Padrão' : 'Nova Despesa Padrão'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Nome da despesa"
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
          helperText="Deixe em branco para despesas de valor variável."
          sx={{ mb: 2 }}
        />
        <TextField
          label="Dia de vencimento"
          type="number"
          fullWidth
          value={dueDay}
          onChange={(e) => setDueDay(e.target.value)}
          inputProps={{ min: 1, max: 31 }}
          helperText="Opcional. Dia do mês em que a despesa vence."
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
