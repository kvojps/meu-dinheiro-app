import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  Pagination,
  Skeleton,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  ArrowBackIosNew,
  ArrowForwardIos,
  DeleteOutline,
  ErrorOutline,
  MoreVert,
  Search,
} from '@mui/icons-material';
import { Expense, Income } from '@/types/models';
import { ExpenseCard } from './components/ExpenseCard';
import { PayDialog } from './components/PayDialog';
import { AddExpenseDialog } from './components/AddExpenseDialog';
import { EditExpenseDialog } from './components/EditExpenseDialog';
import { ExpenseDetailDialog } from './components/ExpenseDetailDialog';
import { IncomeCard } from './components/IncomeCard';
import { ReceiveDialog } from './components/ReceiveDialog';
import { AddIncomeDialog } from './components/AddIncomeDialog';
import { EditIncomeDialog } from './components/EditIncomeDialog';
import { IncomeDetailDialog } from './components/IncomeDetailDialog';
import { DeleteMonthDialog } from './components/DeleteMonthDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useMonth } from '@/hooks/months/useMonth';
import { useBankAccounts } from '@/hooks/bank-accounts/useBankAccounts';
import { todayDateString } from '@/utils/date';
import { formatCurrencyBRL } from '@/utils/format';
import { ROUTES, monthDetailPath } from '@/routes';

const PAGE_SIZE = 12;

type StatusFilter = 'all' | 'pending' | 'paid' | 'overdue';
type IncomeStatusFilter = 'all' | 'pending' | 'received';
type SortBy = 'due_date' | 'name' | 'amount';

