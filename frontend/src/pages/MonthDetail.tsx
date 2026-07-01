import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Chip,
  Grid,
  IconButton,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  Delete as DeleteIcon,
  DeleteOutline,
  Edit as EditIcon,
  Visibility,
  AttachFile,
} from '@mui/icons-material';
import { Account } from '../types/models';
import PayDialog from '../components/PayDialog';
import AddAccountDialog from '../components/AddAccountDialog';
import EditAccountDialog from '../components/EditAccountDialog';
import AccountDetailDialog from '../components/AccountDetailDialog';
import DeleteMonthDialog from '../components/DeleteMonthDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import AppSnackbar from '../components/AppSnackbar';
import { useMonth } from '../hooks/useMonth';
import { formatDateOnlyBR, formatDateTimeBR } from '../utils/date';
import { formatCurrencyBRLOrFallback } from '../utils/format';

export default function MonthDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    month,
    loading,
    deleting,
    snackbar,
    closeSnackbar,
    pay,
    unpay,
    addAccount,
    editAccount,
    deleteAccount,
    deleteMonth,
  } = useMonth(id);

  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [editKey, setEditKey] = useState(0);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailAccount, setDetailAccount] = useState<Account | null>(null);

  const [deleteAccountTarget, setDeleteAccountTarget] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState(false);

  async function handleDeleteAccount() {
    if (!deleteAccountTarget) return;
    setDeletingAccount(true);
    if (await deleteAccount(deleteAccountTarget.id)) {
      setDeleteAccountTarget(null);
    }
    setDeletingAccount(false);
  }

  function openEditDialog(account: Account) {
    setEditingAccount(account);
    setEditKey((k) => k + 1);
    setEditDialogOpen(true);
  }

  async function handleDeleteMonth() {
    if (await deleteMonth()) {
      setDeleteDialogOpen(false);
      navigate('/');
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!month) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h5">Mês não encontrado</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Voltar
        </Button>
        <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
      </Box>
    );
  }

  const paidCount = month.accounts.filter((a) => a.is_paid).length;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate('/')}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ flex: 1 }}>
          {month.label}
        </Typography>
        <Chip
          label={`${paidCount}/${month.accounts.length} pagas`}
          color={
            paidCount === month.accounts.length && month.accounts.length > 0 ? 'success' : 'warning'
          }
          sx={{ mr: 1 }}
        />
        <IconButton color="error" onClick={() => setDeleteDialogOpen(true)}>
          <DeleteOutline />
        </IconButton>
      </Box>

      {month.accounts.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography color="text.secondary" gutterBottom>
            Nenhuma conta cadastrada neste mês.
          </Typography>
          <Button variant="outlined" onClick={() => setAddDialogOpen(true)}>
            Adicionar Conta
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {month.accounts.map((account) => (
            <Grid item xs={12} sm={6} md={4} key={account.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderLeft: '4px solid',
                  borderLeftColor: account.is_paid ? 'success.main' : 'warning.main',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {account.name}
                    </Typography>
                    <Chip
                      label={account.is_paid ? 'Paga' : 'Pendente'}
                      color={account.is_paid ? 'success' : 'warning'}
                      size="small"
                      icon={account.is_paid ? <CheckCircle /> : undefined}
                    />
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
                      Pago em: {formatDateTimeBR(account.paid_at)}
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
                <CardActions>
                  {account.is_paid ? (
                    <Button size="small" color="warning" onClick={() => unpay(account.id)}>
                      Desmarcar
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        setSelectedAccount(account);
                        setPayDialogOpen(true);
                      }}
                    >
                      Pagar
                    </Button>
                  )}
                  <Tooltip title="Ver detalhes">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setDetailAccount(account);
                        setDetailOpen(true);
                      }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => openEditDialog(account)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton size="small" onClick={() => setDeleteAccountTarget(account)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button variant="outlined" onClick={() => setAddDialogOpen(true)}>
          Adicionar Conta
        </Button>
      </Box>

      <PayDialog
        open={payDialogOpen}
        account={selectedAccount}
        onClose={() => {
          setPayDialogOpen(false);
          setSelectedAccount(null);
        }}
        onConfirm={async (file, notes) => {
          if (!selectedAccount) return;
          if (await pay(selectedAccount.id, file, notes)) {
            setPayDialogOpen(false);
            setSelectedAccount(null);
          }
        }}
      />

      <AddAccountDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={addAccount}
      />

      {editingAccount && (
        <EditAccountDialog
          key={editKey}
          open={editDialogOpen}
          account={editingAccount}
          onClose={() => {
            setEditDialogOpen(false);
            setEditingAccount(null);
          }}
          onSubmit={(data) => editAccount(editingAccount.id, data)}
        />
      )}

      <AccountDetailDialog
        open={detailOpen}
        account={detailAccount}
        onClose={() => setDetailOpen(false)}
      />

      <DeleteMonthDialog
        open={deleteDialogOpen}
        monthLabel={month.label}
        deleting={deleting}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteMonth}
      />

      <ConfirmDialog
        open={!!deleteAccountTarget}
        title="Excluir conta?"
        message={
          <>
            Tem certeza que deseja excluir <strong>{deleteAccountTarget?.name}</strong>? Essa ação
            não pode ser desfeita.
          </>
        }
        loading={deletingAccount}
        onClose={() => setDeleteAccountTarget(null)}
        onConfirm={handleDeleteAccount}
      />

      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </Box>
  );
}
