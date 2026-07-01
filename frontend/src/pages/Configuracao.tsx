import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Stack,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, PlaylistAdd as PlaylistAddIcon, ExpandMore } from '@mui/icons-material';
import { api, DefaultAccount } from '../api/client';
import DefaultAccountForm from '../components/DefaultAccountForm';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export default function Configuracao() {
  const [defaultAccounts, setDefaultAccounts] = useState<DefaultAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<DefaultAccount | null>(null);

  const [range, setRange] = useState({ fromYear: 2026, fromMonth: 1, toYear: 2026, toMonth: 12 });
  const [creating, setCreating] = useState(false);

  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' | 'warning' } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const d = await api.getDefaultAccounts();
      setDefaultAccounts(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveDefault(data: { name: string; due_day?: number; amount: number }) {
    try {
      if (editingAccount) {
        await api.updateDefaultAccount(editingAccount.id, data);
        setSnackbar({ message: 'Conta padrão atualizada', severity: 'success' });
      } else {
        await api.createDefaultAccount(data);
        setSnackbar({ message: 'Conta padrão adicionada', severity: 'success' });
      }
      setFormOpen(false);
      setEditingAccount(null);
      loadData();
    } catch (err: any) {
      setSnackbar({ message: err.message, severity: 'error' });
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.deleteDefaultAccount(id);
      setSnackbar({ message: 'Conta padrão removida', severity: 'success' });
      loadData();
    } catch (err: any) {
      setSnackbar({ message: err.message, severity: 'error' });
    }
  }

  function openEdit(account: DefaultAccount) {
    setEditingAccount(account);
    setFormOpen(true);
  }

  function openAdd() {
    setEditingAccount(null);
    setFormOpen(true);
  }

  async function handleAddRange() {
    setCreating(true);
    try {
      const result = await api.createMonthsBatch(
        range.fromYear, range.fromMonth,
        range.toYear, range.toMonth
      );
      const msgs = [`${result.created.length} mes(es) adicionado(s)!`];
      if (result.errors.length > 0) msgs.push(...result.errors);
      setSnackbar({
        message: msgs.join(' | '),
        severity: result.errors.length > 0 ? 'warning' : 'success',
      });
      loadData();
    } catch (err: any) {
      setSnackbar({ message: err.message, severity: 'error' });
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Configuração de Pagamento
      </Typography>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Contas Padrão</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Contas que serão criadas automaticamente em cada novo mês.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} size="small">
              Adicionar
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {defaultAccounts.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              Nenhuma conta padrão cadastrada.
            </Typography>
          ) : (
            <List disablePadding>
              {defaultAccounts.map((acc) => (
                <ListItem key={acc.id} divider sx={{ px: 0 }}>
                  <ListItemText
                    primary={acc.name}
                    secondary={`${acc.amount ? `R$ ${acc.amount.toFixed(2)}` : 'Valor variável'}${acc.due_day ? ` - Vencimento dia ${acc.due_day}` : ''}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => openEdit(acc)} sx={{ mr: 1 }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDelete(acc.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Adicionar Meses</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Adicione meses passados ou futuros. As contas padrão serão copiadas automaticamente.
          </Typography>
          <Stack direction="row" spacing={2} alignItems="flex-end" flexWrap="wrap" useFlexGap>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                De:
              </Typography>
              <Stack direction="row" spacing={1}>
                <TextField
                  select
                  label="Mês"
                  value={range.fromMonth}
                  onChange={(e) => setRange((p) => ({ ...p, fromMonth: Number(e.target.value) }))}
                  sx={{ minWidth: 130 }}
                  SelectProps={{ native: true }}
                  size="small"
                >
                  {MONTH_NAMES.map((n, i) => (
                    <option key={i} value={i + 1}>{n}</option>
                  ))}
                </TextField>
                <TextField
                  label="Ano"
                  type="number"
                  value={range.fromYear}
                  onChange={(e) => setRange((p) => ({ ...p, fromYear: Number(e.target.value) }))}
                  sx={{ width: 100 }}
                  size="small"
                />
              </Stack>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                Até:
              </Typography>
              <Stack direction="row" spacing={1}>
                <TextField
                  select
                  label="Mês"
                  value={range.toMonth}
                  onChange={(e) => setRange((p) => ({ ...p, toMonth: Number(e.target.value) }))}
                  sx={{ minWidth: 130 }}
                  SelectProps={{ native: true }}
                  size="small"
                >
                  {MONTH_NAMES.map((n, i) => (
                    <option key={i} value={i + 1}>{n}</option>
                  ))}
                </TextField>
                <TextField
                  label="Ano"
                  type="number"
                  value={range.toYear}
                  onChange={(e) => setRange((p) => ({ ...p, toYear: Number(e.target.value) }))}
                  sx={{ width: 100 }}
                  size="small"
                />
              </Stack>
            </Box>
            <Button
              variant="contained"
              onClick={handleAddRange}
              disabled={creating}
              startIcon={<PlaylistAddIcon />}
            >
              {creating ? 'Criando...' : 'Adicionar Meses'}
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>

      <DefaultAccountForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingAccount(null); }}
        onSave={handleSaveDefault}
        initial={editingAccount}
      />

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
