import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Account } from '../types/models';

interface EditAccountDialogProps {
  open: boolean;
  account: Account;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    amount: number;
    due_date?: string;
    notes?: string;
  }) => Promise<boolean>;
}

export default function EditAccountDialog({
  open,
  account,
  onClose,
  onSubmit,
}: EditAccountDialogProps) {
  const [name, setName] = useState(account.name);
  const [amount, setAmount] = useState(account.amount ? String(account.amount) : '');
  const [dueDate, setDueDate] = useState(account.due_date || '');
  const [notes, setNotes] = useState(account.notes || '');

  async function handleSubmit() {
    if (!name.trim()) return;
    const success = await onSubmit({
      name: name.trim(),
      amount: amount ? Number(amount) : 0,
      due_date: dueDate || undefined,
      notes: notes || undefined,
    });
    if (success) onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Conta</DialogTitle>
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
          label="Data de vencimento"
          type="date"
          fullWidth
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
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
