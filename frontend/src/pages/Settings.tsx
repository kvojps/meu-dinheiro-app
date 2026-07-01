import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Stack,
  Chip,
  Skeleton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlaylistAdd as PlaylistAddIcon,
  FileUpload as FileUploadIcon,
  FileDownload as FileDownloadIcon,
  ExpandMore,
  ReceiptLong,
  ErrorOutline,
} from '@mui/icons-material';
import { DefaultAccount } from '../types/models';
import DefaultAccountForm from '../components/DefaultAccountForm';
import MonthYearPicker from '../components/MonthYearPicker';
import FileUploadButton from '../components/FileUploadButton';
import AppSnackbar from '../components/AppSnackbar';
import ConfirmDialog from '../components/ConfirmDialog';
import { useSnackbar } from '../hooks/useSnackbar';
import { useDefaultAccounts } from '../hooks/useDefaultAccounts';
import { useMonthRangeCreator, MAX_BATCH_MONTHS } from '../hooks/useMonthRangeCreator';
import { useDataTransfer } from '../hooks/useDataTransfer';
import { formatCurrencyBRLOrFallback } from '../utils/format';

export default function Settings() {
  const { snackbar, showSnackbar, showError, closeSnackbar } = useSnackbar();
  const { defaultAccounts, loading, error, retry, save, remove, reload } = useDefaultAccounts(
    showError,
    showSnackbar
  );
  const { range, setRange, creating, createRange, monthsCount, rangeValid } = useMonthRangeCreator(
    showSnackbar,
    showError
  );
  const { importing, exportData, importData } = useDataTransfer(showSnackbar, showError, reload);

  const [formOpen, setFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<DefaultAccount | null>(null);
  const [formKey, setFormKey] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState<DefaultAccount | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [pendingImportFile, setPendingImportFile] = useState<File | null>(null);

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

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await remove(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
  }

  async function handleConfirmImport() {
    if (!pendingImportFile) return;
    const file = pendingImportFile;
    setPendingImportFile(null);
    await importData(file);
  }

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={280} height={48} sx={{ mb: 2 }} />
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={80} />
          <Skeleton variant="rounded" height={80} />
          <Skeleton variant="rounded" height={80} />
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <ErrorOutline sx={{ fontSize: 48, color: 'error.main', mb: 1 }} />
        <Typography variant="h5" gutterBottom>
          Não foi possível carregar as configurações
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Verifique sua conexão e tente novamente.
        </Typography>
        <Button variant="contained" onClick={retry}>
          Tentar novamente
        </Button>
        <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Configuração de Pagamento
      </Typography>

      <Stack spacing={2}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6">Contas Padrão</Typography>
              <Chip label={defaultAccounts.length} size="small" />
            </Stack>
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
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <ReceiptLong fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={acc.name}
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondary={`${formatCurrencyBRLOrFallback(acc.amount, 'Valor variável')}${acc.due_day ? ` - Vencimento dia ${acc.due_day}` : ''}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => openEdit(acc)} sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => setDeleteTarget(acc)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded>
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
                disabled={creating || !rangeValid}
                startIcon={<PlaylistAddIcon />}
              >
                {creating ? 'Criando...' : 'Adicionar Meses'}
              </Button>
            </Stack>
            <Typography
              variant="caption"
              color={rangeValid ? 'text.secondary' : 'error'}
              sx={{ display: 'block', mt: 1 }}
            >
              {monthsCount > 0
                ? `Isso vai criar até ${monthsCount} ${monthsCount === 1 ? 'mês' : 'meses'} (meses já existentes serão ignorados).`
                : 'Selecione um intervalo válido.'}
              {monthsCount > MAX_BATCH_MONTHS &&
                ` O intervalo não pode ultrapassar ${MAX_BATCH_MONTHS} meses.`}
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Exportar / Importar Dados</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Exporta todos os meses, contas e comprovantes em um arquivo ZIP. A importação
              substitui todos os dados atuais.
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
                onFileSelected={setPendingImportFile}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>

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

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir conta padrão?"
        message={
          <>
            Tem certeza que deseja excluir <strong>{deleteTarget?.name}</strong>? Ela deixará de ser
            criada automaticamente nos próximos meses.
          </>
        }
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />

      <ConfirmDialog
        open={!!pendingImportFile}
        title="Importar dados?"
        message={
          <>
            Importar <strong>{pendingImportFile?.name}</strong> vai <strong>substituir todos os
            dados atuais</strong> (meses, contas e comprovantes). Essa ação não pode ser desfeita.
          </>
        }
        confirmLabel="Importar"
        loading={importing}
        onClose={() => setPendingImportFile(null)}
        onConfirm={handleConfirmImport}
      />

      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </Box>
  );
}
