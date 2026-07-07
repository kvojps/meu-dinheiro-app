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
  Payments,
  AccountBalance,
  ErrorOutline,
} from '@mui/icons-material';
import { DefaultExpense, DefaultIncome, BankAccount } from '@/types/models';
import { DefaultExpenseForm } from './components/DefaultExpenseForm';
import { DefaultIncomeForm } from './components/DefaultIncomeForm';
import { BankAccountForm } from './components/BankAccountForm';
import { MonthYearPicker } from './components/MonthYearPicker';
import { AppSnackbar } from '@/components/AppSnackbar';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useDefaultExpenses } from '@/hooks/default-expenses/useDefaultExpenses';
import { useDefaultIncomes } from '@/hooks/default-incomes/useDefaultIncomes';
import { useBankAccounts } from '@/hooks/bank-accounts/useBankAccounts';
import { useMonthRangeCreator, MAX_BATCH_MONTHS } from '@/hooks/months/useMonthRangeCreator';
import { useDataTransfer } from '@/hooks/settings/useDataTransfer';
import { formatCurrencyBRL, formatCurrencyBRLOrFallback } from '@/utils/format';

export function SettingsPage() {
  const { snackbar, showSnackbar, showError, closeSnackbar } = useSnackbar();
  const { defaultExpenses, loading, error, retry, save, remove, reload } = useDefaultExpenses(
    showError,
    showSnackbar
  );
  const {
    defaultIncomes,
    loading: defaultIncomesLoading,
    save: saveDefaultIncome,
    remove: removeDefaultIncome,
    reload: reloadDefaultIncomes,
  } = useDefaultIncomes(showError, showSnackbar);
  const {
    bankAccounts,
    loading: bankAccountsLoading,
    save: saveBankAccount,
    remove: removeBankAccount,
    reload: reloadBankAccounts,
  } = useBankAccounts(showError, showSnackbar);
  const { range, setRange, creating, createRange, monthsCount, rangeValid } = useMonthRangeCreator(
    showSnackbar,
    showError
  );
  const { importing, exportData, importData } = useDataTransfer(showSnackbar, showError, () => {
    reload();
    reloadDefaultIncomes();
    reloadBankAccounts();
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<DefaultExpense | null>(null);
  const [formKey, setFormKey] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState<DefaultExpense | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [incomeFormOpen, setIncomeFormOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<DefaultIncome | null>(null);
  const [incomeFormKey, setIncomeFormKey] = useState(0);

  const [deleteIncomeTarget, setDeleteIncomeTarget] = useState<DefaultIncome | null>(null);
  const [deletingIncome, setDeletingIncome] = useState(false);

  const [bankAccountFormOpen, setBankAccountFormOpen] = useState(false);
  const [editingBankAccount, setEditingBankAccount] = useState<BankAccount | null>(null);
  const [bankAccountFormKey, setBankAccountFormKey] = useState(0);

  const [deleteBankAccountTarget, setDeleteBankAccountTarget] = useState<BankAccount | null>(null);
  const [deletingBankAccount, setDeletingBankAccount] = useState(false);

  const [importConfirmOpen, setImportConfirmOpen] = useState(false);

  const totalBankBalance = bankAccounts.reduce((sum, a) => sum + a.balance, 0);

  function openEditBankAccount(account: BankAccount) {
    setEditingBankAccount(account);
    setBankAccountFormKey((k) => k + 1);
    setBankAccountFormOpen(true);
  }

  function openAddBankAccount() {
    setEditingBankAccount(null);
    setBankAccountFormKey((k) => k + 1);
    setBankAccountFormOpen(true);
  }

  function handleSaveBankAccount(data: { name: string; balance?: number }) {
    saveBankAccount(data, editingBankAccount?.id).then((success) => {
      if (success) {
        setBankAccountFormOpen(false);
        setEditingBankAccount(null);
      }
    });
  }

  async function handleConfirmDeleteBankAccount() {
    if (!deleteBankAccountTarget) return;
    setDeletingBankAccount(true);
    await removeBankAccount(deleteBankAccountTarget.id);
    setDeletingBankAccount(false);
    setDeleteBankAccountTarget(null);
  }

  function openEdit(expense: DefaultExpense) {
    setEditingExpense(expense);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }

  function openAdd() {
    setEditingExpense(null);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }

  function handleSaveDefault(data: { name: string; due_day?: number; amount: number }) {
    save(data, editingExpense?.id).then((success) => {
      if (success) {
        setFormOpen(false);
        setEditingExpense(null);
      }
    });
  }

  function openEditIncome(income: DefaultIncome) {
    setEditingIncome(income);
    setIncomeFormKey((k) => k + 1);
    setIncomeFormOpen(true);
  }

  function openAddIncome() {
    setEditingIncome(null);
    setIncomeFormKey((k) => k + 1);
    setIncomeFormOpen(true);
  }

  function handleSaveDefaultIncome(data: {
    name: string;
    expected_day?: number;
    amount: number;
    bank_account_id?: number | null;
  }) {
    saveDefaultIncome(data, editingIncome?.id).then((success) => {
      if (success) {
        setIncomeFormOpen(false);
        setEditingIncome(null);
      }
    });
  }

  async function handleConfirmDeleteIncome() {
    if (!deleteIncomeTarget) return;
    setDeletingIncome(true);
    await removeDefaultIncome(deleteIncomeTarget.id);
    setDeletingIncome(false);
    setDeleteIncomeTarget(null);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await remove(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
  }

  async function handleConfirmImport() {
    setImportConfirmOpen(false);
    await importData();
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
              <Typography variant="h6">Despesas Padrão</Typography>
              <Chip label={defaultExpenses.length} size="small" />
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Typography variant="body2" color="text.secondary">
                Despesas que serão criadas automaticamente em cada novo mês.
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} size="small">
                Adicionar
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {defaultExpenses.length === 0 ? (
              <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                Nenhuma despesa padrão cadastrada.
              </Typography>
            ) : (
              <List disablePadding>
                {defaultExpenses.map((acc) => (
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
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6">Entradas Padrão</Typography>
              <Chip label={defaultIncomes.length} size="small" />
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Typography variant="body2" color="text.secondary">
                Entradas que serão criadas automaticamente em cada novo mês.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openAddIncome}
                size="small"
              >
                Adicionar
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {defaultIncomesLoading ? (
              <Stack spacing={1}>
                <Skeleton variant="rounded" height={56} />
                <Skeleton variant="rounded" height={56} />
              </Stack>
            ) : defaultIncomes.length === 0 ? (
              <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                Nenhuma entrada padrão cadastrada.
              </Typography>
            ) : (
              <List disablePadding>
                {defaultIncomes.map((inc) => (
                  <ListItem key={inc.id} divider sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        <Payments fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={inc.name}
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondary={`${formatCurrencyBRLOrFallback(inc.amount, 'Valor variável')}${inc.expected_day ? ` - Previsto dia ${inc.expected_day}` : ''}${inc.bank_account_name ? ` - Conta: ${inc.bank_account_name}` : ''}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => openEditIncome(inc)} sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => setDeleteIncomeTarget(inc)}>
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
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6">Contas Bancárias</Typography>
              <Chip label={bankAccounts.length} size="small" />
              {bankAccounts.length > 0 && (
                <Chip
                  label={`Total: ${formatCurrencyBRL(totalBankBalance)}`}
                  size="small"
                  variant="outlined"
                  color={totalBankBalance < 0 ? 'error' : 'default'}
                />
              )}
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Typography variant="body2" color="text.secondary">
                Contas usadas opcionalmente para debitar o valor ao pagar uma despesa ou creditar ao
                receber uma entrada.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openAddBankAccount}
                size="small"
              >
                Adicionar
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {bankAccountsLoading ? (
              <Stack spacing={1}>
                <Skeleton variant="rounded" height={56} />
                <Skeleton variant="rounded" height={56} />
              </Stack>
            ) : bankAccounts.length === 0 ? (
              <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                Nenhuma conta cadastrada.
              </Typography>
            ) : (
              <List disablePadding>
                {bankAccounts.map((account) => (
                  <ListItem key={account.id} divider sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <AccountBalance fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={account.name}
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondary={`Saldo: ${formatCurrencyBRL(account.balance)}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => openEditBankAccount(account)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => setDeleteBankAccountTarget(account)}>
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
              Adicione meses passados ou futuros. As despesas e entradas padrão serão copiadas
              automaticamente.
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
              Exporta todos os meses, despesas, entradas e comprovantes em um arquivo ZIP. A
              importação substitui todos os dados atuais.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={exportData}>
                Exportar
              </Button>
              <Button
                variant="outlined"
                startIcon={<FileUploadIcon />}
                disabled={importing}
                onClick={() => setImportConfirmOpen(true)}
              >
                {importing ? 'Importando...' : 'Importar'}
              </Button>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>

      <DefaultExpenseForm
        key={formKey}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveDefault}
        initial={editingExpense}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir despesa padrão?"
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

      <DefaultIncomeForm
        key={incomeFormKey}
        open={incomeFormOpen}
        bankAccounts={bankAccounts}
        onClose={() => {
          setIncomeFormOpen(false);
          setEditingIncome(null);
        }}
        onSave={handleSaveDefaultIncome}
        initial={editingIncome}
      />

      <ConfirmDialog
        open={!!deleteIncomeTarget}
        title="Excluir entrada padrão?"
        message={
          <>
            Tem certeza que deseja excluir <strong>{deleteIncomeTarget?.name}</strong>? Ela deixará
            de ser criada automaticamente nos próximos meses.
          </>
        }
        loading={deletingIncome}
        onClose={() => setDeleteIncomeTarget(null)}
        onConfirm={handleConfirmDeleteIncome}
      />

      <BankAccountForm
        key={bankAccountFormKey}
        open={bankAccountFormOpen}
        onClose={() => {
          setBankAccountFormOpen(false);
          setEditingBankAccount(null);
        }}
        onSave={handleSaveBankAccount}
        initial={editingBankAccount}
      />

      <ConfirmDialog
        open={!!deleteBankAccountTarget}
        title="Excluir conta?"
        message={
          <>
            Tem certeza que deseja excluir <strong>{deleteBankAccountTarget?.name}</strong>?
            Despesas já pagas com essa conta deixarão de referenciá-la, mas o pagamento em si não
            será desfeito.
          </>
        }
        loading={deletingBankAccount}
        onClose={() => setDeleteBankAccountTarget(null)}
        onConfirm={handleConfirmDeleteBankAccount}
      />

      <ConfirmDialog
        open={importConfirmOpen}
        title="Importar dados?"
        message={
          <>
            Escolha um arquivo ZIP exportado anteriormente. A importação vai{' '}
            <strong>substituir todos os dados atuais</strong> (meses, despesas e comprovantes). Essa
            ação não pode ser desfeita.
          </>
        }
        confirmLabel="Escolher arquivo"
        loading={importing}
        onClose={() => setImportConfirmOpen(false)}
        onConfirm={handleConfirmImport}
      />

      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </Box>
  );
}
