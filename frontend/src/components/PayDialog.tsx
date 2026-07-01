import { useState, useRef } from 'react';
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
import { Account } from '../api/client';
import { formatDateOnlyBR } from '../utils/date';
import { formatCurrencyBRL } from '../utils/format';

interface PayDialogProps {
  open: boolean;
  account: Account | null;
  onClose: () => void;
  onConfirm: (file?: File, notes?: string) => void;
}

export default function PayDialog({ open, account, onClose, onConfirm }: PayDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleClose() {
    setFile(null);
    setNotes('');
    onClose();
  }

  function handleConfirm() {
    onConfirm(file || undefined, notes || undefined);
    setFile(null);
    setNotes('');
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

        <Box sx={{ mt: 3, mb: 2 }}>
          <Button variant="outlined" component="label" startIcon={<span>📎</span>}>
            {file ? file.name : 'Selecionar Comprovante'}
            <input
              ref={fileRef}
              type="file"
              hidden
              accept="image/*,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </Button>
          {file && (
            <Button
              size="small"
              color="error"
              onClick={() => {
                setFile(null);
                if (fileRef.current) fileRef.current.value = '';
              }}
              sx={{ ml: 1 }}
            >
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
