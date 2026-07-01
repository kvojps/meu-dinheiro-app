import { useState } from 'react';
import {
  Box,
  Typography,
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
import { DefaultAccount } from '../types/models';
import DefaultAccountForm from '../components/DefaultAccountForm';
import MonthYearPicker from '../components/MonthYearPicker';
import FileUploadButton from '../components/FileUploadButton';
import AppSnackbar from '../components/AppSnackbar';
import { useSnackbar } from '../hooks/useSnackbar';
import { useDefaultAccounts } from '../hooks/useDefaultAccounts';
import { useMonthRangeCreator } from '../hooks/useMonthRangeCreator';
import { useDataTransfer } from '../hooks/useDataTransfer';
import { formatCurrencyBRLOrFallback } from '../utils/format';

export default function Configuracao() {
  const { snackbar, showSnackbar, showError, closeSnackbar } = useSnackbar();
  const { defaultAccounts, loading, save, remove, reload } = useDefaultAccounts(
    showError,
    showSnackbar
  );
  const { range, setRange, creating, createRange } = useMonthRangeCreator(showSnackbar, showError);
  const { importing, exportData, importData } = useDataTransfer(showSnackbar, showError, reload);

  const [formOpen, setFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<DefaultAccount | null>(null);
  const [formKey, setFormKey] = useState(0);

  function openEdit(account: DefaultAccount) {
    setEditingAccount(account);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }

  function openAdd() {
    setEditingAccount(null);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }

  function handleSaveDefault(data: { name: string; due_day?: number; amount: number }) {
    save(data, editingAccount?.id).then((success) => {
      if (success) {
        setFormOpen(false);
        setEditingAccount(null);
      }
    });
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
                    <IconButton edge="end" onClick={() => remove(acc.id)}>
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
            <MonthYearPicker
              label="De:"
              month={range.fromMonth}
              year={range.fromYear}
              onMonthChange={(m) => setRange((p) => ({ ...p, fromMonth: m }))}
              onYearChange={(y) => setRange((p) => ({ ...p, fromYear: y }))}
            />
            <MonthYearPicker
              label="Até:"
              month={range.toMonth}
              year={range.toYear}
              onMonthChange={(m) => setRange((p) => ({ ...p, toMonth: m }))}
              onYearChange={(y) => setRange((p) => ({ ...p, toYear: y }))}
            />
            <Button
              variant="contained"
              onClick={createRange}
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
            <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={exportData}>
              Exportar
            </Button>
            <FileUploadButton
              label={importing ? 'Importando...' : 'Importar'}
              accept=".zip"
              disabled={importing}
              startIcon={<FileUploadIcon />}
              onFileSelected={importData}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>

      <DefaultAccountForm
        key={formKey}
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
