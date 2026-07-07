import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Stack,
  FormControl,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  BarChartOutlined,
  TableRowsOutlined,
  ErrorOutline,
} from '@mui/icons-material';
import {
  ComposedChart,
  Bar,
  Cell,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { api } from '@/api/client';
import { Month } from '@shared/types/month';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { formatCurrencyBRL } from '@/utils/format';
import { monthDetailPath } from '@/routes';

function monthKey(year: number, month: number) {
  return `${year}-${String(month).padStart(2, '0')}`;
}

type TabValue = 'expenses' | 'incomes' | 'comparativo';

export function HistoryPage() {
  const [data, setData] = useState<Month[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<TabValue>('expenses');
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const { showError } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  function loadMonths() {
    api
      .getMonths()
      .then((months) => {
        setData(months);
        setError(false);
      })
      .catch((err) => {
        setError(true);
        showError(err);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadMonths();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function retry() {
    setLoading(true);
    setError(false);
    loadMonths();
  }

  const years = useMemo(() => {
    const set = new Set(data.map((m) => m.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [data]);

  const [yearOverride, setYearOverride] = useState<number | null>(null);
  const selectedYear =
    yearOverride !== null && years.includes(yearOverride) ? yearOverride : (years[0] ?? 0);

  const currentIndex = years.indexOf(selectedYear);

  const yearMonths = useMemo(() => {
    return [...data].filter((m) => m.year === selectedYear).sort((a, b) => a.month - b.month);
  }, [data, selectedYear]);

  const now = new Date();
  const currentKey = monthKey(now.getFullYear(), now.getMonth() + 1);

  const expenseChartData = yearMonths.map((m) => {
    const overdue = m.overdue_amount ?? 0;
    const pending = Math.max(0, (m.unpaid_amount ?? 0) - overdue);
    return {
      id: m.id,
      label: m.label,
      isCurrent: monthKey(m.year, m.month) === currentKey,
      Pago: m.paid_amount ?? 0,
      Pendente: pending,
      Vencida: overdue,
    };
  });

  const expenseYearTotals = yearMonths.reduce(
    (acc, m) => {
      const overdue = m.overdue_amount ?? 0;
      return {
        paid: acc.paid + (m.paid_amount ?? 0),
        pending: acc.pending + Math.max(0, (m.unpaid_amount ?? 0) - overdue),
        overdue: acc.overdue + overdue,
      };
    },
    { paid: 0, pending: 0, overdue: 0 }
  );
  const expenseYearTotal =
    expenseYearTotals.paid + expenseYearTotals.pending + expenseYearTotals.overdue;
  const expensePaidPct =
    expenseYearTotal > 0 ? (expenseYearTotals.paid / expenseYearTotal) * 100 : 0;
  const expensePendingPct =
    expenseYearTotal > 0 ? (expenseYearTotals.pending / expenseYearTotal) * 100 : 0;
  const expenseOverduePct = expenseYearTotal > 0 ? 100 - expensePaidPct - expensePendingPct : 0;

  const incomeChartData = yearMonths.map((m) => ({
    id: m.id,
    label: m.label,
    isCurrent: monthKey(m.year, m.month) === currentKey,
    Recebido: m.received_income ?? 0,
    Pendente: m.pending_income ?? 0,
  }));

  const incomeYearTotals = yearMonths.reduce(
    (acc, m) => ({
      received: acc.received + (m.received_income ?? 0),
      pending: acc.pending + (m.pending_income ?? 0),
    }),
    { received: 0, pending: 0 }
  );
  const incomeYearTotal = incomeYearTotals.received + incomeYearTotals.pending;
  const incomeReceivedPct =
    incomeYearTotal > 0 ? (incomeYearTotals.received / incomeYearTotal) * 100 : 0;
  const incomePendingPct = incomeYearTotal > 0 ? 100 - incomeReceivedPct : 0;

  const comparativoData = yearMonths.map((m) => {
    const income = m.total_income ?? 0;
    const expense = m.total_amount ?? 0;
    return {
      id: m.id,
      label: m.label,
      isCurrent: monthKey(m.year, m.month) === currentKey,
      Entradas: income,
      Despesas: expense,
      Saldo: income - expense,
    };
  });

  const comparativoTotals = yearMonths.reduce(
    (acc, m) => ({
      income: acc.income + (m.total_income ?? 0),
      expense: acc.expense + (m.total_amount ?? 0),
    }),
    { income: 0, expense: 0 }
  );
  const comparativoBalance = comparativoTotals.income - comparativoTotals.expense;

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={220} height={48} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={64} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={140} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={400} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <ErrorOutline sx={{ fontSize: 48, color: 'error.main', mb: 1 }} />
        <Typography variant="h5" gutterBottom>
          Não foi possível carregar o histórico
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

  function renderSaldoDot(props: {
    cx?: number;
    cy?: number;
    payload?: { id: number; Saldo: number };
  }) {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null || !payload) return <></>;
    const color = payload.Saldo >= 0 ? theme.palette.success.main : theme.palette.error.main;
    return (
      <circle
        key={`saldo-dot-${payload.id}`}
        cx={cx}
        cy={cy}
        r={5}
        fill={color}
        stroke={theme.palette.background.paper}
        strokeWidth={2}
        cursor="pointer"
        onClick={() => navigate(monthDetailPath(payload.id))}
      />
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Histórico
      </Typography>

      <Paper
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          p: 2,
          mb: 3,
        }}
      >
        <IconButton
          disabled={currentIndex >= years.length - 1}
          onClick={() => setYearOverride(years[currentIndex + 1])}
        >
          <ChevronLeft />
        </IconButton>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select
            value={selectedYear || ''}
            onChange={(e) => setYearOverride(Number(e.target.value))}
          >
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton
          disabled={currentIndex <= 0}
          onClick={() => setYearOverride(years[currentIndex - 1])}
        >
          <ChevronRight />
        </IconButton>
      </Paper>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab value="expenses" label="Despesas" />
        <Tab value="incomes" label="Entradas" />
        <Tab value="comparativo" label="Comparativo" />
      </Tabs>

      {yearMonths.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          Nenhum mês cadastrado em {selectedYear}.
        </Typography>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={view}
              onChange={(_, v) => v && setView(v)}
            >
              <ToggleButton value="chart">
                <BarChartOutlined fontSize="small" sx={{ mr: 0.5 }} />
                Gráfico
              </ToggleButton>
              <ToggleButton value="table">
                <TableRowsOutlined fontSize="small" sx={{ mr: 0.5 }} />
                Tabela
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {tab === 'expenses' && (
            <>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total em {selectedYear}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {formatCurrencyBRL(expenseYearTotal)}
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
                  {expenseYearTotal > 0 && (
                    <>
                      <Box sx={{ width: `${expensePaidPct}%`, bgcolor: 'success.main' }} />
                      <Box sx={{ width: `${expensePendingPct}%`, bgcolor: 'warning.main' }} />
                      <Box sx={{ width: `${expenseOverduePct}%`, bgcolor: 'error.main' }} />
                    </>
                  )}
                </Box>
                <Stack direction="row" spacing={3} flexWrap="wrap">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Pago: <strong>{formatCurrencyBRL(expenseYearTotals.paid)}</strong>
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'warning.main' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Pendente: <strong>{formatCurrencyBRL(expenseYearTotals.pending)}</strong>
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Vencida: <strong>{formatCurrencyBRL(expenseYearTotals.overdue)}</strong>
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>

              {view === 'chart' ? (
                <ResponsiveContainer width="100%" height={isMobile ? 320 : 500}>
                  <ComposedChart
                    data={expenseChartData}
                    margin={isMobile ? { bottom: 40 } : undefined}
                  >
                    {expenseChartData.map(
                      (entry) =>
                        entry.isCurrent && (
                          <ReferenceArea
                            key={entry.label}
                            x1={entry.label}
                            x2={entry.label}
                            fill={theme.palette.primary.main}
                            fillOpacity={0.08}
                            ifOverflow="visible"
                          />
                        )
                    )}
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis
                      dataKey="label"
                      stroke={theme.palette.text.secondary}
                      angle={isMobile ? -40 : 0}
                      textAnchor={isMobile ? 'end' : 'middle'}
                      height={isMobile ? 50 : 30}
                      interval={0}
                      tick={{ fontSize: isMobile ? 11 : 12 }}
                    />
                    <YAxis stroke={theme.palette.text.secondary} />
                    <Tooltip
                      cursor={{ fill: theme.palette.action.hover }}
                      formatter={(value) => formatCurrencyBRL(Number(value) || 0)}
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                      }}
                    />
                    <Legend />
                    <Bar dataKey="Pago" fill={theme.palette.success.main} stackId="a">
                      {expenseChartData.map((entry) => (
                        <Cell
                          key={entry.id}
                          cursor="pointer"
                          onClick={() => navigate(monthDetailPath(entry.id))}
                        />
                      ))}
                    </Bar>
                    <Bar dataKey="Pendente" fill={theme.palette.warning.main} stackId="a">
                      {expenseChartData.map((entry) => (
                        <Cell
                          key={entry.id}
                          cursor="pointer"
                          onClick={() => navigate(monthDetailPath(entry.id))}
                        />
                      ))}
                    </Bar>
                    <Bar
                      dataKey="Vencida"
                      fill={theme.palette.error.main}
                      stackId="a"
                      radius={[4, 4, 0, 0]}
                    >
                      {expenseChartData.map((entry) => (
                        <Cell
                          key={entry.id}
                          cursor="pointer"
                          onClick={() => navigate(monthDetailPath(entry.id))}
                        />
                      ))}
                    </Bar>
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <Paper sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Mês</TableCell>
                        <TableCell align="right">Pago</TableCell>
                        <TableCell align="right">Pendente</TableCell>
                        <TableCell align="right">Vencida</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {expenseChartData.map((row) => (
                        <TableRow
                          key={row.id}
                          hover
                          onClick={() => navigate(monthDetailPath(row.id))}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell sx={{ fontWeight: row.isCurrent ? 700 : 400 }}>
                            {row.label}
                            {row.isCurrent && ' (atual)'}
                          </TableCell>
                          <TableCell align="right">{formatCurrencyBRL(row.Pago)}</TableCell>
                          <TableCell align="right">{formatCurrencyBRL(row.Pendente)}</TableCell>
                          <TableCell align="right">{formatCurrencyBRL(row.Vencida)}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            {formatCurrencyBRL(row.Pago + row.Pendente + row.Vencida)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              )}
            </>
          )}

          {tab === 'incomes' && (
            <>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total em {selectedYear}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {formatCurrencyBRL(incomeYearTotal)}
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
                  {incomeYearTotal > 0 && (
                    <>
                      <Box sx={{ width: `${incomeReceivedPct}%`, bgcolor: 'success.main' }} />
                      <Box sx={{ width: `${incomePendingPct}%`, bgcolor: 'warning.main' }} />
                    </>
                  )}
                </Box>
                <Stack direction="row" spacing={3} flexWrap="wrap">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Recebido: <strong>{formatCurrencyBRL(incomeYearTotals.received)}</strong>
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'warning.main' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      A receber: <strong>{formatCurrencyBRL(incomeYearTotals.pending)}</strong>
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>

              {view === 'chart' ? (
                <ResponsiveContainer width="100%" height={isMobile ? 320 : 500}>
                  <ComposedChart
                    data={incomeChartData}
                    margin={isMobile ? { bottom: 40 } : undefined}
                  >
                    {incomeChartData.map(
                      (entry) =>
                        entry.isCurrent && (
                          <ReferenceArea
                            key={entry.label}
                            x1={entry.label}
                            x2={entry.label}
                            fill={theme.palette.primary.main}
                            fillOpacity={0.08}
                            ifOverflow="visible"
                          />
                        )
                    )}
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis
                      dataKey="label"
                      stroke={theme.palette.text.secondary}
                      angle={isMobile ? -40 : 0}
                      textAnchor={isMobile ? 'end' : 'middle'}
                      height={isMobile ? 50 : 30}
                      interval={0}
                      tick={{ fontSize: isMobile ? 11 : 12 }}
                    />
                    <YAxis stroke={theme.palette.text.secondary} />
                    <Tooltip
                      cursor={{ fill: theme.palette.action.hover }}
                      formatter={(value) => formatCurrencyBRL(Number(value) || 0)}
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                      }}
                    />
                    <Legend />
                    <Bar dataKey="Recebido" fill={theme.palette.success.main} stackId="a">
                      {incomeChartData.map((entry) => (
                        <Cell
                          key={entry.id}
                          cursor="pointer"
                          onClick={() => navigate(monthDetailPath(entry.id))}
                        />
                      ))}
                    </Bar>
                    <Bar
                      dataKey="Pendente"
                      fill={theme.palette.warning.main}
                      stackId="a"
                      radius={[4, 4, 0, 0]}
                    >
                      {incomeChartData.map((entry) => (
                        <Cell
                          key={entry.id}
                          cursor="pointer"
                          onClick={() => navigate(monthDetailPath(entry.id))}
                        />
                      ))}
                    </Bar>
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <Paper sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Mês</TableCell>
                        <TableCell align="right">Recebido</TableCell>
                        <TableCell align="right">Pendente</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {incomeChartData.map((row) => (
                        <TableRow
                          key={row.id}
                          hover
                          onClick={() => navigate(monthDetailPath(row.id))}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell sx={{ fontWeight: row.isCurrent ? 700 : 400 }}>
                            {row.label}
                            {row.isCurrent && ' (atual)'}
                          </TableCell>
                          <TableCell align="right">{formatCurrencyBRL(row.Recebido)}</TableCell>
                          <TableCell align="right">{formatCurrencyBRL(row.Pendente)}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            {formatCurrencyBRL(row.Recebido + row.Pendente)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              )}
            </>
          )}

          {tab === 'comparativo' && (
            <>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Saldo em {selectedYear} (entradas - despesas)
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800 }}
                  color={comparativoBalance >= 0 ? 'success.main' : 'error.main'}
                >
                  {formatCurrencyBRL(comparativoBalance)}
                </Typography>
                <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Entradas: <strong>{formatCurrencyBRL(comparativoTotals.income)}</strong>
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Despesas: <strong>{formatCurrencyBRL(comparativoTotals.expense)}</strong>
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>

              {view === 'chart' ? (
                <ResponsiveContainer width="100%" height={isMobile ? 320 : 420}>
                  <ComposedChart
                    data={comparativoData}
                    margin={isMobile ? { bottom: 40 } : undefined}
                  >
                    {comparativoData.map(
                      (entry) =>
                        entry.isCurrent && (
                          <ReferenceArea
                            key={entry.label}
                            x1={entry.label}
                            x2={entry.label}
                            fill={theme.palette.primary.main}
                            fillOpacity={0.08}
                            ifOverflow="visible"
                          />
                        )
                    )}
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis
                      dataKey="label"
                      stroke={theme.palette.text.secondary}
                      angle={isMobile ? -40 : 0}
                      textAnchor={isMobile ? 'end' : 'middle'}
                      height={isMobile ? 50 : 30}
                      interval={0}
                      tick={{ fontSize: isMobile ? 11 : 12 }}
                    />
                    <YAxis stroke={theme.palette.text.secondary} />
                    <Tooltip
                      cursor={{ stroke: theme.palette.divider }}
                      formatter={(value) => formatCurrencyBRL(Number(value) || 0)}
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                      }}
                    />
                    <ReferenceLine y={0} stroke={theme.palette.divider} />
                    <Line
                      type="monotone"
                      dataKey="Saldo"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                      dot={renderSaldoDot}
                      activeDot={{ r: 6 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <Paper sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Mês</TableCell>
                        <TableCell align="right">Entradas</TableCell>
                        <TableCell align="right">Despesas</TableCell>
                        <TableCell align="right">Saldo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {comparativoData.map((row) => (
                        <TableRow
                          key={row.id}
                          hover
                          onClick={() => navigate(monthDetailPath(row.id))}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell sx={{ fontWeight: row.isCurrent ? 700 : 400 }}>
                            {row.label}
                            {row.isCurrent && ' (atual)'}
                          </TableCell>
                          <TableCell align="right">{formatCurrencyBRL(row.Entradas)}</TableCell>
                          <TableCell align="right">{formatCurrencyBRL(row.Despesas)}</TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              fontWeight: 600,
                              color: row.Saldo >= 0 ? 'success.main' : 'error.main',
                            }}
                          >
                            {formatCurrencyBRL(row.Saldo)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
}