export function MonthDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    month,
    loading,
    notFound,
    error,
    prevMonthId,
    nextMonthId,
    deleting,
    retry,
    pay,
    unpay,
    addExpense,
    editExpense,
    deleteExpense,
    receive,
    unreceive,
    addIncome,
    editIncome,
    deleteIncome,
    deleteMonth,
  } = useMonth(id);
  const { bankAccounts } = useBankAccounts();

  const [tab, setTab] = useState<'expenses' | 'incomes'>('expenses');

  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [headerMenuAnchor, setHeaderMenuAnchor] = useState<HTMLElement | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editKey, setEditKey] = useState(0);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailExpense, setDetailExpense] = useState<Expense | null>(null);

  const [deleteExpenseTarget, setDeleteExpenseTarget] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState(false);

  const [unpayTarget, setUnpayTarget] = useState<Expense | null>(null);
  const [unpaying, setUnpaying] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('due_date');
  const [page, setPage] = useState(1);

  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);

  const [addIncomeDialogOpen, setAddIncomeDialogOpen] = useState(false);

  const [editIncomeDialogOpen, setEditIncomeDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [editIncomeKey, setEditIncomeKey] = useState(0);

  const [incomeDetailOpen, setIncomeDetailOpen] = useState(false);
  const [detailIncome, setDetailIncome] = useState<Income | null>(null);

  const [deleteIncomeTarget, setDeleteIncomeTarget] = useState<Income | null>(null);
  const [deletingIncome, setDeletingIncome] = useState(false);

  const [unreceiveTarget, setUnreceiveTarget] = useState<Income | null>(null);
  const [unreceiving, setUnreceiving] = useState(false);

  const [incomeSearch, setIncomeSearch] = useState('');
  const [incomeStatusFilter, setIncomeStatusFilter] = useState<IncomeStatusFilter>('all');
  const [incomeSortBy, setIncomeSortBy] = useState<SortBy>('due_date');
  const [incomePage, setIncomePage] = useState(1);

  async function handleDeleteExpense() {
    if (!deleteExpenseTarget) return;
    setDeletingExpense(true);
    if (await deleteExpense(deleteExpenseTarget.id)) {
      setDeleteExpenseTarget(null);
    }
    setDeletingExpense(false);
  }

  async function handleUnpay() {
    if (!unpayTarget) return;
    setUnpaying(true);
    if (await unpay(unpayTarget.id)) {
      setUnpayTarget(null);
    }
    setUnpaying(false);
  }

  function openEditDialog(expense: Expense) {
    setEditingExpense(expense);
    setEditKey((k) => k + 1);
    setEditDialogOpen(true);
  }

  async function handleDeleteIncome() {
    if (!deleteIncomeTarget) return;
    setDeletingIncome(true);
    if (await deleteIncome(deleteIncomeTarget.id)) {
      setDeleteIncomeTarget(null);
    }
    setDeletingIncome(false);
  }

  async function handleUnreceive() {
    if (!unreceiveTarget) return;
    setUnreceiving(true);
    if (await unreceive(unreceiveTarget.id)) {
      setUnreceiveTarget(null);
    }
    setUnreceiving(false);
  }

  function openEditIncomeDialog(income: Income) {
    setEditingIncome(income);
    setEditIncomeKey((k) => k + 1);
    setEditIncomeDialogOpen(true);
  }

  async function handleDeleteMonth() {
    if (await deleteMonth()) {
      setDeleteDialogOpen(false);
      navigate(ROUTES.DASHBOARD);
    }
  }

  function handleStatusFilter(value: StatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleSort(value: SortBy) {
    setSortBy(value);
    setPage(1);
  }

  function handleIncomeStatusFilter(value: IncomeStatusFilter) {
    setIncomeStatusFilter(value);
    setIncomePage(1);
  }

  function handleIncomeSearch(value: string) {
    setIncomeSearch(value);
    setIncomePage(1);
  }

  function handleIncomeSort(value: SortBy) {
    setIncomeSortBy(value);
    setIncomePage(1);
  }

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rounded" height={48} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={120} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={72} sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={180} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <ErrorOutline sx={{ fontSize: 48, color: 'error.main', mb: 1 }} />
        <Typography variant="h5" gutterBottom>
          Não foi possível carregar o mês
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Verifique sua conexão e tente novamente.
        </Typography>
        <Button variant="contained" onClick={retry}>
          Tentar novamente
        </Button>
      </Box>
    );
  }

  if (notFound || !month) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h5">Mês não encontrado</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(ROUTES.DASHBOARD)} sx={{ mt: 2 }}>
          Voltar
        </Button>
      </Box>
    );
  }

  const paidCount = month.expenses.filter((e) => e.is_paid).length;
  const receivedCount = month.incomes.filter((i) => i.is_received).length;
  const today = todayDateString();

  const expenseSummary = month.expenses.reduce(
    (acc, e) => {
      if (e.is_paid) acc.paid += e.amount ?? 0;
      else acc.pending += e.amount ?? 0;
      return acc;
    },
    { paid: 0, pending: 0 }
  );

  const incomeSummary = month.incomes.reduce(
    (acc, i) => {
      if (i.is_received) acc.received += i.amount ?? 0;
      else acc.pending += i.amount ?? 0;
      return acc;
    },
    { received: 0, pending: 0 }
  );

  const balance = incomeSummary.received - expenseSummary.paid;

  const filteredExpenses = month.expenses
    .filter((e) => e.name.toLowerCase().includes(search.trim().toLowerCase()))
    .filter((e) => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'paid') return !!e.is_paid;
      if (statusFilter === 'overdue') return !e.is_paid && !!e.due_date && e.due_date < today;
      return !e.is_paid;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'pt-BR');
      if (sortBy === 'amount') return (b.amount ?? 0) - (a.amount ?? 0);
      return (a.due_date || '9999-99-99').localeCompare(b.due_date || '9999-99-99');
    });

  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / PAGE_SIZE));
  const paginatedExpenses = filteredExpenses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const filteredIncomes = month.incomes
    .filter((i) => i.name.toLowerCase().includes(incomeSearch.trim().toLowerCase()))
    .filter((i) => {
      if (incomeStatusFilter === 'all') return true;
      if (incomeStatusFilter === 'received') return !!i.is_received;
      return !i.is_received;
    })
    .sort((a, b) => {
      if (incomeSortBy === 'name') return a.name.localeCompare(b.name, 'pt-BR');
      if (incomeSortBy === 'amount') return (b.amount ?? 0) - (a.amount ?? 0);
      return (a.expected_date || '9999-99-99').localeCompare(b.expected_date || '9999-99-99');
    });

  const incomeTotalPages = Math.max(1, Math.ceil(filteredIncomes.length / PAGE_SIZE));
  const paginatedIncomes = filteredIncomes.slice(
    (incomePage - 1) * PAGE_SIZE,
    incomePage * PAGE_SIZE
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconButton onClick={() => navigate(ROUTES.DASHBOARD)}>
          <ArrowBack />
        </IconButton>
        <Tooltip title="Mês anterior">
          <span>
            <IconButton
              disabled={!prevMonthId}
              onClick={() => prevMonthId && navigate(monthDetailPath(prevMonthId))}
            >
              <ArrowBackIosNew fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Typography variant="h4" sx={{ flex: 1 }}>
          {month.label}
        </Typography>
        <Tooltip title="Próximo mês">
          <span>
            <IconButton
              disabled={!nextMonthId}
              onClick={() => nextMonthId && navigate(monthDetailPath(nextMonthId))}
            >
              <ArrowForwardIos fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <IconButton onClick={(e) => setHeaderMenuAnchor(e.currentTarget)}>
          <MoreVert />
        </IconButton>
        <Menu
          anchorEl={headerMenuAnchor}
          open={!!headerMenuAnchor}
          onClose={() => setHeaderMenuAnchor(null)}
        >
          <MenuItem
            onClick={() => {
              setHeaderMenuAnchor(null);
              setDeleteDialogOpen(true);
            }}
          >
            <ListItemIcon>
              <DeleteOutline fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText sx={{ color: 'error.main' }}>Excluir mês</ListItemText>
          </MenuItem>
        </Menu>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Saldo do mês
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800 }}
          color={balance >= 0 ? 'success.main' : 'error.main'}
        >
          {formatCurrencyBRL(balance)}
        </Typography>
        <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
            <Typography variant="body2" color="text.secondary">
              Recebido: <strong>{formatCurrencyBRL(incomeSummary.received)}</strong>
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'warning.main' }} />
            <Typography variant="body2" color="text.secondary">
              A receber: <strong>{formatCurrencyBRL(incomeSummary.pending)}</strong>
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main' }} />
            <Typography variant="body2" color="text.secondary">
              Pago: <strong>{formatCurrencyBRL(expenseSummary.paid)}</strong>
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary">
              A pagar: <strong>{formatCurrencyBRL(expenseSummary.pending)}</strong>
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab value="expenses" label={`Despesas (${paidCount}/${month.expenses.length})`} />
        <Tab value="incomes" label={`Entradas (${receivedCount}/${month.incomes.length})`} />
      </Tabs>

      {tab === 'expenses' ? (
        <>
          {month.expenses.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                Nenhuma despesa cadastrada neste mês.
              </Typography>
              <Button variant="outlined" onClick={() => setAddDialogOpen(true)}>
                Adicionar Despesa
              </Button>
            </Paper>
          ) : (
            <>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                  <TextField
                    size="small"
                    placeholder="Buscar despesa..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    sx={{ minWidth: 200 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                      label="Todas"
                      size="small"
                      color={statusFilter === 'all' ? 'primary' : undefined}
                      variant={statusFilter === 'all' ? 'filled' : 'outlined'}
                      onClick={() => handleStatusFilter('all')}
                    />
                    <Chip
                      label="Pendentes"
                      size="small"
                      color={statusFilter === 'pending' ? 'primary' : undefined}
                      variant={statusFilter === 'pending' ? 'filled' : 'outlined'}
                      onClick={() => handleStatusFilter('pending')}
                    />
                    <Chip
                      label="Pagas"
                      size="small"
                      color={statusFilter === 'paid' ? 'primary' : undefined}
                      variant={statusFilter === 'paid' ? 'filled' : 'outlined'}
                      onClick={() => handleStatusFilter('paid')}
                    />
                    <Chip
                      label="Vencidas"
                      size="small"
                      color={statusFilter === 'overdue' ? 'primary' : undefined}
                      variant={statusFilter === 'overdue' ? 'filled' : 'outlined'}
                      onClick={() => handleStatusFilter('overdue')}
                    />
                  </Stack>

                  <FormControl size="small" sx={{ minWidth: 160, ml: 'auto' }}>
                    <InputLabel>Ordenar por</InputLabel>
                    <Select
                      value={sortBy}
                      label="Ordenar por"
                      onChange={(e) => handleSort(e.target.value as SortBy)}
                    >
                      <MenuItem value="due_date">Vencimento</MenuItem>
                      <MenuItem value="name">Nome</MenuItem>
                      <MenuItem value="amount">Valor</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Paper>

              {filteredExpenses.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                  Nenhuma despesa encontrada com esses filtros.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {paginatedExpenses.map((expense) => (
                    <Grid item xs={12} sm={6} md={4} key={expense.id}>
                      <ExpenseCard
                        expense={expense}
                        onPay={() => {
                          setSelectedExpense(expense);
                          setPayDialogOpen(true);
                        }}
                        onUnpay={() => setUnpayTarget(expense)}
                        onViewDetail={() => {
                          setDetailExpense(expense);
                          setDetailOpen(true);
                        }}
                        onEdit={() => openEditDialog(expense)}
                        onDelete={() => setDeleteExpenseTarget(expense)}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, v) => setPage(v)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button variant="outlined" onClick={() => setAddDialogOpen(true)}>
              Adicionar Despesa
            </Button>
          </Box>
        </>
      ) : (
        <>
          {month.incomes.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                Nenhuma entrada cadastrada neste mês.
              </Typography>
              <Button variant="outlined" onClick={() => setAddIncomeDialogOpen(true)}>
                Adicionar Entrada
              </Button>
            </Paper>
          ) : (
            <>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                  <TextField
                    size="small"
                    placeholder="Buscar entrada..."
                    value={incomeSearch}
                    onChange={(e) => handleIncomeSearch(e.target.value)}
                    sx={{ minWidth: 200 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                      label="Todas"
                      size="small"
                      color={incomeStatusFilter === 'all' ? 'primary' : undefined}
                      variant={incomeStatusFilter === 'all' ? 'filled' : 'outlined'}
                      onClick={() => handleIncomeStatusFilter('all')}
                    />
                    <Chip
                      label="Pendentes"
                      size="small"
                      color={incomeStatusFilter === 'pending' ? 'primary' : undefined}
                      variant={incomeStatusFilter === 'pending' ? 'filled' : 'outlined'}
                      onClick={() => handleIncomeStatusFilter('pending')}
                    />
                    <Chip
                      label="Recebidas"
                      size="small"
                      color={incomeStatusFilter === 'received' ? 'primary' : undefined}
                      variant={incomeStatusFilter === 'received' ? 'filled' : 'outlined'}
                      onClick={() => handleIncomeStatusFilter('received')}
                    />
                  </Stack>

                  <FormControl size="small" sx={{ minWidth: 160, ml: 'auto' }}>
                    <InputLabel>Ordenar por</InputLabel>
                    <Select
                      value={incomeSortBy}
                      label="Ordenar por"
                      onChange={(e) => handleIncomeSort(e.target.value as SortBy)}
                    >
                      <MenuItem value="due_date">Data prevista</MenuItem>
                      <MenuItem value="name">Nome</MenuItem>
                      <MenuItem value="amount">Valor</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Paper>

              {filteredIncomes.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                  Nenhuma entrada encontrada com esses filtros.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {paginatedIncomes.map((income) => (
                    <Grid item xs={12} sm={6} md={4} key={income.id}>
                      <IncomeCard
                        income={income}
                        onReceive={() => {
                          setSelectedIncome(income);
                          setReceiveDialogOpen(true);
                        }}
                        onUnreceive={() => setUnreceiveTarget(income)}
                        onViewDetail={() => {
                          setDetailIncome(income);
                          setIncomeDetailOpen(true);
                        }}
                        onEdit={() => openEditIncomeDialog(income)}
                        onDelete={() => setDeleteIncomeTarget(income)}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}

              {incomeTotalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={incomeTotalPages}
                    page={incomePage}
                    onChange={(_, v) => setIncomePage(v)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button variant="outlined" onClick={() => setAddIncomeDialogOpen(true)}>
              Adicionar Entrada
            </Button>
          </Box>
        </>
      )}

      <PayDialog
        open={payDialogOpen}
        expense={selectedExpense}
        bankAccounts={bankAccounts}
        onClose={() => {
          setPayDialogOpen(false);
          setSelectedExpense(null);
        }}
        onConfirm={async (file, notes, paidAt, bankAccountId) => {
          if (!selectedExpense) return;
          if (await pay(selectedExpense.id, file, notes, paidAt, bankAccountId)) {
            setPayDialogOpen(false);
            setSelectedExpense(null);
          }
        }}
      />

      <AddExpenseDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={addExpense}
      />

      {editingExpense && (
        <EditExpenseDialog
          key={editKey}
          open={editDialogOpen}
          expense={editingExpense}
          onClose={() => {
            setEditDialogOpen(false);
            setEditingExpense(null);
          }}
          onSubmit={(data) => editExpense(editingExpense.id, data)}
        />
      )}

      <ExpenseDetailDialog
        open={detailOpen}
        expense={detailExpense}
        onClose={() => setDetailOpen(false)}
      />

      <ReceiveDialog
        open={receiveDialogOpen}
        income={selectedIncome}
        bankAccounts={bankAccounts}
        onClose={() => {
          setReceiveDialogOpen(false);
          setSelectedIncome(null);
        }}
        onConfirm={async (notes, receivedAt, bankAccountId) => {
          if (!selectedIncome) return;
          if (await receive(selectedIncome.id, notes, receivedAt, bankAccountId)) {
            setReceiveDialogOpen(false);
            setSelectedIncome(null);
          }
        }}
      />

      <AddIncomeDialog
        open={addIncomeDialogOpen}
        bankAccounts={bankAccounts}
        onClose={() => setAddIncomeDialogOpen(false)}
        onSubmit={addIncome}
      />

      {editingIncome && (
        <EditIncomeDialog
          key={editIncomeKey}
          open={editIncomeDialogOpen}
          income={editingIncome}
          bankAccounts={bankAccounts}
          onClose={() => {
            setEditIncomeDialogOpen(false);
            setEditingIncome(null);
          }}
          onSubmit={(data) => editIncome(editingIncome.id, data)}
        />
      )}

      <IncomeDetailDialog
        open={incomeDetailOpen}
        income={detailIncome}
        onClose={() => setIncomeDetailOpen(false)}
      />

      <DeleteMonthDialog
        open={deleteDialogOpen}
        monthLabel={month.label}
        deleting={deleting}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteMonth}
      />

      <ConfirmDialog
        open={!!deleteExpenseTarget}
        title="Excluir despesa?"
        message={
          <>
            Tem certeza que deseja excluir <strong>{deleteExpenseTarget?.name}</strong>? Essa ação
            não pode ser desfeita.
          </>
        }
        loading={deletingExpense}
        onClose={() => setDeleteExpenseTarget(null)}
        onConfirm={handleDeleteExpense}
      />

      <ConfirmDialog
        open={!!unpayTarget}
        title="Desmarcar pagamento?"
        message={
          <>
            Tem certeza que deseja desmarcar o pagamento de <strong>{unpayTarget?.name}</strong>?
          </>
        }
        confirmLabel="Desmarcar"
        confirmColor="warning"
        loading={unpaying}
        onClose={() => setUnpayTarget(null)}
        onConfirm={handleUnpay}
      />

      <ConfirmDialog
        open={!!deleteIncomeTarget}
        title="Excluir entrada?"
        message={
          <>
            Tem certeza que deseja excluir <strong>{deleteIncomeTarget?.name}</strong>? Essa ação
            não pode ser desfeita.
          </>
        }
        loading={deletingIncome}
        onClose={() => setDeleteIncomeTarget(null)}
        onConfirm={handleDeleteIncome}
      />

      <ConfirmDialog
        open={!!unreceiveTarget}
        title="Desmarcar recebimento?"
        message={
          <>
            Tem certeza que deseja desmarcar o recebimento de{' '}
            <strong>{unreceiveTarget?.name}</strong>?
          </>
        }
        confirmLabel="Desmarcar"
        confirmColor="warning"
        loading={unreceiving}
        onClose={() => setUnreceiveTarget(null)}
        onConfirm={handleUnreceive}
      />
    </Box>
  );
}
