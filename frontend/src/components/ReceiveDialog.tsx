import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { BankAccount, Income } from '../types/models';
import { formatDateOnlyBR, todayDateString } from '../utils/date';
import { formatCurrencyBRL } from '../utils/format';

interface ReceiveDialogProps {
  open: boolean;
  income: Income | null;
  bankAccounts: BankAccount[];
  onClose: () => void;
  onConfirm: (notes?: string, receivedAt?: string, bankAccountId?: number) => void;
}

export default function ReceiveDialog({
  open,
  income,
  bankAccounts,
  onClose,
  onConfirm,
}: ReceiveDialogProps) {
  const [notes, setNotes] = useState('');
  const [receivedAt, setReceivedAt] = useState(todayDateString());
  const [bankAccountId, setBankAccountId] = useState<number | ''>('');

  useEffect(() => {
    if (open) {
      setBankAccountId(income?.bank_account_id || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, income?.id]);

  function handleClose() {
    setNotes('');
    setReceivedAt(todayDateString());
    setBankAccountId('');
    onClose();
  }

  function handleConfirm() {
    onConfirm(notes || undefined, receivedAt || undefined, bankAccountId || undefined);
    setNotes('');
    setReceivedAt(todayDateString());
    setBankAccountId('');
  }

  if (!income) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Receber Entrada</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          {income.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Valor: {formatCurrencyBRL(income.amount)}
        </Typography>
        {income.expected_date && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Previsto: {formatDateOnlyBR(income.expected_date)}
          </Typography>
        )}

        <TextField
          label="Data do recebimento"
          type="date"
          fullWidth
          value={receivedAt}
          onChange={(e) => setReceivedAt(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: todayDateString() }}
          sx={{ mt: 2 }}
        />

        <FormControl fullWidth sx={{ mt: 2 }}>
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
          label="Observações"
          fullWidth
          multiline
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button variant="contained" color="success" onClick={handleConfirm}>
          Confirmar Recebimento
        </Button>
      </DialogActions>
    </Dialog>
  );
}
