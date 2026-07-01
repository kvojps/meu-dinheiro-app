import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { DefaultAccount } from '../api/client';

interface DefaultAccountFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; due_day?: number; amount: number }) => void;
  initial?: DefaultAccount | null;
}

export default function DefaultAccountForm({ open, onClose, onSave, initial }: DefaultAccountFormProps) {
  const [name, setName] = useState('');
  const [dueDay, setDueDay] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setDueDay(initial.due_day ? String(initial.due_day) : '');
      setAmount(String(initial.amount));
    } else {
      setName('');
      setDueDay('');
      setAmount('');
    }
  }, [initial, open]);

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
      <DialogTitle>
        {initial ? 'Editar Conta Padrão' : 'Nova Conta Padrão'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Nome da conta"
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
          label="Dia de vencimento"
          type="number"
          fullWidth
          value={dueDay}
          onChange={(e) => setDueDay(e.target.value)}
          inputProps={{ min: 1, max: 31 }}
          helperText="Opcional. Dia do mês em que a conta vence."
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
