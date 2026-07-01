import { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  IconButton,
  Paper,
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  Cancel,
  Delete as DeleteIcon,
  DeleteOutline,
  AttachFile,
} from '@mui/icons-material';
import { api, MonthDetail as MonthDetailType, Account } from '../api/client';
import PayDialog from '../components/PayDialog';

export default function MonthDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [month, setMonth] = useState<MonthDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (id) loadMonth(Number(id));
  }, [id]);

  async function loadMonth(monthId: number) {
    try {
      const data = await api.getMonth(monthId);
      setMonth(data);
    } catch (err: any) {
      setSnackbar({ message: err.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handlePay(file?: File, notes?: string) {
    if (!selectedAccount) return;
    try {
      await api.payAccount(selectedAccount.id, file, notes);
      setPayDialogOpen(false);
      setSelectedAccount(null);
      setSnackbar({ message: 'Conta marcada como paga!', severity: 'success' });
      if (id) loadMonth(Number(id));
    } catch (err: any) {
      setSnackbar({ message: err.message, severity: 'error' });
    }
  }

  async function handleUnpay(accountId: number) {
    try {
      await api.unpayAccount(accountId);
      setSnackbar({ message: 'Pagamento desmarcado', severity: 'success' });
      if (id) loadMonth(Number(id));
    } catch (err: any) {
      setSnackbar({ message: err.message, severity: 'error' });
    }
  }

  async function handleAddAccount() {
    if (!id || !newName.trim()) return;
    try {
      await api.createAccount(Number(id), {
        name: newName.trim(),
        amount: Number(newAmount) || 0,
        due_date: newDueDate || undefined,
      });
      setAddDialogOpen(false);
      setNewName('');
      setNewAmount('');
      setNewDueDate('');
      setSnackbar({ message: 'Conta adicionada', severity: 'success' });
      loadMonth(Number(id));
    } catch (err: any) {
      setSnackbar({ message: err.message, severity: 'error' });
    }
  }

  async function handleDeleteAccount(accountId: number) {
    try {
      await api.deleteAccount(accountId);
      setSnackbar({ message: 'Conta removida', severity: 'success' });
      if (id) loadMonth(Number(id));
    } catch (err: any) {
      setSnackbar({ message: err.message, severity: 'error' });
    }
  }

  async function handleDeleteMonth() {
    if (!id) return;
    setDeleting(true);
    try {
      await api.deleteMonth(Number(id));
      setDeleteDialogOpen(false);
      navigate('/');
    } catch (err: any) {
      setSnackbar({ message: err.message, severity: 'error' });
    } finally {
      setDeleting(false);
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
        <Typography variant="h4" sx={{ flex: 1 }}>{month.label}</Typography>
        <Chip
          label={`${paidCount}/${month.accounts.length} pagas`}
          color={paidCount === month.accounts.length && month.accounts.length > 0 ? 'success' : 'warning'}
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
              <Card sx={{ opacity: account.is_paid ? 0.85 : 1 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" gutterBottom>
                      {account.name}
                    </Typography>
                    <Chip
                      label={account.is_paid ? 'Paga' : 'Pendente'}
                      color={account.is_paid ? 'success' : 'default'}
                      size="small"
                      icon={account.is_paid ? <CheckCircle /> : undefined}
                    />
                  </Box>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    R$ {account.amount.toFixed(2)}
                  </Typography>
                  {account.due_date && (
                    <Typography variant="body2" color="text.secondary">
                      Vencimento: {new Date(account.due_date).toLocaleDateString('pt-BR')}
                    </Typography>
                  )}
                  {account.paid_at && (
                    <Typography variant="body2" color="text.secondary">
                      Pago em: {new Date(account.paid_at).toLocaleDateString('pt-BR')}
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
                  {account.notes && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                      "{account.notes}"
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  {account.is_paid ? (
                    <Button size="small" color="warning" onClick={() => handleUnpay(account.id)}>
                      Desmarcar
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => { setSelectedAccount(account); setPayDialogOpen(true); }}
                    >
                      Pagar
                    </Button>
                  )}
                  <IconButton size="small" onClick={() => handleDeleteAccount(account.id)} sx={{ ml: 'auto' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
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
        onClose={() => { setPayDialogOpen(false); setSelectedAccount(null); }}
        onConfirm={handlePay}
      />

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nova Conta</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Nome"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            label="Valor (R$)"
            type="number"
            fullWidth
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Data de vencimento"
            type="date"
            fullWidth
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddAccount} disabled={!newName.trim()}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => !deleting && setDeleteDialogOpen(false)}>
        <DialogTitle>Excluir mês?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir <strong>{month.label}</strong>?
            Todas as contas e pagamentos serão removidos.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>Cancelar</Button>
          <Button onClick={handleDeleteMonth} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {snackbar ? (
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(null)}>
            {snackbar.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
