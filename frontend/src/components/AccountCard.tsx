import { useState } from 'react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  Button,
} from '@mui/material';
import {
  AttachFile,
  CheckCircle,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert,
  StickyNote2Outlined,
  Visibility,
} from '@mui/icons-material';
import { Account } from '../types/models';
import { formatDateOnlyBR, formatPaidDateBR, todayDateString } from '../utils/date';
import { formatCurrencyBRLOrFallback } from '../utils/format';

interface AccountCardProps {
  account: Account;
  onPay: () => void;
  onUnpay: () => void;
  onViewDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AccountCard({
  account,
  onPay,
  onUnpay,
  onViewDetail,
  onEdit,
  onDelete,
}: AccountCardProps) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const isOverdue = !account.is_paid && !!account.due_date && account.due_date < todayDateString();

  let borderColor: string = 'warning.main';
  if (account.is_paid) borderColor = 'success.main';
  else if (isOverdue) borderColor = 'error.main';

  function closeMenu() {
    setMenuAnchor(null);
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '4px solid',
        borderLeftColor: borderColor,
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="h6" gutterBottom>
              {account.name}
            </Typography>
            {account.notes && (
              <Tooltip title="Possui observação">
                <StickyNote2Outlined fontSize="small" sx={{ color: 'text.secondary', mb: 0.5 }} />
              </Tooltip>
            )}
          </Stack>
          <Stack direction="row" spacing={0.5}>
            {account.is_paid ? (
              <Chip label="Paga" color="success" size="small" icon={<CheckCircle />} />
            ) : isOverdue ? (
              <Chip label="Vencida" color="error" size="small" />
            ) : (
              <Chip label="Pendente" color="warning" size="small" />
            )}
          </Stack>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }} gutterBottom>
          {formatCurrencyBRLOrFallback(account.amount)}
        </Typography>
        {account.due_date && (
          <Typography variant="body2" color="text.secondary">
            Vencimento: {formatDateOnlyBR(account.due_date)}
          </Typography>
        )}
        {account.paid_at && (
          <Typography variant="body2" color="text.secondary">
            Pago em: {formatPaidDateBR(account.paid_at)}
          </Typography>
        )}
        {account.receipt && (
          <Box sx={{ mt: 1 }}>
            <Button
              size="small"
              startIcon={<AttachFile />}
              href={`/uploads/${account.receipt}`}
              target="_blank"
            >
              Comprovante
            </Button>
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        {account.is_paid ? (
          <Button size="small" color="warning" onClick={onUnpay}>
            Desmarcar
          </Button>
        ) : (
          <Button size="small" variant="contained" onClick={onPay}>
            Pagar
          </Button>
        )}
        <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}>
          <MoreVert fontSize="small" />
        </IconButton>
        <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={closeMenu}>
          <MenuItem
            onClick={() => {
              closeMenu();
              onViewDetail();
            }}
          >
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>Ver detalhes</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              closeMenu();
              onEdit();
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Editar</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              closeMenu();
              onDelete();
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Excluir</ListItemText>
          </MenuItem>
        </Menu>
      </CardActions>
    </Card>
  );
}
