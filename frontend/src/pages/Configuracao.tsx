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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Divider,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlaylistAdd as PlaylistAddIcon,
  FileUpload as FileUploadIcon,
  FileDownload as FileDownloadIcon,
  ExpandMore,
} from '@mui/icons-material';
import { api, DefaultAccount } from '../api/client';
import DefaultAccountForm from '../components/DefaultAccountForm';
import AppSnackbar from '../components/AppSnackbar';
import { useSnackbar } from '../hooks/useSnackbar';
import { formatCurrencyBRLOrFallback } from '../utils/format';

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export default function Configuracao() {
  const [defaultAccounts, setDefaultAccounts] = useState<DefaultAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<DefaultAccount | null>(null);

  const currentYear = new Date().getFullYear();
  const [range, setRange] = useState({
    fromYear: currentYear,
    fromMonth: 1,
    toYear: currentYear,
    toMonth: 12,
  });
  const [creating, setCreating] = useState(false);

  const [importing, setImporting] = useState(false);
  const { snackbar, showSnackbar, showError, closeSnackbar } = useSnackbar();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const d = await api.getDefaultAccounts();
      d.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
      setDefaultAccounts(d);
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveDefault(data: { name: string; due_day?: number; amount: number }) {
    try {
      if (editingAccount) {
        await api.updateDefaultAccount(editingAccount.id, data);
        showSnackbar('Conta padrão atualizada');
      } else {
        await api.createDefaultAccount(data);
        showSnackbar('Conta padrão adicionada');
      }
      setFormOpen(false);
      setEditingAccount(null);
      loadData();
    } catch (err) {
      showError(err);
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.deleteDefaultAccount(id);
      showSnackbar('Conta padrão removida');
      loadData();
    } catch (err) {
      showError(err);
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
        range.fromYear,
        range.fromMonth,
        range.toYear,
        range.toMonth
      );
      const msgs = [`${result.created.length} mes(es) adicionado(s)!`];
      if (result.errors.length > 0) msgs.push(...result.errors);
      showSnackbar(msgs.join(' | '), result.errors.length > 0 ? 'warning' : 'success');
      loadData();
    } catch (err) {
      showError(err);
    } finally {
      setCreating(false);
    }
  }

  async function handleExport() {
    try {
      const blob = await api.exportData();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export-money-manager.zip';
      a.click();
      URL.revokeObjectURL(url);
      showSnackbar('Arquivo exportado com sucesso');
    } catch (err) {
      showError(err);
    }
  }

  async function handleImport(file: File) {
    setImporting(true);
    try {
      await api.importData(file);
      showSnackbar('Dados importados com sucesso!');
      loadData();
    } catch (err) {
      showError(err);
    } finally {
      setImporting(false);
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
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
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
                    secondary={`${formatCurrencyBRLOrFallback(acc.amount, 'Valor variável')}${acc.due_day ? ` - Vencimento dia ${acc.due_day}` : ''}`}
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
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5, display: 'block' }}
              >
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
                    <option key={i} value={i + 1}>
                      {n}
                    </option>
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
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5, display: 'block' }}
              >
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
                    <option key={i} value={i + 1}>
                      {n}
                    </option>
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

      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Exportar / Importar Dados</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Exporta todos os meses, contas e comprovantes em um arquivo ZIP. A importação substitui
            todos os dados atuais.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleExport}>
              Exportar
            </Button>
            <Button
              variant="outlined"
              component="label"
              disabled={importing}
              startIcon={<FileUploadIcon />}
            >
              {importing ? 'Importando...' : 'Importar'}
              <input
                type="file"
                accept=".zip"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImport(file);
                  e.target.value = '';
                }}
              />
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>

      <DefaultAccountForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingAccount(null);
        }}
        onSave={handleSaveDefault}
        initial={editingAccount}
      />

      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </Box>
  );
}
