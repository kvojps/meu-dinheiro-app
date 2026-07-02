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
import { Expense } from '../types/models';
import ExpenseCard from '../components/ExpenseCard';
import PayDialog from '../components/PayDialog';
import AddExpenseDialog from '../components/AddExpenseDialog';
import EditExpenseDialog from '../components/EditExpenseDialog';
import ExpenseDetailDialog from '../components/ExpenseDetailDialog';
import DeleteMonthDialog from '../components/DeleteMonthDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import AppSnackbar from '../components/AppSnackbar';
import { useMonth } from '../hooks/useMonth';
import { todayDateString } from '../utils/date';
import { formatCurrencyBRL } from '../utils/format';

const PAGE_SIZE = 12;

type StatusFilter = 'all' | 'pending' | 'paid' | 'overdue';
type SortBy = 'due_date' | 'name' | 'amount';

export default function MonthDetail() {
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
    snackbar,
    closeSnackbar,
    retry,
    pay,
    unpay,
    addExpense,
    editExpense,
    deleteExpense,
    deleteMonth,
  } = useMonth(id);

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

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('due_date');
  const [page, setPage] = useState(1);

  async function handleDeleteExpense() {
    if (!deleteExpenseTarget) return;
    setDeletingExpense(true);
    if (await deleteExpense(deleteExpenseTarget.id)) {
      setDeleteExpenseTarget(null);
    }
    setDeletingExpense(false);
  }

  function openEditDialog(expense: Expense) {
    setEditingExpense(expense);
    setEditKey((k) => k + 1);
    setEditDialogOpen(true);
  }

  async function handleDeleteMonth() {
    if (await deleteMonth()) {
      setDeleteDialogOpen(false);
      navigate('/');
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
        <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
      </Box>
    );
  }

  if (notFound || !month) {
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

  const paidCount = month.expenses.filter((e) => e.is_paid).length;
  const today = todayDateString();

  const summary = month.expenses.reduce(
    (acc, e) => {
      if (e.is_paid) acc.paid += e.amount ?? 0;
      else acc.pending += e.amount ?? 0;
      return acc;
    },
    { paid: 0, pending: 0 }
  );
  const summaryTotal = summary.paid + summary.pending;
  const paidPct = summaryTotal > 0 ? (summary.paid / summaryTotal) * 100 : 0;
  const pendingPct = summaryTotal > 0 ? 100 - paidPct : 0;

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

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconButton onClick={() => navigate('/')}>
          <ArrowBack />
        </IconButton>
        <Tooltip title="Mês anterior">
          <span>
            <IconButton
              disabled={!prevMonthId}
              onClick={() => prevMonthId && navigate(`/months/${prevMonthId}`)}
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
              onClick={() => nextMonthId && navigate(`/months/${nextMonthId}`)}
            >
              <ArrowForwardIos fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Chip
          label={`${paidCount}/${month.expenses.length} pagas`}
          color={
            paidCount === month.expenses.length && month.expenses.length > 0 ? 'success' : 'warning'
          }
          sx={{ ml: 1 }}
        />
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

      {month.expenses.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Total do mês
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {formatCurrencyBRL(summaryTotal)}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              height: 8,
              borderRadius: 1,
              overflow: 'hidden',
              mt: 2,
              mb: 1.5,
              bgcolor: 'action.hover',
            }}
          >
            {summaryTotal > 0 && (
              <>
                <Box sx={{ width: `${paidPct}%`, bgcolor: 'success.main' }} />
                <Box sx={{ width: `${pendingPct}%`, bgcolor: 'warning.main' }} />
              </>
            )}
          </Box>
          <Stack direction="row" spacing={3} flexWrap="wrap">
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
              <Typography variant="body2" color="text.secondary">
                Pago: <strong>{formatCurrencyBRL(summary.paid)}</strong>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'warning.main' }} />
              <Typography variant="body2" color="text.secondary">
                Pendente: <strong>{formatCurrencyBRL(summary.pending)}</strong>
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      )}

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
                    onUnpay={() => unpay(expense.id)}
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

      <PayDialog
        open={payDialogOpen}
        expense={selectedExpense}
        onClose={() => {
          setPayDialogOpen(false);
          setSelectedExpense(null);
        }}
        onConfirm={async (file, notes, paidAt) => {
          if (!selectedExpense) return;
          if (await pay(selectedExpense.id, file, notes, paidAt)) {
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

      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </Box>
  );
}
