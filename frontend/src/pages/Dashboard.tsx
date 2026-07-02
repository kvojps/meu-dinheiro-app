import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Chip,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  LinearProgress,
  Skeleton,
} from '@mui/material';
import { ErrorOutline, ReportProblemOutlined } from '@mui/icons-material';
import { api } from '../api/client';
import { Month } from '../types/models';
import AppSnackbar from '../components/AppSnackbar';
import { useSnackbar } from '../hooks/useSnackbar';
import { useBankAccounts } from '../hooks/useBankAccounts';
import { formatCurrencyBRL } from '../utils/format';

const INITIAL_VISIBLE = 12;
const LOAD_MORE_STEP = 12;

function monthKey(year: number, month: number) {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export default function Dashboard() {
  const [months, setMonths] = useState<Month[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fromOverride, setFromOverride] = useState('');
  const [toOverride, setToOverride] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const navigate = useNavigate();
  const { snackbar, showSnackbar, showError, closeSnackbar } = useSnackbar();
  const { bankAccounts } = useBankAccounts(showError, showSnackbar);
  const totalBankBalance = useMemo(
    () => bankAccounts.reduce((sum, a) => sum + a.balance, 0),
    [bankAccounts]
  );

  const loadMonths = useCallback(() => {
    api
      .getMonths()
      .then((data) => {
        setMonths(data);
        setError(false);
      })
      .catch((err) => {
        setError(true);
        showError(err);
      })
      .finally(() => setLoading(false));
  }, [showError]);

  useEffect(() => {
    loadMonths();
  }, [loadMonths]);

  function handleRetry() {
    setLoading(true);
    setError(false);
    loadMonths();
  }

  const monthOptions = useMemo(() => {
    return [...months]
      .sort((a, b) => a.year - b.year || a.month - b.month)
      .map((m) => ({
        label: m.label,
        value: monthKey(m.year, m.month),
      }));
  }, [months]);

  const firstOption = monthOptions[0]?.value ?? '';
  const lastOption = monthOptions[monthOptions.length - 1]?.value ?? '';
  const fromValue = fromOverride || firstOption;
  const toValue = toOverride || lastOption;
  const isFiltered = fromValue !== firstOption || toValue !== lastOption;

  function applyRange(from: string, to: string) {
    setFromOverride(from);
    setToOverride(to);
    setVisibleCount(INITIAL_VISIBLE);
  }

  function handleFromChange(value: string) {
    applyRange(value, value > toValue ? value : toOverride);
  }

  function handleToChange(value: string) {
    applyRange(value < fromValue ? value : fromOverride, value);
  }

  function handleClearRange() {
    applyRange('', '');
  }

  function handleQuickLast3() {
    if (monthOptions.length === 0) return;
    const start = monthOptions[Math.max(0, monthOptions.length - 3)].value;
    applyRange(start, lastOption);
  }

  function handleQuickThisYear() {
    const now = new Date();
    const yearOptions = monthOptions.filter((opt) => opt.value.startsWith(`${now.getFullYear()}`));
    if (yearOptions.length === 0) return;
    applyRange(yearOptions[0].value, yearOptions[yearOptions.length - 1].value);
  }

  const filteredMonths = useMemo(() => {
    return months
      .filter((m) => {
        const key = monthKey(m.year, m.month);
        return key >= fromValue && key <= toValue;
      })
      .sort((a, b) => b.year - a.year || b.month - a.month);
  }, [months, fromValue, toValue]);

  const visibleMonths = filteredMonths.slice(0, visibleCount);
  const hasMore = filteredMonths.length > visibleCount;

  const summary = useMemo(
    () =>
      filteredMonths.reduce(
        (acc, m) => ({
          paid: acc.paid + (m.paid_amount ?? 0),
          pending: acc.pending + (m.unpaid_amount ?? 0),
          received: acc.received + (m.received_income ?? 0),
          pendingIncome: acc.pendingIncome + (m.pending_income ?? 0),
        }),
        { paid: 0, pending: 0, received: 0, pendingIncome: 0 }
      ),
    [filteredMonths]
  );

  const balance = summary.received - summary.paid;

  const now = new Date();
  const currentKey = monthKey(now.getFullYear(), now.getMonth() + 1);

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rounded" height={148} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={72} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={150} />
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
          Não foi possível carregar os meses
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Verifique sua conexão e tente novamente.
        </Typography>
        <Button variant="contained" onClick={handleRetry}>
          Tentar novamente
        </Button>
        <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
      </Box>
    );
  }

  if (months.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Nenhum mês cadastrado
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Vá para a página de Configuração para iniciar.
        </Typography>
        <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
      </Box>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        {bankAccounts.length > 0 && (
          <>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Saldo em contas
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontWeight: 800 }}
              color={totalBankBalance < 0 ? 'error.main' : 'text.primary'}
            >
              {formatCurrencyBRL(totalBankBalance)}
            </Typography>
            <Divider sx={{ my: 2.5 }} />
          </>
        )}

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Balanço do período (entradas - despesas)
        </Typography>
        <Typography
          variant={bankAccounts.length > 0 ? 'h5' : 'h3'}
          sx={{ fontWeight: 800 }}
          color={balance >= 0 ? 'success.main' : 'error.main'}
        >
          {formatCurrencyBRL(balance)}
        </Typography>

        <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
            <Typography variant="body2" color="text.secondary">
              Recebido: <strong>{formatCurrencyBRL(summary.received)}</strong>
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'warning.main' }} />
            <Typography variant="body2" color="text.secondary">
              A receber: <strong>{formatCurrencyBRL(summary.pendingIncome)}</strong>
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main' }} />
            <Typography variant="body2" color="text.secondary">
              Pago: <strong>{formatCurrencyBRL(summary.paid)}</strong>
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary">
              A pagar: <strong>{formatCurrencyBRL(summary.pending)}</strong>
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography variant="subtitle1" sx={{ minWidth: 80 }}>
            Exibir meses:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>De</InputLabel>
            <Select
              value={fromValue}
              label="De"
              onChange={(e) => handleFromChange(e.target.value)}
            >
              {monthOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Até</InputLabel>
            <Select value={toValue} label="Até" onChange={(e) => handleToChange(e.target.value)}>
              {monthOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label="Últimos 3 meses" size="small" variant="outlined" onClick={handleQuickLast3} />
            <Chip label="Este ano" size="small" variant="outlined" onClick={handleQuickThisYear} />
            <Chip label="Tudo" size="small" variant="outlined" onClick={handleClearRange} />
          </Stack>

          {isFiltered && (
            <Button size="small" onClick={handleClearRange} sx={{ ml: 'auto' }}>
              Limpar filtro
            </Button>
          )}
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {visibleMonths.map((month) => {
          const total = month.total_expenses ?? 0;
          const paid = month.paid_expenses ?? 0;
          const overdue = month.overdue_expenses ?? 0;
          const allPaid = total > 0 && paid === total;
          const isCurrent = monthKey(month.year, month.month) === currentKey;
          const totalAmount = month.total_amount ?? 0;
          const balance = (month.total_income ?? 0) - totalAmount;

          let statusColor: 'success' | 'warning' | 'default' = 'default';
          if (total > 0) {
            statusColor = allPaid ? 'success' : paid > 0 ? 'warning' : 'default';
          }

          return (
            <Grid item xs={12} sm={6} md={4} key={month.id}>
              <Card
                sx={{
                  borderLeft: isCurrent ? '4px solid' : undefined,
                  borderLeftColor: isCurrent ? 'primary.main' : undefined,
                }}
              >
                <CardActionArea onClick={() => navigate(`/months/${month.id}`)}>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 1.5,
                        gap: 1,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {month.label}
                        </Typography>
                        {isCurrent && <Chip label="Atual" color="primary" size="small" />}
                      </Stack>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" justifyContent="flex-end">
                        {total > 0 ? (
                          <Chip label={`${paid}/${total} pagas`} color={statusColor} size="small" />
                        ) : (
                          <Chip label="Sem despesas" size="small" />
                        )}
                        {overdue > 0 && (
                          <Chip
                            icon={<ReportProblemOutlined fontSize="small" />}
                            label={`${overdue} vencida${overdue > 1 ? 's' : ''}`}
                            color="error"
                            size="small"
                          />
                        )}
                      </Stack>
                    </Box>

                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700 }}
                      color={balance >= 0 ? 'success.main' : 'error.main'}
                    >
                      {formatCurrencyBRL(balance)}
                    </Typography>

                    {(totalAmount > 0 || (month.total_income ?? 0) > 0) && (
                      <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                        <Typography variant="body2" color="success.main">
                          Entradas: {formatCurrencyBRL(month.total_income ?? 0)}
                        </Typography>
                        <Typography variant="body2" color="error.main">
                          Despesas: {formatCurrencyBRL(totalAmount)}
                        </Typography>
                      </Stack>
                    )}

                    {total > 0 && (
                      <Box sx={{ mt: 1.5 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(paid / total) * 100}
                          color={allPaid ? 'success' : 'warning'}
                          sx={{ height: 6, borderRadius: 1, mb: 0.5 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {Math.round((paid / total) * 100)}% pago
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredMonths.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          Nenhum mês encontrado no intervalo selecionado.
        </Typography>
      )}

      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button variant="outlined" onClick={() => setVisibleCount((v) => v + LOAD_MORE_STEP)}>
            Carregar mais meses
          </Button>
        </Box>
      )}

      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </Box>
  );
}
