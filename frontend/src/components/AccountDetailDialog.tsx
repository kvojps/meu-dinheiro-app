import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { AttachFile } from '@mui/icons-material';
import { Account } from '../types/models';
import { formatDateOnlyBR, formatDateTimeBR } from '../utils/date';
import { formatCurrencyBRLOrFallback } from '../utils/format';

interface AccountDetailDialogProps {
  open: boolean;
  account: Account | null;
  onClose: () => void;
}

export default function AccountDetailDialog({ open, account, onClose }: AccountDetailDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{account?.name}</DialogTitle>
      <DialogContent dividers>
        {account && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, py: 1 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Valor
              </Typography>
              <Typography>{formatCurrencyBRLOrFallback(account.amount)}</Typography>
            </Box>
            {account.due_date && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Vencimento
                </Typography>
                <Typography>{formatDateOnlyBR(account.due_date)}</Typography>
              </Box>
            )}
            <Box>
              <Typography variant="caption" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={account.is_paid ? 'Paga' : 'Pendente'}
                color={account.is_paid ? 'success' : 'default'}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
            {account.paid_at && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Pago em
                </Typography>
                <Typography>{formatDateTimeBR(account.paid_at)}</Typography>
              </Box>
            )}
            {account.receipt && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Comprovante
                </Typography>
                <Box>
                  <Button
                    size="small"
                    startIcon={<AttachFile />}
                    href={`/uploads/${account.receipt}`}
                    target="_blank"
                  >
                    Abrir comprovante
                  </Button>
                </Box>
              </Box>
            )}
            {account.notes && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Observação
                </Typography>
                <Typography sx={{ fontStyle: 'italic' }}>"{account.notes}"</Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
