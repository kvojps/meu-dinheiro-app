import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { BankAccount } from '../types/models';

interface BankAccountFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; balance?: number }) => void;
  initial?: BankAccount | null;
}

export default function BankAccountForm({ open, onClose, onSave, initial }: BankAccountFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [balance, setBalance] = useState(initial ? String(initial.balance) : '');

  function handleSubmit() {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      balance: Number(balance) || 0,
    });
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? 'Editar Conta' : 'Nova Conta'}</DialogTitle>
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
          label="Saldo (R$)"
          type="number"
          fullWidth
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          helperText={
            initial
              ? 'Ajuste manual do saldo atual.'
              : 'Saldo inicial da conta.'
          }
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
