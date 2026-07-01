import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
} from '@mui/material';
import { Account } from '../types/models';
import FileUploadButton from './FileUploadButton';
import { formatDateOnlyBR, todayDateString } from '../utils/date';
import { formatCurrencyBRL } from '../utils/format';

interface PayDialogProps {
  open: boolean;
  account: Account | null;
  onClose: () => void;
  onConfirm: (file?: File, notes?: string, paidAt?: string) => void;
}

export default function PayDialog({ open, account, onClose, onConfirm }: PayDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [paidAt, setPaidAt] = useState(todayDateString());

  function handleClose() {
    setFile(null);
    setNotes('');
    setPaidAt(todayDateString());
    onClose();
  }

  function handleConfirm() {
    onConfirm(file || undefined, notes || undefined, paidAt || undefined);
    setFile(null);
    setNotes('');
    setPaidAt(todayDateString());
  }

  if (!account) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Pagar Conta</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          {account.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Valor: {formatCurrencyBRL(account.amount)}
        </Typography>
        {account.due_date && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Vencimento: {formatDateOnlyBR(account.due_date)}
          </Typography>
        )}

        <TextField
          label="Data do pagamento"
          type="date"
          fullWidth
          value={paidAt}
          onChange={(e) => setPaidAt(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: todayDateString() }}
          sx={{ mt: 2 }}
        />

        <Box sx={{ mt: 3, mb: 2 }}>
          <FileUploadButton
            label={file ? file.name : 'Selecionar Comprovante'}
            accept="image/*,application/pdf"
            startIcon={<span>📎</span>}
            onFileSelected={setFile}
          />
          {file && (
            <Button size="small" color="error" onClick={() => setFile(null)} sx={{ ml: 1 }}>
              Remover
            </Button>
          )}
        </Box>

        <TextField
          label="Observações"
          fullWidth
          multiline
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button variant="contained" color="success" onClick={handleConfirm}>
          Confirmar Pagamento
        </Button>
      </DialogActions>
    </Dialog>
  );
}
