import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

interface AddAccountDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; amount: number; due_date?: string }) => Promise<boolean>;
}

export default function AddAccountDialog({ open, onClose, onSubmit }: AddAccountDialogProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  function handleClose() {
    setName('');
    setAmount('');
    setDueDate('');
    onClose();
  }

  async function handleSubmit() {
    if (!name.trim()) return;
    const success = await onSubmit({
      name: name.trim(),
      amount: Number(amount) || 0,
      due_date: dueDate || undefined,
    });
    if (success) handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nova Conta</DialogTitle>
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
          label="Data de vencimento"
          type="date"
          fullWidth
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
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
